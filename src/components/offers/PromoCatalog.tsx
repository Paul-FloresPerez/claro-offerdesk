import {
  Database,
  Flame,
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
import { RegularOfferBanner } from "@/components/offers/RegularOfferBanner";
import { ofertas, type Oferta } from "@/data/ofertas";
import { cn } from "@/lib/utils";

export type CatalogFilter =
  | "Todas"
  | "Catálogo oficial"
  | "Internet hogar"
  | "HFC"
  | "Especiales"
  | "Línea móvil";

type PromoCatalogProps = {
  activeFilter?: string;
  basePath?: "/" | "/ofertas";
  query?: string;
};

const filterOptions: { label: CatalogFilter; icon: LucideIcon }[] = [
  { label: "Todas", icon: ListFilter },
  { label: "Catálogo oficial", icon: Database },
  { label: "Internet hogar", icon: Home },
  { label: "HFC", icon: Wifi },
  { label: "Especiales", icon: Flame },
  { label: "Línea móvil", icon: Smartphone },
];

const preferredOrderRank: Record<string, number> = {
  "oferta-regular": 0,
  "oferta-medio": 1,
  "oferta-basico": 2,
  "promo-grande": 3,
  "hfc-puro": 4,
  "oferta-relampago": 5,
  "promo-1-sol": 6,
  "linea-movil": 7,
};

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
    return (preferredOrderRank[a.id] ?? 99) - (preferredOrderRank[b.id] ?? 99);
  });
}

function matchesFilter(oferta: Oferta, filter: CatalogFilter) {
  if (filter === "Todas") return true;
  if (filter === "Catálogo oficial") return oferta.id === "oferta-regular";
  if (filter === "Línea móvil") return oferta.id === "linea-movil";
  if (filter === "Especiales") {
    return oferta.categoria === "Promociones especiales";
  }
  if (filter === "Internet hogar") return oferta.categoria === "Hogar";
  if (filter === "HFC") {
    return (
      oferta.id !== "oferta-regular" &&
      oferta.tecnologia.some((item) => item.includes("HFC"))
    );
  }

  return true;
}

function getFilterHint(filter: CatalogFilter) {
  if (filter === "Especiales") {
    return "Promociones sujetas a validación antes de ofrecer.";
  }

  if (filter === "Catálogo oficial") {
    return "Oferta Regular se revisa desde la imagen oficial; no es precio único.";
  }

  return "Selecciona una campaña para ver material oficial y condiciones.";
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
  const regularOffer = filteredOffers.find(
    (oferta) => oferta.id === "oferta-regular"
  );
  const normalOffers = filteredOffers.filter(
    (oferta) => oferta.id !== "oferta-regular"
  );

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-[#172033]/92 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-5">
        <form
          action={basePath}
          className="grid gap-4 lg:grid-cols-[1fr_auto_auto]"
        >
          {selectedFilter !== "Todas" ? (
            <input type="hidden" name="tipo" value={selectedFilter} />
          ) : null}

          <label className="relative block">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Buscar promoción, precio, velocidad o tecnología"
              className="h-16 w-full rounded-lg border border-white/10 bg-white pl-14 pr-4 text-base font-medium text-[#111827] shadow-[0_16px_34px_rgba(0,0,0,0.20)] outline-none transition placeholder:text-slate-400 focus:border-[#DA291C] focus:ring-4 focus:ring-[#DA291C]/15"
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-16 items-center justify-center gap-2 rounded-lg bg-[#DA291C] px-6 text-base font-semibold text-white shadow-[0_16px_32px_rgba(218,41,28,0.24)] transition hover:bg-[#B91C1C]"
          >
            <Search className="h-5 w-5" />
            Buscar
          </button>

          <Link
            href={basePath}
            className="inline-flex h-16 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.08] px-5 text-base font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.12]"
          >
            <RotateCcw className="h-5 w-5" />
            Limpiar
          </Link>
        </form>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
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
                  "group flex min-h-14 items-center gap-3 rounded-lg border px-3 text-left text-sm font-semibold transition duration-200",
                  active
                    ? "border-[#DA291C] bg-[#DA291C] text-white shadow-[0_16px_32px_rgba(218,41,28,0.26)]"
                    : "border-white/10 bg-white/[0.07] text-slate-100 hover:border-[#DA291C]/40 hover:bg-white/[0.11]"
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-md transition",
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
            Promociones disponibles
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
            {getFilterHint(selectedFilter)}
          </p>
        </div>
      </div>

      {regularOffer ? <RegularOfferBanner oferta={regularOffer} /> : null}

      {normalOffers.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {normalOffers.map((oferta) => (
            <PromoCard key={oferta.id} oferta={oferta} />
          ))}
        </div>
      ) : !regularOffer ? (
        <div className="rounded-lg border border-white/10 bg-[#172033] p-8 text-center text-slate-300">
          No hay promociones que coincidan con la búsqueda actual.
        </div>
      ) : null}
    </section>
  );
}
