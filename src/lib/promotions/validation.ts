import "server-only";

import {
  PromotionAssetKind,
  PromotionKind,
  PromotionStatus,
} from "@prisma/client";
import {
  isMimeAllowedForPromotionAssetKind,
  isPromotionAssetMimeType,
} from "@/lib/promotions/asset-policy";

export type PromotionPublishingErrorCode =
  | "ARCHIVED_PROMOTION"
  | "CAMPAIGN_ASSET_REQUIRED"
  | "CATEGORY_REQUIRED"
  | "DESCRIPTION_REQUIRED"
  | "INVALID_ASSET"
  | "INVALID_DATE_RANGE"
  | "INVALID_SLUG"
  | "REGULAR_OFFER_ASSET_REQUIRED"
  | "SLUG_REQUIRED"
  | "TITLE_REQUIRED";

export type PromotionPublishingError = {
  code: PromotionPublishingErrorCode;
  field: string;
  message: string;
};

export type PromotionPublishingCandidate = {
  title: string;
  slug: string;
  shortDescription: string | null;
  category: string | null;
  kind: PromotionKind;
  status: PromotionStatus;
  validFrom: Date | null;
  validUntil: Date | null;
  assets: ReadonlyArray<{
    kind: PromotionAssetKind;
    fileKey: string;
    mimeType: string;
  }>;
};

export type PromotionPublishingValidation = {
  valid: boolean;
  errors: PromotionPublishingError[];
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validatePromotionForPublishing(
  promotion: PromotionPublishingCandidate
): PromotionPublishingValidation {
  const errors: PromotionPublishingError[] = [];

  addRequiredTextError(errors, promotion.title, "title", "TITLE_REQUIRED", "El título es obligatorio.");
  addRequiredTextError(errors, promotion.slug, "slug", "SLUG_REQUIRED", "El slug es obligatorio.");
  addRequiredTextError(
    errors,
    promotion.shortDescription,
    "shortDescription",
    "DESCRIPTION_REQUIRED",
    "La descripción breve es obligatoria para publicar."
  );
  addRequiredTextError(
    errors,
    promotion.category,
    "category",
    "CATEGORY_REQUIRED",
    "La categoría es obligatoria para publicar."
  );

  if (promotion.slug.trim() && !slugPattern.test(promotion.slug.trim())) {
    errors.push({
      code: "INVALID_SLUG",
      field: "slug",
      message: "El slug solo puede contener minúsculas, números y guiones.",
    });
  }

  if (promotion.status === PromotionStatus.ARCHIVED) {
    errors.push({
      code: "ARCHIVED_PROMOTION",
      field: "status",
      message: "Una promoción archivada no puede publicarse.",
    });
  }

  if (
    promotion.validFrom &&
    promotion.validUntil &&
    promotion.validUntil < promotion.validFrom
  ) {
    errors.push({
      code: "INVALID_DATE_RANGE",
      field: "validUntil",
      message: "La fecha final no puede ser anterior a la fecha inicial.",
    });
  }

  const validAssets = promotion.assets.filter((asset) => {
    if (!asset.fileKey.trim() || !isPromotionAssetMimeType(asset.mimeType)) {
      return false;
    }

    return isMimeAllowedForPromotionAssetKind(asset.kind, asset.mimeType);
  });

  if (validAssets.length !== promotion.assets.length) {
    errors.push({
      code: "INVALID_ASSET",
      field: "assets",
      message: "Uno o más materiales tienen un archivo o MIME inválido.",
    });
  }

  if (promotion.kind === PromotionKind.REGULAR_OFFER) {
    const hasOfficialMaterial = validAssets.some(
      (asset) =>
        asset.kind === PromotionAssetKind.OFFICIAL_TABLE ||
        asset.kind === PromotionAssetKind.OFFICIAL_DOCUMENT
    );

    if (!hasOfficialMaterial) {
      errors.push({
        code: "REGULAR_OFFER_ASSET_REQUIRED",
        field: "assets",
        message:
          "Oferta Regular requiere un cuadro o documento oficial para publicarse.",
      });
    }
  }

  if (promotion.kind === PromotionKind.CAMPAIGN) {
    const hasCampaignMaterial = validAssets.some(
      (asset) =>
        asset.kind === PromotionAssetKind.FLYER ||
        asset.kind === PromotionAssetKind.OFFICIAL_DOCUMENT
    );

    if (!hasCampaignMaterial) {
      errors.push({
        code: "CAMPAIGN_ASSET_REQUIRED",
        field: "assets",
        message:
          "La campaña requiere un flyer o documento oficial para publicarse.",
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

function addRequiredTextError(
  errors: PromotionPublishingError[],
  value: string | null,
  field: string,
  code: PromotionPublishingErrorCode,
  message: string
) {
  if (!value?.trim()) {
    errors.push({ code, field, message });
  }
}
