import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { PromotionPreview } from "@/components/admin/promotions/PromotionPreview";
import { getPromotionForAdmin } from "@/lib/promotions/catalog";

export const runtime = "nodejs";

export default async function PromotionPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const promotion = await getPromotionForAdmin((await params).id);
  if (!promotion) notFound();

  return (
    <AdminShell
      title="Preview de promoción"
      description="Comprueba la composición del contenido y sus materiales antes de publicarlo."
    >
      <PromotionPreview promotion={promotion} />
    </AdminShell>
  );
}
