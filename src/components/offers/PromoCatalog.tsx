"use client";

import { ArrowUpRight, Images } from "lucide-react";
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

export function PromoCatalog({ ofertas }: PromoCatalogProps) {
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionGalleryItem | null>(null);
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

  return (
    <section className="space-y-10">
      {visibleSections.map((section) => (
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
                onOpen={() => setSelectedPromotion(promotion)}
              />
            ))}
          </div>
        </section>
      ))}

      <PromotionImageViewer
        open={Boolean(selectedPromotion)}
        promotion={selectedPromotion}
        onOpenChange={(open) => {
          if (!open) setSelectedPromotion(null);
        }}
      />
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
