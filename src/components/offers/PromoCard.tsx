import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { StatusBadge, TechnologyBadge } from "@/components/common/StatusBadge";
import { OfficialImage } from "@/components/offers/OfficialImage";
import { PromoBadge } from "@/components/offers/PromoBadge";
import { getOfertaCover, type Oferta } from "@/data/ofertas";

type PromoCardProps = {
  oferta: Oferta;
  highlighted?: boolean;
};

const categoryTone: Record<string, "red" | "slate" | "yellow" | "blue" | "orange"> = {
  "Catálogo general": "red",
  Hogar: "slate",
  "Tecnología / HFC": "orange",
  "Promociones especiales": "yellow",
  "Línea Móvil": "blue",
};

export function PromoCard({ oferta, highlighted = false }: PromoCardProps) {
  const cover = getOfertaCover(oferta);
  const isOneSol = oferta.id === "promo-1-sol";
  const visibleTechnologies = oferta.tecnologia.filter(
    (tecnologia) => tecnologia !== "Por confirmar"
  );
  const shouldValidateConditions =
    visibleTechnologies.length !== oferta.tecnologia.length;
  const showVelocity =
    oferta.velocidad &&
    oferta.velocidad !== "No aplica" &&
    oferta.velocidad !== "Por confirmar";

  return (
    <article
      id={`promo-${oferta.id}`}
      className="animate-fade-up group flex h-full scroll-mt-32 flex-col overflow-hidden rounded-lg border border-white/70 bg-white text-[#111827] shadow-[0_18px_42px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:scale-[1.005] hover:shadow-[0_26px_60px_rgba(0,0,0,0.28)] data-[highlighted=true]:border-[#DA291C]/70 data-[highlighted=true]:shadow-[0_0_0_3px_rgba(218,41,28,0.16),0_24px_70px_rgba(0,0,0,0.28)]"
      data-highlighted={highlighted}
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
          <p className="mt-1 text-2xl font-bold tracking-tight text-[#DA291C]">
            {oferta.precio}
          </p>
          {showVelocity ? (
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {oferta.velocidad}
            </p>
          ) : null}
        </div>

        {visibleTechnologies.length || shouldValidateConditions ? (
          <div className="flex flex-wrap gap-2">
            {visibleTechnologies.map((tecnologia) => (
              <TechnologyBadge key={tecnologia} tecnologia={tecnologia} />
            ))}
            {shouldValidateConditions ? (
              <PromoBadge tone="yellow">Validar condiciones</PromoBadge>
            ) : null}
          </div>
        ) : null}

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
