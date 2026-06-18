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
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#DA291C]/[0.12] blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
            Catálogo comercial
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Promociones disponibles
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Mismo flujo simple del inicio: buscar, filtrar y abrir una promoción
            para revisar material oficial y condiciones.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <PromoCatalog
          activeFilter={getParam(params.tipo)}
          basePath="/ofertas"
          compactHeader
          query={getParam(params.q)}
        />
      </div>
    </main>
  );
}

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}
