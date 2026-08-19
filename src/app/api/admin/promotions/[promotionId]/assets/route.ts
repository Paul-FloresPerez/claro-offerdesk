import type { PromotionAssetKind } from "@prisma/client";
import { requireAdmin } from "@/lib/authorization";
import { PROMOTION_ASSET_MAX_SIZE_BYTES } from "@/lib/promotions/asset-policy";
import { createPromotionAssetForAdmin } from "@/lib/promotions/assets";
import {
  isSameOriginMutation,
  promotionAssetErrorResponse,
} from "@/lib/promotions/http";
import {
  promotionAssetUploadSchema,
  safeAssetDisplayName,
} from "@/lib/validations/promotions";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ promotionId: string }> }
) {
  if (!isSameOriginMutation(request)) {
    return Response.json(
      { error: "INVALID_ORIGIN", message: "Origen de solicitud inválido." },
      { status: 403 }
    );
  }

  try {
    await requireAdmin();

    const contentLength = Number(request.headers.get("content-length"));

    if (
      Number.isFinite(contentLength) &&
      contentLength > PROMOTION_ASSET_MAX_SIZE_BYTES + 256 * 1024
    ) {
      return Response.json(
        { error: "FILE_TOO_LARGE", message: "El archivo supera el límite de 4 MB." },
        { status: 413 }
      );
    }

    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return Response.json(
        { error: "INVALID_FORM_DATA", message: "El formulario no es válido." },
        { status: 400 }
      );
    }

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "FILE_REQUIRED", message: "Selecciona un archivo." },
        { status: 400 }
      );
    }

    const displayNameValue = formData.get("displayName");
    const displayName = safeAssetDisplayName(
      typeof displayNameValue === "string" && displayNameValue.trim()
        ? displayNameValue
        : file.name
    );
    const parsed = promotionAssetUploadSchema.safeParse({
      promotionId: (await params).promotionId,
      kind: formData.get("kind"),
      displayName,
      altText: formData.get("altText"),
      sortOrder: formData.get("sortOrder"),
    });

    if (!parsed.success) {
      return Response.json(
        {
          error: "INVALID_ASSET",
          message: "Revisa los datos del material.",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const asset = await createPromotionAssetForAdmin({
      ...parsed.data,
      kind: parsed.data.kind as PromotionAssetKind,
      file,
    });

    return Response.json({ asset }, { status: 201 });
  } catch (error) {
    return promotionAssetErrorResponse(error);
  }
}
