"use client";

import { ArrowRight, ArrowUpRight, Images } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    function scrollToPromotion(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const quickAccess = event.target.closest<HTMLAnchorElement>(
        "a[data-promotion-scroll-target]"
      );
      const targetId = quickAccess?.dataset.promotionScrollTarget;
      const target = targetId ? document.getElementById(targetId) : null;

      if (!quickAccess || !target) return;

      event.preventDefault();
      window.history.pushState(null, "", `#${targetId}`);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    document.addEventListener("click", scrollToPromotion);

    return () => document.removeEventListener("click", scrollToPromotion);
  }, []);

  function openPromotion(
    promotion: PromotionGalleryItem,
    initialPageIndex = 0
  ) {
    setSelectedPromotion({ initialPageIndex, promotion });
  }

  return (
    <section className="space-y-8">
      {regularPromotion ? (
        <RegularOfferHighlight
          promotion={regularPromotion}
          onOpen={openPromotion}
        />
      ) : null}

      {groupedSections.map((section) => (
        <section key={section.id} aria-labelledby={`section-${section.id}`}>
          <div className="mb-4 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
            <div>
              <h2
                id={`section-${section.id}`}
                className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
              >
                {section.title}
              </h2>
            </div>
            <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-300 sm:inline-flex">
              <Images className="h-4 w-4 text-[#FFB4AC]" />
              {section.items.length} {section.items.length === 1 ? "opción" : "opciones"}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
          if (!open) {
            setSelectedPromotion(null);
          }
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
    <section
      id="promo-oferta-regular"
      aria-labelledby="oferta-regular-principal"
      className="scroll-mt-28"
    >
      <article className="overflow-hidden rounded-xl border border-[#DA291C]/25 bg-white text-[#111827] shadow-[0_16px_38px_rgba(0,0,0,0.18)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="flex flex-col justify-center p-5 sm:p-6 lg:p-7">
            <span className="w-fit rounded-full border border-[#DA291C]/15 bg-[#DA291C]/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#B91F15]">
              Consulta base
            </span>
            <h2
              id="oferta-regular-principal"
              className="mt-3 text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl"
            >
              Oferta Regular
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
              Planes, velocidades, TV, tecnologías y adicionales.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onOpen(promotion, 0)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#DA291C] px-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(218,41,28,0.24)] transition hover:bg-[#B91F15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C] focus-visible:ring-offset-2"
              >
                Ver planes regulares
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                id="promo-canales"
                type="button"
                onClick={() => onOpen(promotion, 1)}
                className="scroll-mt-28 inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-[#DA291C]/30 hover:bg-red-50 hover:text-[#B91F15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C] focus-visible:ring-offset-2"
              >
                <Images className="h-4 w-4 text-[#DA291C]" />
                Canales y tecnologías
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
      id={`promo-${promotion.offerId}`}
      type="button"
      onClick={onOpen}
      className="group flex h-full min-w-0 scroll-mt-28 flex-col overflow-hidden rounded-xl border border-white/10 bg-white text-left text-[#111827] shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition duration-200 hover:border-[#DA291C]/35 hover:shadow-[0_16px_38px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4AC] focus-visible:ring-offset-4 focus-visible:ring-offset-[#111827]"
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

      <span className="flex flex-1 flex-col p-4">
        <span className="flex flex-wrap items-center gap-2">
          <span className="w-fit rounded-full border border-[#DA291C]/15 bg-[#DA291C]/[0.07] px-2.5 py-1 text-xs font-semibold text-[#B91F15]">
            {promotion.category}
          </span>
          {promotion.offerId === "oferta-medio" ? (
            <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
              Más ofrecida
            </span>
          ) : null}
        </span>
        <span className="mt-3 text-lg font-semibold tracking-tight text-[#111827]">
          {promotion.name}
        </span>
        <span className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#DA291C] px-4 text-sm font-semibold text-white transition group-hover:bg-[#B91F15]">
          Ver promoción
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </span>
    </button>
  );
}
