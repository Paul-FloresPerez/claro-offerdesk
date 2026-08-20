import "server-only";

import { revalidatePath } from "next/cache";

export function revalidatePublicPromotionPaths(slug?: string) {
  revalidatePath("/promociones");
  revalidatePath("/promociones/[slug]", "page");

  if (slug) {
    revalidatePath(`/promociones/${slug}`);
  }
}
