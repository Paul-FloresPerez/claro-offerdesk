import AdminShell from "@/components/admin/AdminShell";
import { PromotionEditor } from "@/components/admin/promotions/PromotionEditor";

export const runtime = "nodejs";

export default function NewPromotionPage() {
  return (
    <AdminShell
      title="Nueva promoción"
      description="Crea primero un borrador flexible. Las reglas editoriales completas se validarán al publicar."
    >
      <PromotionEditor />
    </AdminShell>
  );
}
