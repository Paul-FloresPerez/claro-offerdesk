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
import { getOfficialImageDimensions } from "@/components/offers/OfficialImage";

type OfferImageDialogProps = {
  src: string;
  title: string;
};

export function OfferImageDialog({ src, title }: OfferImageDialogProps) {
  const dimensions = getOfficialImageDimensions(src);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-[#111827] shadow-sm transition hover:border-[#DA291C]/30 hover:text-[#DA291C]"
        >
          <Maximize2 className="h-4 w-4" />
          Ver imagen en grande
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[min(96vw,1200px)] gap-4 bg-[#111827] p-4 text-white sm:max-w-[min(96vw,1200px)]">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-slate-300">
            Material oficial de la promoción.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[78vh] overflow-hidden rounded-lg bg-white p-2">
          <Image
            src={src}
            alt={`Imagen ampliada - ${title}`}
            width={dimensions.width}
            height={dimensions.height}
            sizes="96vw"
            className="max-h-[74vh] w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
