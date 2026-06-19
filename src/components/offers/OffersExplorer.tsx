"use client";

import { Database, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { OfferCard } from "@/components/offers/OfferCard";
import { OfferComparisonTable } from "@/components/offers/OfferComparisonTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  categoriasOferta,
  estadoOfertaLabel,
  estadosOferta,
  ofertas,
  tecnologiasOferta,
  type EstadoOferta,
  type TecnologiaOferta,
} from "@/data/ofertas";
import { cn } from "@/lib/utils";

const allCategory = "Todas";
const allTechnology = "Todas";
const allStatus = "Todos";

export function OffersExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(allCategory);
  const [technology, setTechnology] = useState<
    TecnologiaOferta | typeof allTechnology
  >(allTechnology);
  const [status, setStatus] = useState<EstadoOferta | typeof allStatus>(allStatus);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return ofertas.filter((oferta) => {
      const text = [
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
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = normalizedQuery ? text.includes(normalizedQuery) : true;
      const matchesCategory =
        category === allCategory ? true : oferta.categoria === category;
      const matchesTechnology =
        technology === allTechnology ? true : oferta.tecnologia.includes(technology);
      const matchesStatus = status === allStatus ? true : oferta.estado === status;

      return matchesQuery && matchesCategory && matchesTechnology && matchesStatus;
    });
  }, [category, query, status, technology]);

  const regular = filtered.find((oferta) => oferta.id === "oferta-regular");
  const filteredWithoutRegular = filtered.filter(
    (oferta) => oferta.id !== "oferta-regular"
  );

  function resetFilters() {
    setQuery("");
    setCategory(allCategory);
    setTechnology(allTechnology);
    setStatus(allStatus);
  }

  return (
    <div className="space-y-7">
      <section className="rounded-lg border border-white/10 bg-white p-4 text-[#111827] shadow-[0_18px_40px_rgba(0,0,0,0.20)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-red-50 px-2.5 py-1 text-sm font-semibold text-[#B91C1C]">
              <SlidersHorizontal className="h-4 w-4" />
              Control de búsqueda
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Filtra por nombre, categoría, precio, velocidad, tecnología o
              beneficio cargado en las promociones.
            </p>
          </div>
          <Button variant="outline" onClick={resetFilters}>
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </Button>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar oferta, precio, velocidad, tecnología o categoría"
              className="h-11 rounded-lg border-slate-200 bg-slate-50 pl-9 text-[#111827] shadow-inner placeholder:text-slate-400"
            />
          </label>

          <FilterRow label="Categoría">
            <FilterButton
              active={category === allCategory}
              onClick={() => setCategory(allCategory)}
            >
              Todas
            </FilterButton>
            {categoriasOferta.map((item) => (
              <FilterButton
                key={item}
                active={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </FilterButton>
            ))}
          </FilterRow>

          <FilterRow label="Tecnología">
            <FilterButton
              active={technology === allTechnology}
              onClick={() => setTechnology(allTechnology)}
            >
              Todas
            </FilterButton>
            {tecnologiasOferta.map((item) => (
              <FilterButton
                key={item}
                active={technology === item}
                onClick={() => setTechnology(item)}
              >
                {item}
              </FilterButton>
            ))}
          </FilterRow>

          <FilterRow label="Estado">
            <FilterButton
              active={status === allStatus}
              onClick={() => setStatus(allStatus)}
            >
              Todos
            </FilterButton>
            {estadosOferta.map((item) => (
              <FilterButton
                key={item}
                active={status === item}
                onClick={() => setStatus(item)}
              >
                {estadoOfertaLabel[item]}
              </FilterButton>
            ))}
          </FilterRow>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {filtered.length} ofertas encontradas
            </h2>
            <p className="text-sm text-slate-300">
              Oferta Regular aparece primero como oferta base / condición regular.
            </p>
          </div>
          {category !== allCategory ? (
            <span className="inline-flex h-7 items-center rounded-md border border-[#DA291C]/30 bg-[#DA291C]/15 px-3 text-xs font-semibold text-[#FFB4AC]">
              {category}
            </span>
          ) : null}
        </div>

        {regular ? (
          <div className="rounded-lg border border-[#DA291C]/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,245,244,0.95))] p-3 shadow-[0_18px_42px_rgba(0,0,0,0.22)]">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#B91C1C]">
              <Database className="h-4 w-4" />
              Oferta base destacada
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <OfferCard oferta={regular} featured />
            </div>
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredWithoutRegular.map((oferta) => (
            <OfferCard key={oferta.id} oferta={oferta} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Tabla comparativa
          </h2>
          <p className="text-sm text-slate-300">
            Vista rápida para comparar precio, velocidad, tecnología y estado.
          </p>
        </div>
        <OfferComparisonTable ofertas={filtered} />
      </section>
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2 lg:grid-cols-[120px_1fr] lg:items-center">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 rounded-md border px-3 text-sm font-medium transition",
        active
          ? "border-[#DA291C] bg-red-50 text-[#B91C1C] shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      {children}
    </button>
  );
}
