import "server-only";

import { PromotionAssetKind } from "@prisma/client";

export const PROMOTION_ASSET_MAX_SIZE_BYTES = 4 * 1024 * 1024;

export const PROMOTION_ASSET_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
] as const;

export type PromotionAssetMimeType =
  (typeof PROMOTION_ASSET_MIME_TYPES)[number];

export const PROMOTION_STORE_ID_ENV = "PROMOTIONS_STORE_ID";

const kindFolders: Record<PromotionAssetKind, string> = {
  FLYER: "flyer",
  COVERAGE: "coverage",
  OFFICIAL_TABLE: "official-table",
  OFFICIAL_DOCUMENT: "official-document",
  INTERNAL: "internal",
};

const mimeExtensions: Record<PromotionAssetMimeType, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export function getPromotionAssetFolder(kind: PromotionAssetKind) {
  return kindFolders[kind];
}

export function getPromotionAssetExtension(mimeType: PromotionAssetMimeType) {
  return mimeExtensions[mimeType];
}

export function isPromotionAssetMimeType(
  value: string
): value is PromotionAssetMimeType {
  return PROMOTION_ASSET_MIME_TYPES.includes(
    value as PromotionAssetMimeType
  );
}

export function isMimeAllowedForPromotionAssetKind(
  kind: PromotionAssetKind,
  mimeType: PromotionAssetMimeType
) {
  if (kind === PromotionAssetKind.OFFICIAL_DOCUMENT) {
    return mimeType === "application/pdf";
  }

  if (
    kind === PromotionAssetKind.FLYER ||
    kind === PromotionAssetKind.COVERAGE
  ) {
    return mimeType.startsWith("image/");
  }

  return true;
}
