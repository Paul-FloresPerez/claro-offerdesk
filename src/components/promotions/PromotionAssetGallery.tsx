"use client";

import { ChevronLeft, ChevronRight, Expand, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getPromotionAssetUrl,
  getPromotionVisualAssets,
  type PromotionAssetPresentation,
} from "@/lib/promotions/asset-presentation";

export function PromotionAssetGallery({
  assets,
  title,
}: {
  assets: PromotionAssetPresentation[];
  title: string;
}) {
  const visualAssets = useMemo(() => getPromotionVisualAssets(assets), [assets]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const safeActiveIndex = Math.min(activeIndex, Math.max(visualAssets.length - 1, 0));
  const activeAsset = visualAssets[safeActiveIndex] ?? null;

  if (!activeAsset) {
    return (
      <div className="grid min-h-80 place-items-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
        <div>
          <ImageIcon className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-3 font-medium text-foreground">Sin material visual</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Esta promoción todavía no tiene un flyer, cobertura o cuadro visual.
          </p>
        </div>
      </div>
    );
  }

  const hasMultipleAssets = visualAssets.length > 1;

  function showPrevious() {
    setActiveIndex(
      safeActiveIndex === 0 ? visualAssets.length - 1 : safeActiveIndex - 1
    );
  }

  function showNext() {
    setActiveIndex((safeActiveIndex + 1) % visualAssets.length);
  }

  return (
    <>
      <section aria-label={`Galería de ${title}`} className="flex flex-col gap-3">
        <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/20 p-3 sm:p-5">
          {hasMultipleAssets ? (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute left-3 z-10 shadow-sm"
              onClick={showPrevious}
              aria-label="Ver imagen anterior"
            >
              <ChevronLeft />
            </Button>
          ) : null}
          <button
            type="button"
            className="group relative block max-h-[70vh] max-w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setIsOpen(true)}
            aria-label={`Ampliar ${activeAsset.displayName}`}
          >
            <Image
              src={getPromotionAssetUrl(activeAsset.id)}
              alt={activeAsset.altText ?? activeAsset.displayName}
              width={activeAsset.width ?? 1400}
              height={activeAsset.height ?? 900}
              unoptimized
              draggable={false}
              className="max-h-[70vh] w-auto max-w-full select-none object-contain"
            />
            <span className="pointer-events-none absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Expand className="size-3.5" /> Ampliar
            </span>
          </button>
          {hasMultipleAssets ? (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute right-3 z-10 shadow-sm"
              onClick={showNext}
              aria-label="Ver imagen siguiente"
            >
              <ChevronRight />
            </Button>
          ) : null}
        </div>

        {hasMultipleAssets ? (
          <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Miniaturas">
            {visualAssets.map((asset, index) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver ${asset.displayName}`}
                aria-current={index === safeActiveIndex ? "true" : undefined}
                className={`relative size-16 shrink-0 overflow-hidden rounded-md border bg-muted/20 p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  index === safeActiveIndex
                    ? "border-primary ring-1 ring-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Image
                  src={getPromotionAssetUrl(asset.id)}
                  alt=""
                  fill
                  sizes="64px"
                  unoptimized
                  draggable={false}
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[94vh] max-w-6xl overflow-hidden p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>{activeAsset.displayName}</DialogTitle>
            <DialogDescription>Material visual de {title}.</DialogDescription>
          </DialogHeader>
          <div className="flex max-h-[76vh] items-center justify-center overflow-auto rounded-lg bg-muted/20 p-2 sm:p-4">
            <Image
              src={getPromotionAssetUrl(activeAsset.id)}
              alt={activeAsset.altText ?? activeAsset.displayName}
              width={activeAsset.width ?? 1800}
              height={activeAsset.height ?? 1200}
              unoptimized
              draggable={false}
              className="h-auto max-h-[70vh] w-auto max-w-full select-none object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
