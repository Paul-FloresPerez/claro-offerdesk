"use client";

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
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { PromoCard } from "@/components/offers/PromoCard";
import { RegularOfferBanner } from "@/components/offers/RegularOfferBanner";
import type { Oferta } from "@/lib/offer-utils";
import { cn } from "@/lib/utils";

export type CatalogFilter =
  | "Todas"
  | "Oferta base"
  | "Internet hogar"
  | "HFC"
  | "Especiales"
  | "Linea movil";

type PromoCatalogProps = {
  activeFilter?: string;
  ofertas: Oferta[];
  query?: string;
};

type ScrollRequest =
  | { id: number; kind: "filter" }
  | { id: number; kind: "offer"; offerId: string };

const filterOptions: { label: CatalogFilter; icon: LucideIcon }[] = [
  { label: "Todas", icon: ListFilter },
  { label: "Oferta base", icon: Database },
  { label: "Internet hogar", icon: Home },
  { label: "HFC", icon: Wifi },
  { label: "Especiales", icon: Flame },
  { label: "Linea movil", icon: Smartphone },
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
  if (filter === "Oferta base") return oferta.id === "oferta-regular";
  if (filter === "Linea movil") return oferta.id === "linea-movil";
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
    return "Promociones sujetas a validacion antes de ofrecer.";
  }

  if (filter === "Oferta base") {
    return "Oferta Regular se revisa como condicion regular / estandar.";
  }

  return "Selecciona una campana para ver material oficial, condiciones y zonas aplicables.";
}

export function PromoCatalog({
  activeFilter,
  ofertas,
  query = "",
}: PromoCatalogProps) {
  const [selectedFilter, setSelectedFilter] = useState<CatalogFilter>(
    normalizeFilter(activeFilter)
  );
  const [searchValue, setSearchValue] = useState(query);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [scrollRequest, setScrollRequest] = useState<ScrollRequest | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const promotionsRef = useRef<HTMLElement>(null);

  const quickAccessOffers = useMemo(() => sortOffers(ofertas), [ofertas]);
  const filteredOffers = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    return sortOffers(
      ofertas.filter((oferta) => {
        const byFilter = matchesFilter(oferta, selectedFilter);
        const byQuery = normalizedQuery
          ? searchableText(oferta).includes(normalizedQuery)
          : true;

        return byFilter && byQuery;
      })
    );
  }, [ofertas, searchValue, selectedFilter]);
  const regularOffer = filteredOffers.find(
    (oferta) => oferta.id === "oferta-regular"
  );
  const normalOffers = filteredOffers.filter(
    (oferta) => oferta.id !== "oferta-regular"
  );

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!scrollRequest) return;

    const firstVisibleId = regularOffer?.id ?? normalOffers[0]?.id;
    const targetOfferId =
      scrollRequest.kind === "offer" ? scrollRequest.offerId : firstVisibleId;

    window.requestAnimationFrame(() => {
      if (scrollRequest.kind === "filter") {
        promotionsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else if (targetOfferId) {
        document.getElementById(`promo-${targetOfferId}`)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      if (targetOfferId) {
        highlightOffer(targetOfferId);
      }

      setScrollRequest(null);
    });
  }, [scrollRequest, regularOffer?.id, normalOffers]);

  function nextRequestId() {
    requestIdRef.current += 1;
    return requestIdRef.current;
  }

  function highlightOffer(offerId: string) {
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }

    setHighlightedId(offerId);
    highlightTimerRef.current = setTimeout(() => {
      setHighlightedId(null);
    }, 1800);
  }

  function handleFilterSelect(filter: CatalogFilter) {
    setSelectedFilter(filter);
    setScrollRequest({ id: nextRequestId(), kind: "filter" });
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setScrollRequest({ id: nextRequestId(), kind: "filter" });
  }

  function handleClear() {
    setSelectedFilter("Todas");
    setSearchValue("");
    setScrollRequest({ id: nextRequestId(), kind: "filter" });
  }

  function handleQuickAccess(offerId: string) {
    setSelectedFilter("Todas");
    setSearchValue("");
    setScrollRequest({ id: nextRequestId(), kind: "offer", offerId });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-[#172033]/92 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-5">
        <form
          className="grid gap-4 lg:grid-cols-[1fr_auto_auto]"
          onSubmit={handleSearchSubmit}
        >
          <label className="relative block">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Buscar promocion, precio, velocidad o tecnologia"
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

          <button
            type="button"
            onClick={handleClear}
            className="inline-flex h-16 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.08] px-5 text-base font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.12]"
          >
            <RotateCcw className="h-5 w-5" />
            Limpiar
          </button>
        </form>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {filterOptions.map((item) => {
            const active = selectedFilter === item.label;

            return (
              <button
                key={item.label}
                type="button"
                aria-pressed={active}
                onClick={() => handleFilterSelect(item.label)}
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
              </button>
            );
          })}
        </div>

        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#FFB4AC]">
            Accesos rapidos
          </p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {quickAccessOffers.map((oferta) => (
              <button
                key={oferta.id}
                type="button"
                onClick={() => handleQuickAccess(oferta.id)}
                className={cn(
                  "h-10 shrink-0 rounded-lg border px-3 text-sm font-semibold transition",
                  highlightedId === oferta.id
                    ? "border-[#DA291C] bg-[#DA291C] text-white shadow-[0_12px_26px_rgba(218,41,28,0.24)]"
                    : "border-white/10 bg-white/[0.06] text-slate-100 hover:border-[#DA291C]/35 hover:bg-white/[0.1]"
                )}
              >
                {oferta.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section
        ref={promotionsRef}
        id="promociones-disponibles"
        className="scroll-mt-32 space-y-6"
      >
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

        {regularOffer ? (
          <RegularOfferBanner
            oferta={regularOffer}
            highlighted={highlightedId === regularOffer.id}
          />
        ) : null}

        {normalOffers.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {normalOffers.map((oferta) => (
              <PromoCard
                key={oferta.id}
                oferta={oferta}
                highlighted={highlightedId === oferta.id}
              />
            ))}
          </div>
        ) : !regularOffer ? (
          <div className="rounded-lg border border-white/10 bg-[#172033] p-8 text-center shadow-[0_18px_42px_rgba(0,0,0,0.22)]">
            <p className="text-lg font-semibold text-white">
              Sin promociones visibles
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Ajusta el filtro o limpia la busqueda para revisar otras campanas.
            </p>
          </div>
        ) : null}
      </section>
    </section>
  );
}
