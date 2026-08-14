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
      <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-foreground">
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
                  ? "border-primary bg-primary/10 text-brand-emphasis"
                  : "border-border bg-card text-muted-foreground hover:border-border hover:bg-muted"
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
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-start gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Oferta sugerida
              </p>
              <p className="text-sm leading-6 text-muted-foreground">{selected.motivo}</p>
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

            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex h-6 items-center rounded-md border border-primary/20 bg-primary/10 px-2 text-xs font-semibold text-brand-emphasis">
                  {oferta.categoria}
                </span>
                {oferta.tecnologia.map((tecnologia) => (
                  <TechnologyBadge key={tecnologia} tecnologia={tecnologia} />
                ))}
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Validaciones antes de ofrecer
              </h3>
              <ul className="mt-4 space-y-3">
                {oferta.validaciones.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-lg border border-primary/15 bg-primary/10 p-4 text-sm leading-6 text-brand-emphasis">
                {oferta.fraseVenta}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm text-red-700">
            Oferta no encontrada o inactiva en el catalogo.
          </div>
        )}

        {oferta ? (
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href={`/ofertas/${oferta.id}`}>Abrir ficha sugerida</Link>
          </Button>
        ) : null}
      </section>
    </div>
  );
}
