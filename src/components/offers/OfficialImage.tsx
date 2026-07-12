import { ImageIcon } from "lucide-react";
import Image from "next/image";
import type { OfertaMediaAdicional } from "@/lib/offer-utils";
import { cn } from "@/lib/utils";

type OfficialImageSource = string | OfertaMediaAdicional;

type OfficialImageProps = {
  item?: OfficialImageSource;
  title?: string;
  description?: string;
  className?: string;
  interactive?: boolean;
  preload?: boolean;
  variant?: "banner" | "card" | "natural" | "wide" | "hero";
};

const imageDimensions: Record<string, { width: number; height: number }> = {
  "/ofertas/hfc-puro-ciudades.png": { width: 966, height: 390 },
  "/ofertas/hfc-puro.png": { width: 722, height: 692 },
  "/ofertas/linea-movil-MAX.png": { width: 1082, height: 650 },
  "/ofertas/linea-movil-MAXILIMITADO.png": { width: 1085, height: 552 },
  "/ofertas/oferta-basico.png": { width: 957, height: 717 },
  "/ofertas/oferta-basicociudades.png": { width: 966, height: 495 },
  "/ofertas/oferta-medio.png": { width: 960, height: 695 },
  "/ofertas/oferta-mediociudades.png": { width: 962, height: 462 },
  "/ofertas/Oferta-Regular.png": { width: 1050, height: 747 },
  "/ofertas/canales-tecnologias%20.png": { width: 985, height: 697 },
  "/ofertas/oferta-relampago.png": { width: 725, height: 740 },
  "/ofertas/promo-1-sol.png": { width: 721, height: 765 },
  "/ofertas/promo-grande.png": { width: 957, height: 731 },
  "/ofertas/promo-grandeciudades.png": { width: 965, height: 112 },
};

export function getOfficialImageDimensions(src: string) {
  return imageDimensions[src] ?? { width: 1200, height: 800 };
}

export function OfficialImage({
  item,
  title,
  description,
  className,
  interactive = false,
  preload,
  variant = "natural",
}: OfficialImageProps) {
  const frameClass = {
    banner: "h-[220px] sm:h-[260px] lg:h-[300px]",
    card: "h-[190px] sm:h-[240px] lg:h-[280px]",
    natural: "min-h-72 aspect-[16/9]",
    wide: "min-h-28 aspect-[4/1]",
    hero: "min-h-[360px] aspect-[16/10] lg:min-h-[520px]",
  }[variant];

  if (!item) {
    return (
      <div
        className={cn(
          "flex min-h-52 items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-[linear-gradient(135deg,#fff,#f4f4f5)] text-neutral-500",
          frameClass,
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
  const dimensions = getOfficialImageDimensions(src);
  const shouldPreload = preload ?? variant === "hero";
  const imageLoadProps = shouldPreload
    ? { preload: true }
    : { loading: variant === "hero" ? ("eager" as const) : ("lazy" as const) };
  const isExternalImage = src.startsWith("https://");

  const imageSizes = {
    banner: "(max-width: 1024px) 100vw, 50vw",
    card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    natural: "(max-width: 1024px) 100vw, 50vw",
    wide: "100vw",
    hero: "(max-width: 1024px) 100vw, 58vw",
  }[variant];
  const showCaption =
    variant !== "banner" &&
    variant !== "card" &&
    Boolean(captionTitle || captionDescription);

  return (
    <figure className={cn("space-y-2", className)}>
      <div
        className={cn(
          "group/image relative overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition duration-300",
          interactive &&
            "cursor-zoom-in border-[#DA291C]/25 group-hover:border-[#DA291C]/45 group-hover:shadow-[0_18px_44px_rgba(218,41,28,0.14)]",
          frameClass
        )}
      >
        {isExternalImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={captionTitle ?? "Imagen oficial de oferta Claro"}
            className={cn(
              "h-full w-full object-contain transition duration-300 group-hover/image:scale-[1.015] group-hover:scale-[1.015]",
              variant === "card" || variant === "banner" ? "p-3" : "p-2 sm:p-3"
            )}
          />
        ) : (
          <Image
            src={src}
            alt={captionTitle ?? "Imagen oficial de oferta Claro"}
            width={dimensions.width}
            height={dimensions.height}
            sizes={imageSizes}
            className={cn(
              "h-full w-full object-contain transition duration-300 group-hover/image:scale-[1.015] group-hover:scale-[1.015]",
              variant === "card" || variant === "banner" ? "p-3" : "p-2 sm:p-3"
            )}
            {...imageLoadProps}
          />
        )}
      </div>
      {showCaption ? (
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
