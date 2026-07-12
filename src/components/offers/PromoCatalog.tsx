"use client";

import { ArrowRight, ArrowUpRight, Images } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { PromotionImageViewer } from "@/components/promotions/PromotionImageViewer";
import {
  promotionGallerySections,
  type PromotionGalleryItem,
} from "@/data/promotion-gallery";
import type { Oferta } from "@/lib/offer-utils";

type PromoCatalogProps = {
  ofertas: Oferta[];
};

type SelectedPromotion = {
  initialPageIndex: number;
  promotion: PromotionGalleryItem;
};

const quickAccess = [
  { label: "Oferta regular", offerId: "oferta-regular", pageIndex: 0 },
  { label: "Canales", offerId: "oferta-regular", pageIndex: 1 },
  { label: "HFC Puro", offerId: "hfc-puro", pageIndex: 0 },
  { label: "Básico", offerId: "oferta-basico", pageIndex: 0 },
  { label: "Medio", offerId: "oferta-medio", pageIndex: 0 },
  { label: "Grande", offerId: "promo-grande", pageIndex: 0 },
  { label: "Línea móvil", offerId: "linea-movil", pageIndex: 0 },
  { label: "S/1", offerId: "promo-1-sol", pageIndex: 0 },
] as const;

export function PromoCatalog({ ofertas }: PromoCatalogProps) {
  const [selectedPromotion, setSelectedPromotion] =
    useState<SelectedPromotion | null>(null);
  const activeOfferIds = useMemo(
    () => new Set(ofertas.map((oferta) => oferta.id)),
    [ofertas]
  );
  const visibleSections = useMemo(
    () =>
      promotionGallerySections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => activeOfferIds.has(item.offerId)),
        }))
        .filter((section) => section.items.length > 0),
    [activeOfferIds]
  );
  const promotionsById = useMemo(
    () =>
      new Map(
        visibleSections.flatMap((section) =>
          section.items.map((promotion) => [promotion.offerId, promotion] as const)
        )
      ),
    [visibleSections]
  );
  const regularPromotion = promotionsById.get("oferta-regular") ?? null;
  const groupedSections = visibleSections.filter(
    (section) => section.id !== "regulares"
  );

  function openPromotion(
    promotion: PromotionGalleryItem,
    initialPageIndex = 0
  ) {
    setSelectedPromotion({ initialPageIndex, promotion });
  }

  return (
    <section className="space-y-10">
      {regularPromotion ? (
        <RegularOfferHighlight
          promotion={regularPromotion}
          onOpen={openPromotion}
        />
      ) : null}

      <nav
        aria-label="Accesos rápidos de promociones"
        className="rounded-xl border border-white/10 bg-[#172033]/85 p-3 shadow-[0_16px_38px_rgba(0,0,0,0.16)]"
      >
        <p className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
          Accesos rápidos
        </p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {quickAccess.map((access) => {
            const promotion = promotionsById.get(access.offerId);

            if (!promotion) return null;

            return (
              <button
                key={`${access.offerId}-${access.pageIndex}`}
                type="button"
                onClick={() => openPromotion(promotion, access.pageIndex)}
                className="inline-flex h-9 shrink-0 items-center rounded-full border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-slate-100 transition hover:border-[#DA291C]/45 hover:bg-[#DA291C]/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4AC]"
              >
                {access.label}
              </button>
            );
          })}
        </div>
      </nav>

      {groupedSections.map((section) => (
        <section key={section.id} aria-labelledby={`section-${section.id}`}>
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FFB4AC]">
                Material oficial agrupado
              </p>
              <h2
                id={`section-${section.id}`}
                className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
              >
                {section.title}
              </h2>
            </div>
            <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-300 sm:inline-flex">
              <Images className="h-4 w-4 text-[#FFB4AC]" />
              {section.items.length} {section.items.length === 1 ? "opción" : "opciones"}
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {section.items.map((promotion) => (
              <PromotionCard
                key={promotion.offerId}
                promotion={promotion}
                onOpen={() => openPromotion(promotion)}
              />
            ))}
          </div>
        </section>
      ))}

      <PromotionImageViewer
        open={Boolean(selectedPromotion)}
        promotion={selectedPromotion?.promotion ?? null}
        initialPageIndex={selectedPromotion?.initialPageIndex}
        onOpenChange={(open) => {
          if (!open) setSelectedPromotion(null);
        }}
      />
    </section>
  );
}

function RegularOfferHighlight({
  onOpen,
  promotion,
}: {
  onOpen: (promotion: PromotionGalleryItem, initialPageIndex?: number) => void;
  promotion: PromotionGalleryItem;
}) {
  const plansImage = promotion.images[0];

  return (
    <section aria-labelledby="oferta-regular-principal">
      <article className="overflow-hidden rounded-xl border border-[#DA291C]/30 bg-white text-[#111827] shadow-[0_24px_68px_rgba(0,0,0,0.24)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-8">
            <span className="w-fit rounded-full border border-[#DA291C]/15 bg-[#DA291C]/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#B91F15]">
              Matriz principal de consulta
            </span>
            <h2
              id="oferta-regular-principal"
              className="mt-4 text-3xl font-semibold tracking-tight text-[#111827] sm:text-4xl"
            >
              Oferta Regular
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
              Planes, velocidades, TV, tecnologías y adicionales.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onOpen(promotion, 0)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#DA291C] px-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(218,41,28,0.24)] transition hover:bg-[#B91F15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C] focus-visible:ring-offset-2"
              >
                Ver planes regulares
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpen(promotion, 1)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-[#111827] shadow-sm transition hover:border-[#DA291C]/35 hover:text-[#B91F15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C] focus-visible:ring-offset-2"
              >
                Canales y tecnologías
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative min-h-72 border-t border-slate-200 bg-slate-50 p-4 lg:min-h-0 lg:border-l lg:border-t-0">
            <Image
              src={plansImage.src}
              alt={plansImage.alt}
              fill
              sizes="(max-width: 1023px) 100vw, 46vw"
              className="object-contain p-4"
              draggable={false}
              preload
            />
          </div>
        </div>
      </article>
    </section>
  );
}

function PromotionCard({
  onOpen,
  promotion,
}: {
  onOpen: () => void;
  promotion: PromotionGalleryItem;
}) {
  const cover = promotion.images[0];

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white text-left text-[#111827] shadow-[0_14px_38px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-[#DA291C]/35 hover:shadow-[0_22px_52px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4AC] focus-visible:ring-offset-4 focus-visible:ring-offset-[#111827]"
      aria-label={`Ver promoción ${promotion.name}`}
    >
      <span className="relative block h-64 w-full overflow-hidden border-b border-slate-200 bg-slate-50 p-3 sm:h-72">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="object-contain p-3 transition duration-300 group-hover:scale-[1.01]"
          draggable={false}
        />
        {promotion.images.length > 1 ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            <Images className="h-3.5 w-3.5 text-[#DA291C]" />
            {promotion.images.length} páginas
          </span>
        ) : null}
      </span>

      <span className="flex flex-1 flex-col p-5">
        <span className="w-fit rounded-full border border-[#DA291C]/15 bg-[#DA291C]/[0.07] px-2.5 py-1 text-xs font-semibold text-[#B91F15]">
          {promotion.category}
        </span>
        <span className="mt-3 text-xl font-semibold tracking-tight text-[#111827]">
          {promotion.name}
        </span>
        <span className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#DA291C] px-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(218,41,28,0.20)] transition group-hover:bg-[#B91F15]">
          Ver promoción
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </span>
    </button>
  );
}
