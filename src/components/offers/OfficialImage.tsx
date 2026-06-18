import { ImageIcon } from "lucide-react";
import Image from "next/image";
import type { OfertaMediaAdicional } from "@/data/ofertas";
import { cn } from "@/lib/utils";

type OfficialImageSource = string | OfertaMediaAdicional;

type OfficialImageProps = {
  item?: OfficialImageSource;
  title?: string;
  description?: string;
  className?: string;
  variant?: "card" | "natural" | "wide" | "hero";
};

export function OfficialImage({
  item,
  title,
  description,
  className,
  variant = "natural",
}: OfficialImageProps) {
  if (!item) {
    return (
      <div
        className={cn(
          "flex min-h-52 items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-[linear-gradient(135deg,#fff,#f4f4f5)] text-neutral-500",
          variant === "card" ? "aspect-[16/10]" : "aspect-[16/9]",
          className
        )}
      >
        <div className="flex flex-col items-center gap-2 text-center text-sm">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-white text-[#DA291C] shadow-sm ring-1 ring-neutral-200">
            <ImageIcon className="h-5 w-5" />
          </span>
          <span className="font-medium">Imagen oficial pendiente</span>
          <span className="max-w-52 text-xs leading-5 text-neutral-500">
            Cargar material oficial para mostrar esta oferta.
          </span>
        </div>
      </div>
    );
  }

  const src = typeof item === "string" ? item : item.src;
  const captionTitle = typeof item === "string" ? title : item.titulo;
  const captionDescription =
    typeof item === "string" ? description : item.descripcion ?? description;

  const frameClass = {
    card: "aspect-[16/10]",
    natural: "aspect-[16/9] min-h-72",
    wide: "aspect-[4/1] min-h-28",
    hero: "aspect-[16/10] min-h-[360px] lg:min-h-[520px]",
  }[variant];

  return (
    <figure className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]",
          frameClass
        )}
      >
        <Image
          src={src}
          alt={captionTitle ?? "Imagen oficial de oferta Claro"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-2"
          loading={variant === "hero" ? "eager" : "lazy"}
          unoptimized
        />
      </div>
      {captionTitle || captionDescription ? (
        <figcaption className="text-xs leading-5 text-neutral-500">
          {captionTitle ? (
            <span className="font-semibold text-neutral-700">{captionTitle}</span>
          ) : null}
          {captionTitle && captionDescription ? " · " : null}
          {captionDescription}
        </figcaption>
      ) : null}
    </figure>
  );
}
