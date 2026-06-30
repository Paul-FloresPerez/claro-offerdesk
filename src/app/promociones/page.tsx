import { PromoCatalog } from "@/components/offers/PromoCatalog";
import { ofertas } from "@/data/ofertas";

type PageProps = {
  searchParams: Promise<{
    q?: string | string[];
    tipo?: string | string[];
  }>;
};

export default async function PromocionesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main className="relative">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute right-12 top-8 h-40 w-40 rounded-full border border-[#DA291C]/20" />
        <div className="pointer-events-none absolute right-24 top-20 h-48 w-48 rounded-full bg-[#DA291C]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-px w-72 bg-gradient-to-l from-[#DA291C]/40 to-transparent" />

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[1fr_360px] lg:items-center lg:py-9">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
              Claro OfferDesk
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Promociones Claro
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
              Herramienta interna para revisar campañas, condiciones y material
              oficial antes de ofrecer.
            </p>
          </div>

          <div className="relative rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-[0_20px_56px_rgba(0,0,0,0.24)] backdrop-blur">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full border border-[#DA291C]/30" />
            <div className="grid gap-3">
              <HeroSignal text={`${ofertas.length} promociones`} />
              <HeroSignal text="Material oficial" />
              <HeroSignal text="Validar antes de ofrecer" />
            </div>
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

function HeroSignal({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#111827]/55 px-4 py-3">
      <p className="text-base font-semibold tracking-tight text-white">
        {text}
      </p>
    </div>
  );
}
