"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/authorization";
import {
  archivePromotion,
  createPromotionDraft,
  PromotionAdminError,
  publishPromotion,
  restorePromotion,
  setPromotionFeatured,
  unpublishPromotion,
  updatePromotionForAdmin,
} from "@/lib/promotions/admin";
import {
  promotionDraftSchema,
  promotionIdSchema,
} from "@/lib/validations/promotions";
import type { PromotionActionState } from "@/lib/promotions/action-state";
import { revalidatePublicPromotionPaths } from "@/lib/promotions/revalidation";

export async function createPromotionDraftAction(
  _previousState: PromotionActionState,
  formData: FormData
): Promise<PromotionActionState> {
  await requireAdmin();
  const parsed = promotionDraftSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) return invalidFormState(parsed.error.flatten().fieldErrors);

  try {
    const promotion = await createPromotionDraft(parsed.data);
    revalidatePromotionPaths(promotion.id, parsed.data.slug);
    return {
      status: "success",
      message: "Borrador creado. Ya puedes agregar materiales.",
      promotionId: promotion.id,
    };
  } catch (error) {
    return promotionErrorState(error);
  }
}

export async function updatePromotionAction(
  _previousState: PromotionActionState,
  formData: FormData
): Promise<PromotionActionState> {
  await requireAdmin();
  const promotionId = parsePromotionId(formData);
  if (!promotionId.ok) return promotionId.state;

  const parsed = promotionDraftSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalidFormState(parsed.error.flatten().fieldErrors);

  try {
    const promotion = await updatePromotionForAdmin(
      promotionId.value,
      parsed.data
    );
    revalidatePromotionPaths(
      promotion.id,
      promotion.slug,
      promotion.previousSlug
    );
    return { status: "success", message: "Cambios guardados correctamente." };
  } catch (error) {
    return promotionErrorState(error);
  }
}

export async function publishPromotionAction(
  _previousState: PromotionActionState,
  formData: FormData
) {
  await requireAdmin();
  return runTransition(formData, publishPromotion, "Promoción publicada.");
}

export async function unpublishPromotionAction(
  _previousState: PromotionActionState,
  formData: FormData
) {
  await requireAdmin();
  return runTransition(
    formData,
    unpublishPromotion,
    "Promoción despublicada y devuelta a borrador."
  );
}

export async function archivePromotionAction(
  _previousState: PromotionActionState,
  formData: FormData
) {
  await requireAdmin();
  return runTransition(formData, archivePromotion, "Promoción archivada.");
}

export async function restorePromotionAction(
  _previousState: PromotionActionState,
  formData: FormData
) {
  await requireAdmin();
  return runTransition(
    formData,
    restorePromotion,
    "Promoción restaurada como borrador."
  );
}

export async function setPromotionFeaturedAction(
  _previousState: PromotionActionState,
  formData: FormData
) {
  await requireAdmin();
  const featured = formData.get("featured") === "true";
  return runTransition(
    formData,
    (id) => setPromotionFeatured(id, featured),
    featured ? "Promoción destacada." : "Promoción retirada de destacados."
  );
}

async function runTransition(
  formData: FormData,
  transition: (promotionId: string) => Promise<{ id: string; slug: string }>,
  successMessage: string
): Promise<PromotionActionState> {
  const promotionId = parsePromotionId(formData);
  if (!promotionId.ok) return promotionId.state;

  try {
    const promotion = await transition(promotionId.value);
    revalidatePromotionPaths(promotion.id, promotion.slug);
    return { status: "success", message: successMessage };
  } catch (error) {
    return promotionErrorState(error);
  }
}

function parsePromotionId(formData: FormData):
  | { ok: true; value: string }
  | { ok: false; state: PromotionActionState } {
  const parsed = promotionIdSchema.safeParse(formData.get("promotionId"));
  return parsed.success
    ? { ok: true, value: parsed.data }
    : {
        ok: false,
        state: { status: "error", message: "La promoción no es válida." },
      };
}

function invalidFormState(fieldErrors: Record<string, string[] | undefined>) {
  return {
    status: "error" as const,
    message: "Revisa los campos marcados.",
    fieldErrors: Object.fromEntries(
      Object.entries(fieldErrors).filter(
        (entry): entry is [string, string[]] => Boolean(entry[1]?.length)
      )
    ),
  };
}

function promotionErrorState(error: unknown): PromotionActionState {
  if (error instanceof PromotionAdminError) {
    return {
      status: "error",
      message: error.message,
      details: error.details,
    };
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return {
      status: "error",
      message: "Ese slug ya pertenece a otra promoción.",
      fieldErrors: { slug: ["El slug debe ser único."] },
    };
  }

  console.error("Error administrando promoción", error);
  return {
    status: "error",
    message: "No se pudo completar la operación. Intenta nuevamente.",
  };
}

function revalidatePromotionPaths(
  promotionId: string,
  slug: string,
  previousSlug?: string
) {
  revalidatePath("/admin/promociones");
  revalidatePath(`/admin/promociones/${promotionId}/editar`);
  revalidatePath(`/admin/promociones/${promotionId}/preview`);
  revalidatePublicPromotionPaths(slug);

  if (previousSlug && previousSlug !== slug) {
    revalidatePublicPromotionPaths(previousSlug);
  }
}
