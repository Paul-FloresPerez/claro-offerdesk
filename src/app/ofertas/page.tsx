import { PromoCatalog } from "@/components/offers/PromoCatalog";

type PageProps = {
  searchParams: Promise<{
    q?: string | string[];
    tipo?: string | string[];
  }>;
};

export default async function OfertasPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main className="relative">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-9">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
            Claro OfferDesk
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Promociones Claro
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
            Catálogo visual para buscar, filtrar y abrir la ficha oficial de
            cada promoción.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <PromoCatalog
          activeFilter={getParam(params.tipo)}
          basePath="/ofertas"
          query={getParam(params.q)}
        />
      </div>
    </main>
  );
}

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}
