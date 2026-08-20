import "server-only";

import {
  PromotionAssetKind,
  PromotionStatus,
} from "@prisma/client";
import { requireAdmin, requireUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { isPromotionAssetMimeType } from "@/lib/promotions/asset-policy";
import {
  deletePromotionAssetBlob,
  getPrivatePromotionAsset,
  PromotionStorageError,
  uploadPromotionAsset,
} from "@/lib/promotions/storage";
import { isPromotionCurrentlyPublished } from "@/lib/promotions/publication";
import { validatePromotionForPublishing } from "@/lib/promotions/validation";

export type PromotionAssetServiceErrorCode =
  | "ASSET_NOT_FOUND"
  | "FORBIDDEN"
  | "METADATA_CREATE_FAILED"
  | "METADATA_DELETE_FAILED"
  | "PASSWORD_CHANGE_REQUIRED"
  | "PUBLISHED_PROMOTION_INVALID"
  | "PROMOTION_NOT_FOUND"
  | "UPLOAD_COMPENSATION_FAILED";

export class PromotionAssetServiceError extends Error {
  constructor(
    public readonly code: PromotionAssetServiceErrorCode,
    message: string
  ) {
    super(message);
    this.name = "PromotionAssetServiceError";
  }
}

export async function createPromotionAssetForAdmin(input: {
  promotionId: string;
  kind: PromotionAssetKind;
  displayName: string;
  altText: string | null;
  sortOrder: number;
  file: File;
}) {
  await requireAdmin();

  const promotion = await prisma.promotion.findUnique({
    where: { id: input.promotionId },
    select: { id: true, slug: true },
  });

  if (!promotion) {
    throw new PromotionAssetServiceError(
      "PROMOTION_NOT_FOUND",
      "La promoción no existe."
    );
  }

  const stored = await uploadPromotionAsset(input);

  try {
    const asset = await prisma.promotionAsset.create({
      data: {
        promotionId: promotion.id,
        kind: input.kind,
        displayName: input.displayName,
        fileKey: stored.fileKey,
        mimeType: stored.mimeType,
        altText: input.altText,
        sortOrder: input.sortOrder,
        sizeBytes: stored.sizeBytes,
        checksum: stored.checksum,
      },
      select: {
        id: true,
        promotionId: true,
        kind: true,
        displayName: true,
        mimeType: true,
        altText: true,
        sortOrder: true,
        sizeBytes: true,
        width: true,
        height: true,
        createdAt: true,
      },
    });

    return { asset, promotionSlug: promotion.slug };
  } catch {
    try {
      await deletePromotionAssetBlob({
        fileKey: stored.fileKey,
      });
    } catch {
      console.error(
        "No se pudo compensar el Blob tras fallar la metadata de promoción."
      );
      throw new PromotionAssetServiceError(
        "UPLOAD_COMPENSATION_FAILED",
        "Falló la metadata y también la compensación del archivo subido."
      );
    }

    throw new PromotionAssetServiceError(
      "METADATA_CREATE_FAILED",
      "No se pudo registrar el material de la promoción."
    );
  }
}

export async function deletePromotionAssetForAdmin(assetId: string) {
  await requireAdmin();

  const asset = await prisma.promotionAsset.findUnique({
    where: { id: assetId },
    select: {
      id: true,
      fileKey: true,
      promotion: {
        select: {
          title: true,
          slug: true,
          shortDescription: true,
          category: true,
          kind: true,
          status: true,
          validFrom: true,
          validUntil: true,
          assets: {
            where: { id: { not: assetId } },
            select: {
              kind: true,
              fileKey: true,
              mimeType: true,
            },
          },
        },
      },
    },
  });

  if (!asset) {
    throw new PromotionAssetServiceError(
      "ASSET_NOT_FOUND",
      "El material no existe."
    );
  }

  if (asset.promotion.status === PromotionStatus.PUBLISHED) {
    const validation = validatePromotionForPublishing(asset.promotion);

    if (!validation.valid) {
      throw new PromotionAssetServiceError(
        "PUBLISHED_PROMOTION_INVALID",
        "Despublica la promoción o agrega un reemplazo antes de eliminar este material."
      );
    }
  }

  await deletePromotionAssetBlob({ fileKey: asset.fileKey });

  try {
    await prisma.promotionAsset.delete({ where: { id: asset.id } });
  } catch {
    throw new PromotionAssetServiceError(
      "METADATA_DELETE_FAILED",
      "El archivo fue eliminado, pero su metadata requiere reintento."
    );
  }

  return { promotionSlug: asset.promotion.slug };
}

export async function readAuthorizedPrivatePromotionAsset(input: {
  assetId: string;
  ifNoneMatch?: string;
}) {
  const user = await requireUser();

  if (user.mustChangePassword) {
    throw new PromotionAssetServiceError(
      "PASSWORD_CHANGE_REQUIRED",
      "Debes cambiar tu contraseña antes de abrir materiales privados."
    );
  }

  const asset = await prisma.promotionAsset.findUnique({
    where: { id: input.assetId },
    select: {
      id: true,
      displayName: true,
      fileKey: true,
      mimeType: true,
      sizeBytes: true,
      promotion: {
        select: {
          status: true,
          validFrom: true,
          validUntil: true,
        },
      },
    },
  });

  if (!asset) {
    throw new PromotionAssetServiceError(
      "ASSET_NOT_FOUND",
      "El material no existe."
    );
  }

  if (!isPromotionAssetMimeType(asset.mimeType)) {
    throw new PromotionStorageError(
      "UNSUPPORTED_MIME",
      "El material tiene un tipo MIME no permitido."
    );
  }

  if (
    user.role !== "ADMIN" &&
    !isPromotionCurrentlyPublished(asset.promotion)
  ) {
    throw new PromotionAssetServiceError(
      "FORBIDDEN",
      "El material no pertenece a una promoción publicada y vigente."
    );
  }

  const blob = await getPrivatePromotionAsset({
    fileKey: asset.fileKey,
    ifNoneMatch: input.ifNoneMatch,
  });

  if (
    blob.statusCode === 200 &&
    blob.blob.contentType.toLowerCase() !== asset.mimeType.toLowerCase()
  ) {
    throw new PromotionStorageError(
      "INVALID_FILE_CONTENT",
      "El MIME almacenado no coincide con la metadata."
    );
  }

  if (
    blob.statusCode === 200 &&
    asset.sizeBytes !== null &&
    blob.blob.size !== asset.sizeBytes
  ) {
    throw new PromotionStorageError(
      "INVALID_FILE_CONTENT",
      "El tamaño almacenado no coincide con la metadata."
    );
  }

  return { asset, blob };
}
