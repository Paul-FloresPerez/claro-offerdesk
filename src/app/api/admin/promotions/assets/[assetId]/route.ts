import { deletePromotionAssetForAdmin } from "@/lib/promotions/assets";
import {
  isSameOriginMutation,
  promotionAssetErrorResponse,
} from "@/lib/promotions/http";
import { promotionAssetIdSchema } from "@/lib/validations/promotions";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ assetId: string }> }
) {
  if (!isSameOriginMutation(request)) {
    return Response.json(
      { error: "INVALID_ORIGIN", message: "Origen de solicitud inválido." },
      { status: 403 }
    );
  }

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
    await deletePromotionAssetForAdmin(parsedAssetId.data);
    return new Response(null, { status: 204 });
  } catch (error) {
    return promotionAssetErrorResponse(error);
  }
}
