import {
  ArrowRight,
  BadgeDollarSign,
  Clock3,
  Gauge,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { StatusBadge, TechnologyBadge } from "@/components/common/StatusBadge";
import { ImportantCondition } from "@/components/offers/ImportantCondition";
import { OfficialImage } from "@/components/offers/OfficialImage";
import { PromoBadge } from "@/components/offers/PromoBadge";
import { getOfertaCover, type Oferta } from "@/data/ofertas";
import { cn } from "@/lib/utils";

type PromoCardProps = {
  oferta: Oferta;
  index?: number;
};

const categoryTone: Record<string, "red" | "slate" | "yellow" | "blue" | "orange"> = {
  "Catálogo general": "red",
  Hogar: "slate",
  "Tecnología / HFC": "orange",
  "Promociones especiales": "yellow",
  "Línea Móvil": "blue",
};

export function PromoCard({ oferta, index = 0 }: PromoCardProps) {
  const cover = getOfertaCover(oferta);
  const isRegular = oferta.id === "oferta-regular";
  const isSavingsMain = oferta.id === "oferta-medio";
  const isOneSol = oferta.id === "promo-1-sol";

  return (
    <article
      className={cn(
        "animate-fade-up group flex h-full flex-col overflow-hidden rounded-2xl border bg-white text-[#111827] shadow-[0_18px_42px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(0,0,0,0.28)]",
        isRegular ? "border-[#DA291C]/35" : "border-white/70"
      )}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="p-3 pb-0">
        <div className="overflow-hidden rounded-xl bg-slate-50">
          <OfficialImage item={cover} title={oferta.nombre} variant="card" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-wrap gap-2">
          <PromoBadge tone={categoryTone[oferta.categoria] ?? "slate"}>
            {oferta.categoria}
          </PromoBadge>
          <StatusBadge estado={oferta.estado} />
          {isSavingsMain ? (
            <PromoBadge tone="green">Ahorro principal</PromoBadge>
          ) : null}
          {isRegular ? <PromoBadge tone="red">Catálogo oficial</PromoBadge> : null}
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[#111827]">
            {oferta.nombre}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
            {oferta.resumen}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <CardFact
            icon={BadgeDollarSign}
            label="Precio principal"
            value={oferta.precio}
            strong
          />
          <CardFact icon={Gauge} label="Velocidad" value={oferta.velocidad} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-[#F3F4F6] p-3">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            <Clock3 className="h-3.5 w-3.5" />
            Condición resumida
          </div>
          <p className="text-sm font-medium leading-6 text-slate-800">
            {oferta.detallePrecio}
          </p>
        </div>

        {isOneSol ? (
          <ImportantCondition
            compact
            tone="warning"
            title="Promoción especial"
          >
            Validar si el cliente califica. Aplica por 2 meses y luego retorna
            al precio regular.
          </ImportantCondition>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {oferta.tecnologia.map((tecnologia) => (
            <TechnologyBadge key={tecnologia} tecnologia={tecnologia} />
          ))}
        </div>

        <Link
          href={`/ofertas/${oferta.id}`}
          className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#DA291C] px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(218,41,28,0.26)] transition duration-200 hover:bg-[#B91C1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Ver promoción
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

function CardFact({
  icon: Icon,
  label,
  value,
  strong,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p
        className={cn(
          "leading-6",
          strong
            ? "text-lg font-bold text-[#DA291C]"
            : "text-sm font-semibold text-[#111827]"
        )}
      >
        {value}
      </p>
    </div>
  );
}
