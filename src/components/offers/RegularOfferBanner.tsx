import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TechnologyBadge } from "@/components/common/StatusBadge";
import { OfficialImage } from "@/components/offers/OfficialImage";
import { PromoBadge } from "@/components/offers/PromoBadge";
import type { Oferta } from "@/data/ofertas";

type RegularOfferBannerProps = {
  oferta: Oferta;
};

export function RegularOfferBanner({ oferta }: RegularOfferBannerProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#DA291C]/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] text-[#111827] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <PromoBadge tone="red">Catálogo oficial</PromoBadge>
            {oferta.tecnologia.map((tecnologia) => (
              <TechnologyBadge key={tecnologia} tecnologia={tecnologia} />
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {oferta.nombre}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Precios oficiales One Play, Two Play y Three Play.
            </p>
          </div>

          <Link
            href={`/ofertas/${oferta.id}`}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#DA291C] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(218,41,28,0.24)] transition hover:bg-[#B91C1C] sm:w-auto"
          >
            Abrir catálogo oficial
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
          <OfficialImage
            item={oferta.media.principal}
            preload
            title={oferta.nombre}
            variant="banner"
          />
        </div>
      </div>
    </article>
  );
}
