import { PromoCatalog } from "@/components/offers/PromoCatalog";

type PageProps = {
  searchParams: Promise<{
    q?: string | string[];
    tipo?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main className="relative">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#DA291C]/[0.16] blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-8 h-40 w-40 rounded-full border border-[#DA291C]/20" />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
              Claro OfferDesk
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Promociones Claro
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              Consulta rápida para asesores: busca una promoción, filtra por
              tipo y abre la ficha con imagen oficial, condiciones y validaciones.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <PromoCatalog
          activeFilter={getParam(params.tipo)}
          query={getParam(params.q)}
        />
      </div>
    </main>
  );
}

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}
