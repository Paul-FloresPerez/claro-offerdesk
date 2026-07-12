"use client";

import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getOfficialImageDimensions } from "@/components/offers/OfficialImage";
import type { PromotionGalleryItem } from "@/data/promotion-gallery";
import { cn } from "@/lib/utils";

type PromotionImageViewerProps = {
  open: boolean;
  promotion: PromotionGalleryItem | null;
  onOpenChange: (open: boolean) => void;
};

type Point = {
  x: number;
  y: number;
};

type DragState = {
  pointerId: number;
  start: Point;
  origin: Point;
};

const MIN_ZOOM = 50;
const MAX_ZOOM = 400;
const ZOOM_STEP = 25;

export function PromotionImageViewer({
  onOpenChange,
  open,
  promotion,
}: PromotionImageViewerProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<DragState | null>(null);

  const images = promotion?.images ?? [];
  const currentImage = images[pageIndex] ?? images[0];
  const dimensions = currentImage
    ? getOfficialImageDimensions(currentImage.src)
    : { width: 1200, height: 800 };
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!open) return;

    setPageIndex(0);
    setZoom(100);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    dragRef.current = null;
  }, [open, promotion?.offerId]);

  useEffect(() => {
    if (!open) return;

    setZoom(100);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    dragRef.current = null;
  }, [open, pageIndex]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }

      if (!hasMultipleImages) return;

      if (event.key === "ArrowLeft") {
        setPageIndex((current) => (current - 1 + images.length) % images.length);
      }

      if (event.key === "ArrowRight") {
        setPageIndex((current) => (current + 1) % images.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultipleImages, images.length, onOpenChange, open]);

  function fitCurrentImage() {
    setZoom(100);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    dragRef.current = null;
  }

  function resetViewer() {
    setPageIndex(0);
    fitCurrentImage();
  }

  function goToPage(nextIndex: number) {
    if (!images.length) return;

    setPageIndex((nextIndex + images.length) % images.length);
    fitCurrentImage();
  }

  function changeZoom(nextZoom: number) {
    const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
    setZoom(clampedZoom);

    if (clampedZoom <= 100) {
      setPan({ x: 0, y: 0 });
    }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    changeZoom(zoom + (event.deltaY < 0 ? 10 : -10));
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      zoom <= 100 ||
      (event.target as HTMLElement).closest("button")
    ) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: pan,
    };
    setIsDragging(true);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) return;

    setPan({
      x: drag.origin.x + event.clientX - drag.start.x,
      y: drag.origin.y + event.clientY - drag.start.y,
    });
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setIsDragging(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-xl border border-white/10 bg-[#070B13] p-0 text-white shadow-[0_32px_100px_rgba(0,0,0,0.72)] sm:max-w-none"
      >
        <header className="flex shrink-0 flex-col gap-3 border-b border-white/10 bg-[#0B1120] px-3 py-3 sm:px-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="truncate text-base font-semibold text-white sm:text-lg">
                {promotion?.name ?? "Promoción"}
              </DialogTitle>
              <DialogDescription className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400 sm:text-sm">
                <span className="font-semibold text-[#FFB4AC]">
                  {currentImage?.label ?? "Material oficial"}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {images.length ? `${pageIndex + 1} de ${images.length}` : "Sin imágenes"}
                </span>
              </DialogDescription>
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-white transition hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4AC]"
              aria-label="Cerrar visor"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ViewerButton
              label="Reducir zoom"
              onClick={() => changeZoom(zoom - ZOOM_STEP)}
              disabled={zoom <= MIN_ZOOM}
            >
              <Minus className="h-4 w-4" />
            </ViewerButton>
            <output
              className="inline-flex h-9 min-w-16 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] px-2 text-xs font-semibold tabular-nums text-slate-200"
              aria-label={`Zoom ${zoom}%`}
            >
              {zoom}%
            </output>
            <ViewerButton
              label="Aumentar zoom"
              onClick={() => changeZoom(zoom + ZOOM_STEP)}
              disabled={zoom >= MAX_ZOOM}
            >
              <Plus className="h-4 w-4" />
            </ViewerButton>
            <ViewerButton label="Ajustar a pantalla" onClick={fitCurrentImage} text="Ajustar">
              <Maximize2 className="h-4 w-4" />
            </ViewerButton>
            <ViewerButton label="Restablecer visor" onClick={resetViewer} text="Restablecer">
              <RotateCcw className="h-4 w-4" />
            </ViewerButton>
          </div>
        </header>

        <div
          className={cn(
            "relative flex min-h-0 flex-1 touch-none select-none items-center justify-center overflow-hidden bg-[#05070C] p-3 sm:p-6",
            zoom > 100 && (isDragging ? "cursor-grabbing" : "cursor-grab")
          )}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          {currentImage ? (
            <Image
              key={currentImage.src}
              src={currentImage.src}
              alt={currentImage.alt}
              width={dimensions.width}
              height={dimensions.height}
              sizes="100vw"
              unoptimized
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              className="max-h-full max-w-full object-contain transition-transform duration-75 ease-out"
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom / 100})`,
              }}
              preload
            />
          ) : null}

          {hasMultipleImages ? (
            <>
              <button
                type="button"
                onClick={() => goToPage(pageIndex - 1)}
                className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/65 text-white shadow-lg transition hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4AC] sm:left-4 sm:h-12 sm:w-12"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => goToPage(pageIndex + 1)}
                className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/65 text-white shadow-lg transition hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4AC] sm:right-4 sm:h-12 sm:w-12"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}
        </div>

        {hasMultipleImages ? (
          <footer className="flex shrink-0 items-center justify-center gap-2 border-t border-white/10 bg-[#0B1120] px-3 py-3">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => goToPage(index)}
                className={cn(
                  "h-9 rounded-lg border px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4AC]",
                  index === pageIndex
                    ? "border-[#DA291C] bg-[#DA291C] text-white"
                    : "border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]"
                )}
                aria-current={index === pageIndex ? "page" : undefined}
              >
                {image.label}
              </button>
            ))}
          </footer>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ViewerButton({
  children,
  disabled,
  label,
  onClick,
  text,
}: {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  text?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4AC]"
    >
      {children}
      {text ? <span className="hidden sm:inline">{text}</span> : null}
    </button>
  );
}
