"use client";

import { Maximize2 } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getOfficialImageDimensions,
  OfficialImage,
} from "@/components/offers/OfficialImage";
import { cn } from "@/lib/utils";

type OfferImageDialogProps = {
  buttonLabel?: string;
  className?: string;
  description?: string;
  hint?: string;
  preload?: boolean;
  preview?: boolean;
  showButton?: boolean;
  src: string;
  title: string;
  variant?: "banner" | "card" | "natural" | "wide" | "hero";
};

export function OfferImageDialog({
  buttonLabel = "Ver imagen en grande",
  className,
  description = "Material oficial de la promoción.",
  hint,
  preload,
  preview = false,
  showButton = true,
  src,
  title,
  variant = "natural",
}: OfferImageDialogProps) {
  const dimensions = getOfficialImageDimensions(src);
  const hintText = hint ?? "Toca la imagen para ampliarla";

  return (
    <Dialog>
      <div className={cn("space-y-3", className)}>
        {preview ? (
          <div className="group relative">
            <OfficialImage
              item={src}
              title={title}
              description={description}
              interactive
              preload={preload}
              variant={variant}
            />
            <p className="pointer-events-none absolute left-3 top-3 z-20 rounded-md border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#111827] shadow-sm">
              {hintText}
            </p>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label={`Ampliar imagen oficial de ${title}`}
                className="absolute inset-0 z-10 cursor-zoom-in rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <span className="sr-only">{hintText}</span>
              </button>
            </DialogTrigger>
          </div>
        ) : null}

        {showButton ? (
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-[#111827] shadow-sm transition hover:border-[#DA291C]/30 hover:text-[#DA291C]"
            >
              <Maximize2 className="h-4 w-4" />
              {buttonLabel}
            </button>
          </DialogTrigger>
        ) : null}
      </div>

      <DialogContent className="max-w-[min(98vw,1440px)] gap-4 bg-[#0B1220] p-4 text-white shadow-[0_30px_90px_rgba(0,0,0,0.55)] sm:max-w-[min(98vw,1440px)]">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-slate-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-hidden rounded-lg bg-white p-2">
          <Image
            src={src}
            alt={`Imagen ampliada - ${title}`}
            width={dimensions.width}
            height={dimensions.height}
            sizes="96vw"
            className="max-h-[76vh] w-full object-contain"
            unoptimized
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
