import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { StatusBadge, TechnologyBadge } from "@/components/common/StatusBadge";
import { OfficialImage } from "@/components/offers/OfficialImage";
import { PromoBadge } from "@/components/offers/PromoBadge";
import { getOfertaCover, type Oferta } from "@/data/ofertas";

type PromoCardProps = {
  oferta: Oferta;
};

const categoryTone: Record<string, "red" | "slate" | "yellow" | "blue" | "orange"> = {
  "Catálogo general": "red",
  Hogar: "slate",
  "Tecnología / HFC": "orange",
  "Promociones especiales": "yellow",
  "Línea Móvil": "blue",
};

export function PromoCard({ oferta }: PromoCardProps) {
  const cover = getOfertaCover(oferta);
  const isOneSol = oferta.id === "promo-1-sol";

  return (
    <article
      className="animate-fade-up group flex h-full flex-col overflow-hidden rounded-lg border border-white/70 bg-white text-[#111827] shadow-[0_18px_42px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(0,0,0,0.28)]"
    >
      <div className="p-3 pb-0">
        <div className="overflow-hidden rounded-lg bg-slate-50">
          <OfficialImage
            item={cover}
            title={oferta.nombre}
            variant="card"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-wrap gap-2">
          <PromoBadge tone={categoryTone[oferta.categoria] ?? "slate"}>
            {oferta.categoria}
          </PromoBadge>
          {oferta.estado !== "material-oficial" ? (
            <StatusBadge estado={oferta.estado} />
          ) : null}
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[#111827]">
            {oferta.nombre}
          </h2>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Condición comercial
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-[#DA291C]">
            {oferta.precio}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Tecnología
          </p>
          <div className="flex flex-wrap gap-2">
            {oferta.tecnologia.map((tecnologia) => (
              <TechnologyBadge key={tecnologia} tecnologia={tecnologia} />
            ))}
          </div>
        </div>

        {isOneSol ? (
          <div className="flex gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm leading-5 text-yellow-950">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-700" />
            <span>
              Validar calificación. Aplica por 2 meses y luego precio regular.
            </span>
          </div>
        ) : null}

        <Link
          href={`/ofertas/${oferta.id}`}
          className="mt-auto inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-[#DA291C] px-5 text-base font-semibold text-white shadow-[0_14px_28px_rgba(218,41,28,0.26)] transition duration-200 hover:bg-[#B91C1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Ver promoción
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
