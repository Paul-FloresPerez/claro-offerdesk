import {
  BadgeDollarSign,
  Database,
  Flame,
  Gauge,
  Home,
  ListFilter,
  RotateCcw,
  Search,
  Smartphone,
  type LucideIcon,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { PromoCard } from "@/components/offers/PromoCard";
import { ofertas, type Oferta } from "@/data/ofertas";
import { cn } from "@/lib/utils";

export type CatalogFilter =
  | "Todas"
  | "Ahorro"
  | "Hogar"
  | "Alta velocidad"
  | "HFC"
  | "Promoción especial"
  | "Línea móvil"
  | "Catálogo regular";

type PromoCatalogProps = {
  activeFilter?: string;
  basePath?: "/" | "/ofertas";
  compactHeader?: boolean;
  query?: string;
};

const filterOptions: { label: CatalogFilter; icon: LucideIcon }[] = [
  { label: "Todas", icon: ListFilter },
  { label: "Ahorro", icon: BadgeDollarSign },
  { label: "Hogar", icon: Home },
  { label: "Alta velocidad", icon: Gauge },
  { label: "HFC", icon: Wifi },
  { label: "Promoción especial", icon: Flame },
  { label: "Línea móvil", icon: Smartphone },
  { label: "Catálogo regular", icon: Database },
];

const preferredOrder = [
  "oferta-regular",
  "oferta-medio",
  "oferta-basico",
  "promo-grande",
  "hfc-puro",
  "oferta-relampago",
  "promo-1-sol",
  "linea-movil",
];

const searchableText = (oferta: Oferta) =>
  [
    oferta.nombre,
    oferta.categoria,
    oferta.precio,
    oferta.detallePrecio,
    oferta.velocidad,
    oferta.vigencia,
    oferta.resumen,
    ...oferta.tecnologia,
    ...oferta.beneficios,
    ...oferta.aplicaPara,
    ...oferta.restricciones,
  ]
    .join(" ")
    .toLowerCase();

function normalizeFilter(value?: string): CatalogFilter {
  return filterOptions.some((item) => item.label === value)
    ? (value as CatalogFilter)
    : "Todas";
}

function sortOffers(items: Oferta[]) {
  return [...items].sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a.id);
    const bIndex = preferredOrder.indexOf(b.id);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });
}

function matchesFilter(oferta: Oferta, filter: CatalogFilter) {
  if (filter === "Todas") return true;
  if (filter === "Catálogo regular") return oferta.id === "oferta-regular";
  if (filter === "Línea móvil") return oferta.id === "linea-movil";
  if (filter === "Promoción especial") {
    return oferta.categoria === "Promociones especiales";
  }
  if (filter === "Hogar") return oferta.categoria === "Hogar";
  if (filter === "HFC") {
    return (
      oferta.id === "hfc-puro" ||
      oferta.tecnologia.some((item) => item.includes("HFC"))
    );
  }
  if (filter === "Alta velocidad") {
    return ["oferta-medio", "promo-grande", "oferta-relampago"].includes(
      oferta.id
    );
  }
  if (filter === "Ahorro") {
    return ["oferta-medio", "oferta-basico", "hfc-puro"].includes(oferta.id);
  }

  return true;
}

function getFilterHint(filter: CatalogFilter) {
  if (filter === "Ahorro") {
    return "Oferta Medio queda primero: S/55 por 6 meses y luego S/89. Promo 1 Sol no se recomienda automáticamente.";
  }

  if (filter === "Promoción especial") {
    return "Promociones sujetas a validación antes de ofrecer.";
  }

  if (filter === "Catálogo regular") {
    return "Precios One Play, Two Play y Three Play en la imagen oficial.";
  }

  return "Filtra y abre la ficha para confirmar imagen, vigencia, restricciones y validaciones.";
}

function catalogHref({
  basePath,
  filter,
  query,
}: {
  basePath: string;
  filter: CatalogFilter;
  query: string;
}) {
  const params = new URLSearchParams();

  if (filter !== "Todas") {
    params.set("tipo", filter);
  }

  if (query.trim()) {
    params.set("q", query.trim());
  }

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function PromoCatalog({
  activeFilter,
  basePath = "/",
  compactHeader = false,
  query = "",
}: PromoCatalogProps) {
  const selectedFilter = normalizeFilter(activeFilter);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredOffers = sortOffers(
    ofertas.filter((oferta) => {
      const byFilter = matchesFilter(oferta, selectedFilter);
      const byQuery = normalizedQuery
        ? searchableText(oferta).includes(normalizedQuery)
        : true;

      return byFilter && byQuery;
    })
  );
  const mainSavingsOffer = ofertas.find((oferta) => oferta.id === "oferta-medio");

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-[#172033]/92 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-5">
        <form
          action={basePath}
          className={cn(
            "grid gap-4",
            compactHeader ? "lg:grid-cols-[1fr_auto_auto]" : "lg:grid-cols-[1fr_auto_auto]"
          )}
        >
          {selectedFilter !== "Todas" ? (
            <input type="hidden" name="tipo" value={selectedFilter} />
          ) : null}

          <label className="relative block">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Buscar por oferta, precio, velocidad, tecnología o categoría"
              className="h-16 w-full rounded-2xl border border-white/10 bg-white pl-14 pr-4 text-base font-medium text-[#111827] shadow-[0_16px_34px_rgba(0,0,0,0.20)] outline-none transition placeholder:text-slate-400 focus:border-[#DA291C] focus:ring-4 focus:ring-[#DA291C]/15"
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-16 items-center justify-center gap-2 rounded-2xl bg-[#DA291C] px-6 text-base font-semibold text-white shadow-[0_16px_32px_rgba(218,41,28,0.24)] transition hover:bg-[#B91C1C]"
          >
            <Search className="h-5 w-5" />
            Buscar
          </button>

          <Link
            href={basePath}
            className="inline-flex h-16 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-5 text-base font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.12]"
          >
            <RotateCcw className="h-5 w-5" />
            Limpiar
          </Link>
        </form>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filterOptions.map((item) => {
            const active = selectedFilter === item.label;

            return (
              <Link
                key={item.label}
                href={catalogHref({
                  basePath,
                  filter: item.label,
                  query,
                })}
                className={cn(
                  "group flex min-h-16 items-center gap-3 rounded-2xl border px-4 text-left text-base font-semibold transition duration-200",
                  active
                    ? "border-[#DA291C] bg-[#DA291C] text-white shadow-[0_16px_32px_rgba(218,41,28,0.26)]"
                    : "border-white/10 bg-white/[0.07] text-slate-100 hover:border-[#DA291C]/40 hover:bg-white/[0.11]"
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition",
                    active
                      ? "bg-white/15 text-white"
                      : "bg-white text-[#DA291C] group-hover:scale-[1.03]"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#FFB4AC]">
            {filteredOffers.length} promociones
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
            Catálogo rápido
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
            {getFilterHint(selectedFilter)}
          </p>
        </div>

        {selectedFilter === "Ahorro" && mainSavingsOffer ? (
          <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-50">
            <span className="font-semibold">Opción principal:</span>{" "}
            {mainSavingsOffer.nombre} · {mainSavingsOffer.precio} ·{" "}
            {mainSavingsOffer.detallePrecio}
          </div>
        ) : null}
      </div>

      {filteredOffers.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredOffers.map((oferta, index) => (
            <PromoCard key={oferta.id} oferta={oferta} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#172033] p-8 text-center text-slate-300">
          No hay promociones que coincidan con la búsqueda actual.
        </div>
      )}
    </section>
  );
}
