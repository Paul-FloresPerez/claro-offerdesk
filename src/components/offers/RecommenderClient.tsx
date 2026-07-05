"use client";

import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TechnologyBadge } from "@/components/common/StatusBadge";
import { OfferCard } from "@/components/offers/OfferCard";
import { Button } from "@/components/ui/button";
import { recomendaciones } from "@/data/recomendaciones";
import type { Oferta } from "@/lib/offer-utils";
import { cn } from "@/lib/utils";

export function RecommenderClient({ ofertas }: { ofertas: Oferta[] }) {
  const [selectedId, setSelectedId] = useState(recomendaciones[0].id);

  const selected = useMemo(
    () => recomendaciones.find((item) => item.id === selectedId) ?? recomendaciones[0],
    [selectedId]
  );
  const oferta = ofertas.find((item) => item.id === selected.ofertaId);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-neutral-950">
          Necesidad del cliente
        </h2>
        <div className="grid gap-2">
          {recomendaciones.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={cn(
                "rounded-lg border p-3 text-left text-sm transition",
                selectedId === item.id
                  ? "border-[#DA291C] bg-red-50 text-[#7F1D1D]"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
              )}
            >
              <span className="block font-semibold">{item.titulo}</span>
              <span className="mt-1 block text-xs leading-5 opacity-80">
                {item.descripcion}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-start gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-red-50 text-[#DA291C]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-neutral-950">
                Oferta sugerida
              </p>
              <p className="text-sm leading-6 text-neutral-600">{selected.motivo}</p>
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm leading-6 text-yellow-900">
            <div className="mb-1 flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              Validacion critica
            </div>
            {selected.advertencia}
          </div>
        </div>

        {oferta ? (
          <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
            <OfferCard oferta={oferta} />

            <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex h-6 items-center rounded-md border border-red-200 bg-red-50 px-2 text-xs font-semibold text-[#B91C1C]">
                  {oferta.categoria}
                </span>
                {oferta.tecnologia.map((tecnologia) => (
                  <TechnologyBadge key={tecnologia} tecnologia={tecnologia} />
                ))}
              </div>

              <h3 className="text-lg font-semibold text-neutral-950">
                Validaciones antes de ofrecer
              </h3>
              <ul className="mt-4 space-y-3">
                {oferta.validaciones.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-neutral-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-4 text-sm leading-6 text-[#7F1D1D]">
                {oferta.fraseVenta}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Oferta no encontrada o inactiva en el catalogo.
          </div>
        )}

        {oferta ? (
          <Button asChild className="bg-[#DA291C] text-white hover:bg-[#B91C1C]">
            <Link href={`/ofertas/${oferta.id}`}>Abrir ficha sugerida</Link>
          </Button>
        ) : null}
      </section>
    </div>
  );
}
