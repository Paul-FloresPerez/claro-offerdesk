import { readAuthorizedPrivatePromotionAsset } from "@/lib/promotions/assets";
import { promotionAssetErrorResponse } from "@/lib/promotions/http";
import { promotionAssetIdSchema } from "@/lib/validations/promotions";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const parsedAssetId = promotionAssetIdSchema.safeParse(
    (await params).assetId
  );

  if (!parsedAssetId.success) {
    return Response.json(
      { error: "INVALID_ASSET_ID", message: "Material inválido." },
      { status: 400 }
    );
  }

  try {
    const { asset, blob } = await readAuthorizedPrivatePromotionAsset({
      assetId: parsedAssetId.data,
      ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
    });
    const headers = privateAssetHeaders({
      displayName: asset.displayName,
      mimeType: asset.mimeType,
      etag: blob.blob.etag,
      uploadedAt: blob.blob.uploadedAt,
    });

    if (blob.statusCode === 304) {
      return new Response(null, { status: 304, headers });
    }

    headers.set("Content-Length", String(blob.blob.size));
    return new Response(blob.stream, { status: 200, headers });
  } catch (error) {
    return promotionAssetErrorResponse(error);
  }
}

function privateAssetHeaders(input: {
  displayName: string;
  mimeType: string;
  etag: string;
  uploadedAt: Date;
}) {
  const fileName = contentDispositionFileName(
    input.displayName,
    input.mimeType
  );

  return new Headers({
    "Cache-Control": "private, no-store, max-age=0",
    "Content-Disposition": `inline; filename="${fileName}"`,
    "Content-Type": input.mimeType,
    ETag: input.etag,
    "Last-Modified": input.uploadedAt.toUTCString(),
    "Referrer-Policy": "no-referrer",
    Vary: "Cookie",
    "X-Content-Type-Options": "nosniff",
  });
}

function contentDispositionFileName(displayName: string, mimeType: string) {
  const normalizedMimeType = mimeType.toLowerCase();
  const extension =
    normalizedMimeType === "image/png"
      ? "png"
      : normalizedMimeType === "image/jpeg"
        ? "jpg"
        : normalizedMimeType === "image/webp"
          ? "webp"
          : "pdf";
  const baseName = displayName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
  const safeBaseName = baseName || "promotion-asset";
  const suffix = safeBaseName.toLowerCase().endsWith(`.${extension}`)
    ? ""
    : `.${extension}`;

  return `${safeBaseName}${suffix}`;
}
