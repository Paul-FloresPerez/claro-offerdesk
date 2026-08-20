export type PromotionAssetKindValue =
  | "FLYER"
  | "COVERAGE"
  | "OFFICIAL_TABLE"
  | "OFFICIAL_DOCUMENT"
  | "INTERNAL";

export type PromotionAssetPresentation = {
  id: string;
  kind: PromotionAssetKindValue;
  displayName: string;
  mimeType: string;
  altText: string | null;
  sortOrder: number;
  sizeBytes: number | null;
  width: number | null;
  height: number | null;
};

const visualAssetKinds: readonly PromotionAssetKindValue[] = [
  "FLYER",
  "COVERAGE",
  "OFFICIAL_TABLE",
];

export const promotionAssetKindLabels: Record<
  PromotionAssetKindValue,
  string
> = {
  FLYER: "Flyer",
  COVERAGE: "Cobertura",
  OFFICIAL_TABLE: "Cuadro oficial",
  OFFICIAL_DOCUMENT: "Documento oficial",
  INTERNAL: "Material interno",
};

export function toPromotionAssetPresentation(asset: PromotionAssetPresentation) {
  return {
    id: asset.id,
    kind: asset.kind,
    displayName: asset.displayName,
    mimeType: asset.mimeType,
    altText: asset.altText,
    sortOrder: asset.sortOrder,
    sizeBytes: asset.sizeBytes,
    width: asset.width,
    height: asset.height,
  } satisfies PromotionAssetPresentation;
}

export function sortPromotionAssets<T extends PromotionAssetPresentation>(
  assets: readonly T[]
) {
  return [...assets].sort(
    (left, right) =>
      left.sortOrder - right.sortOrder ||
      left.displayName.localeCompare(right.displayName, "es")
  );
}

export function isPromotionImageAsset(asset: PromotionAssetPresentation) {
  return asset.mimeType.toLowerCase().startsWith("image/");
}

export function getPromotionVisualAssets<T extends PromotionAssetPresentation>(
  assets: readonly T[]
) {
  return sortPromotionAssets(assets).filter(
    (asset) =>
      visualAssetKinds.includes(asset.kind) && isPromotionImageAsset(asset)
  );
}

export function getPromotionPrincipalAsset<T extends PromotionAssetPresentation>(
  assets: readonly T[]
) {
  const visualAssets = getPromotionVisualAssets(assets);

  return (
    visualAssets.find((asset) => asset.kind === "FLYER") ??
    visualAssets.find((asset) => asset.kind === "OFFICIAL_TABLE") ??
    visualAssets[0] ??
    null
  );
}

export function getPromotionDocumentAssets<T extends PromotionAssetPresentation>(
  assets: readonly T[]
) {
  return sortPromotionAssets(assets).filter(
    (asset) =>
      asset.kind !== "INTERNAL" &&
      (asset.mimeType.toLowerCase() === "application/pdf" ||
        asset.kind === "OFFICIAL_DOCUMENT")
  );
}

export function getPromotionAdditionalAssets<T extends PromotionAssetPresentation>(
  assets: readonly T[]
) {
  return sortPromotionAssets(assets).filter(
    (asset) => asset.kind === "INTERNAL"
  );
}

export function getPromotionAssetUrl(assetId: string, download = false) {
  const path = `/api/promotions/assets/${assetId}`;
  return download ? `${path}?download=1` : path;
}

export function formatPromotionValidity(
  validFrom: Date | null,
  validUntil: Date | null
) {
  if (!validFrom && !validUntil) return "Vigencia abierta";

  const formatter = new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeZone: "America/Lima",
  });

  return `${validFrom ? formatter.format(validFrom) : "Inicio libre"} – ${
    validUntil ? formatter.format(validUntil) : "Sin fecha final"
  }`;
}
