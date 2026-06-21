import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { StatusBadge, TechnologyBadge } from "@/components/common/StatusBadge";
import { OfficialImage } from "@/components/offers/OfficialImage";
import { PromoBadge } from "@/components/offers/PromoBadge";
import type { Oferta } from "@/data/ofertas";

type RegularOfferBannerProps = {
  oferta: Oferta;
  highlighted?: boolean;
};

export function RegularOfferBanner({
  oferta,
  highlighted = false,
}: RegularOfferBannerProps) {
  return (
    <article
      id={`promo-${oferta.id}`}
      className="group relative scroll-mt-32 cursor-pointer overflow-hidden rounded-lg border border-[#DA291C]/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] text-[#111827] shadow-[0_22px_60px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-0.5 hover:border-[#DA291C]/45 hover:shadow-[0_28px_70px_rgba(0,0,0,0.28)] data-[highlighted=true]:border-[#DA291C]/70 data-[highlighted=true]:shadow-[0_0_0_3px_rgba(218,41,28,0.16),0_24px_70px_rgba(0,0,0,0.28)]"
      data-highlighted={highlighted}
    >
      <Link
        href={`/ofertas/${oferta.id}`}
        aria-label={`Abrir ficha de ${oferta.nombre}`}
        className="absolute inset-0 z-10 block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      />

      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <PromoBadge tone="red">Oferta base</PromoBadge>
            {oferta.estado === "material-oficial" ? (
              <StatusBadge estado={oferta.estado} />
            ) : null}
            {oferta.tecnologia.map((tecnologia) => (
              <TechnologyBadge key={tecnologia} tecnologia={tecnologia} />
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {oferta.nombre}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Condición regular / estándar
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              One Play · Two Play · Three Play
            </p>
          </div>

          <Link
            href={`/ofertas/${oferta.id}`}
            aria-label={`Abrir oferta base: ${oferta.nombre}`}
            className="relative z-20 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#DA291C] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(218,41,28,0.24)] transition hover:bg-[#B91C1C] sm:w-auto"
          >
            Abrir oferta base
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
          <OfficialImage
            item={oferta.media.principal}
            interactive
            preload
            title={oferta.nombre}
            variant="banner"
          />
        </div>
      </div>
    </article>
  );
}
