"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import type { Oferta } from "@/lib/offer-utils";

export function GlobalOfferSearch({ ofertas }: { ofertas: Oferta[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return ofertas.slice(0, 6);
    }

    return ofertas
      .filter((oferta) =>
        [
          oferta.nombre,
          oferta.categoria,
          oferta.precio,
          oferta.detallePrecio,
          oferta.velocidad,
          oferta.resumen,
          ...oferta.tecnologia,
          ...oferta.beneficios,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
      .slice(0, 6);
  }, [query]);

  return (
    <div className="rounded-lg border border-white/10 bg-white p-4 text-[#111827] shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#DA291C]">
            Buscador global
          </p>
          <h2 className="mt-1 text-base font-semibold text-[#111827]">
            Consulta ofertas durante la llamada
          </h2>
        </div>
      </div>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar promoción, catálogo, velocidad, precio o tecnología"
          className="h-11 rounded-lg border-slate-200 bg-slate-50 pl-9 text-[#111827] shadow-inner placeholder:text-slate-400"
        />
      </label>

      <div className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-100">
        {results.map((oferta) => (
          <Link
            key={oferta.id}
            href={`/ofertas/${oferta.id}`}
            className="flex items-center justify-between gap-4 bg-white px-3 py-3 text-sm transition hover:bg-red-50"
          >
            <span className="min-w-0">
              <span className="block truncate font-semibold text-[#111827]">
                {oferta.nombre}
              </span>
              <span className="mt-0.5 block truncate text-xs text-slate-500">
                {oferta.categoria} · {oferta.precio} · {oferta.velocidad}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[#DA291C]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
