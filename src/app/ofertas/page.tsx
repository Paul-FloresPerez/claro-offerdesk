import { BookOpen, PackageCheck, Search, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { OffersExplorer } from "@/components/offers/OffersExplorer";
import { Button } from "@/components/ui/button";

export default function OfertasPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_18%_18%,rgba(218,41,28,0.16),transparent_24rem)]">
        <div className="pointer-events-none absolute -right-16 top-2 h-48 w-48 rounded-full border border-[#DA291C]/20" />
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#FFB4AC]">
              Catálogo comercial
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Ofertas comerciales
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Busca, filtra y compara promociones oficiales. La Oferta Regular se
              muestra como catálogo general porque sus precios están en la imagen
              oficial.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild className="bg-[#DA291C] text-white hover:bg-[#B91C1C]">
              <Link href="/ofertas/oferta-regular">
                <BookOpen className="h-4 w-4" />
                Catálogo regular
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/recomendador">
                <Search className="h-4 w-4" />
                Recomendador
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <InfoStrip
            icon={BookOpen}
            label="Catálogo general"
            value="Oferta Regular"
          />
          <InfoStrip
            icon={PackageCheck}
            label="Promociones cargadas"
            value="8 ofertas oficiales"
          />
          <InfoStrip
            icon={Search}
            label="Consulta rápida"
            value="Cards + tabla comparativa"
          />
        </div>
        <OffersExplorer />
      </div>
    </main>
  );
}

function InfoStrip({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#172033] p-3 text-white shadow-[0_16px_34px_rgba(0,0,0,0.18)]">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC] ring-1 ring-[#DA291C]/20">
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <span className="block text-xs text-slate-400">{label}</span>
        <span className="block text-sm font-semibold text-white">{value}</span>
      </span>
    </div>
  );
}
