import { PageHeader } from "@/components/common/PageHeader";
import { RecommenderClient } from "@/components/offers/RecommenderClient";

export default function RecomendadorPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Asistencia de venta"
        title="Recomendador por necesidad"
        description="Selecciona el escenario del cliente y revisa la oferta sugerida, motivo y validaciones obligatorias."
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <RecommenderClient />
      </div>
    </main>
  );
}
