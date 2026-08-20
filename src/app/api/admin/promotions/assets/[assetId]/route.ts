import { deletePromotionAssetForAdmin } from "@/lib/promotions/assets";
import { requireAdmin } from "@/lib/authorization";
import { revalidatePublicPromotionPaths } from "@/lib/promotions/revalidation";
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
    await requireAdmin();
    const deleted = await deletePromotionAssetForAdmin(parsedAssetId.data);
    revalidatePublicPromotionPaths(deleted.promotionSlug);
    return new Response(null, { status: 204 });
  } catch (error) {
    return promotionAssetErrorResponse(error);
  }
}
