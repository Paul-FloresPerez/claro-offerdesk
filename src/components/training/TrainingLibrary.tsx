"use client";

import { useState, type ComponentType } from "react";
import { AlertCircle, ExternalLink, Headphones, Play, Video } from "lucide-react";
import type { TrainingMediaFile } from "@/lib/training-media";

type TrainingLibraryProps = {
  videos: TrainingMediaFile[];
  audios: TrainingMediaFile[];
};

export function TrainingLibrary({ videos, audios }: TrainingLibraryProps) {
  return (
    <div className="grid gap-5">
      <LibrarySection
        title="Videos de entrenamiento"
        description="Revisa los flujos visuales disponibles."
        icon={Video}
        items={videos}
        type="video"
        emptyPath="/capacitacion/videos/"
      />
      <LibrarySection
        title="Audios de referencia"
        description="Escucha llamadas para comparar tono, ritmo y claridad."
        icon={Headphones}
        items={audios}
        type="audio"
        emptyPath="/capacitacion/audios/"
      />
    </div>
  );
}

function LibrarySection({
  title,
  description,
  icon: Icon,
  items,
  type,
  emptyPath,
}: {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  items: TrainingMediaFile[];
  type: "audio" | "video";
  emptyPath: string;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.07] p-4 shadow-[0_18px_54px_rgba(0,0,0,0.2)] backdrop-blur">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#DA291C]/18 text-[#FFB4AC] ring-1 ring-[#DA291C]/25">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-400">{description}</p>
          </div>
        </div>
        <span className="inline-flex w-fit rounded-md border border-white/10 bg-[#111827]/55 px-3 py-2 text-xs font-semibold text-slate-300">
          {items.length} archivo{items.length === 1 ? "" : "s"}
        </span>
      </div>

      {items.length > 0 ? (
        <div
          className={
            type === "video" && items.length > 1
              ? "grid gap-4 lg:grid-cols-2"
              : type === "video"
                ? "grid max-w-3xl gap-4"
                : "grid gap-3"
          }
        >
          {items.map((item) => (
            <MediaItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <PendingLibraryItem icon={Icon} path={emptyPath} />
      )}
    </section>
  );
}

function MediaItem({ item }: { item: TrainingMediaFile }) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);
  const isVideo = item.mediaType === "video";

  return (
    <article
      className={
        isVideo
          ? "overflow-hidden rounded-lg border border-white/10 bg-[#111827]/58"
          : "rounded-lg border border-white/10 bg-[#111827]/58 p-3"
      }
    >
      {isVideo ? (
        <div className="aspect-video w-full bg-[#070B13]">
          {isMounted ? (
            <video
              controls
              playsInline
              preload="none"
              className="h-full w-full bg-black"
              onError={() => setHasPlaybackError(true)}
            >
              <source src={item.fileUrl} type={item.mimeType} />
              Tu navegador no puede reproducir este video.
            </video>
          ) : (
            <MediaPlaceholder item={item} onPlay={() => setIsMounted(true)} />
          )}
        </div>
      ) : (
        <div className="mb-3 flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white/[0.06] text-[#FFB4AC] ring-1 ring-white/10">
            <Headphones className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white">{item.title}</h3>
            <p className="mt-1 truncate text-xs text-slate-500">{item.fileName}</p>
          </div>
        </div>
      )}

      <div className={isVideo ? "p-3" : "grid gap-3"}>
        {isVideo ? (
          <>
            <h3 className="text-base font-semibold text-white">{item.title}</h3>
            <p className="mt-1 truncate text-xs text-slate-500">{item.fileName}</p>
          </>
        ) : isMounted ? (
          <audio
            controls
            preload="none"
            className="w-full"
            onError={() => setHasPlaybackError(true)}
          >
            <source src={item.fileUrl} type={item.mimeType} />
            Tu navegador no puede reproducir este audio.
          </audio>
        ) : (
          <MediaPlaceholder item={item} onPlay={() => setIsMounted(true)} compact />
        )}

        <MediaActions item={item} />
        {hasPlaybackError ? <PlaybackError /> : null}
      </div>
    </article>
  );
}

function MediaPlaceholder({
  compact = false,
  item,
  onPlay,
}: {
  compact?: boolean;
  item: TrainingMediaFile;
  onPlay: () => void;
}) {
  return (
    <div
      className={
        compact
          ? "rounded-lg border border-dashed border-white/15 bg-[#111827]/55 p-3"
          : "grid h-full min-h-48 place-items-center p-5 text-center"
      }
    >
      <button
        type="button"
        onClick={onPlay}
        className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#DA291C] px-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(218,41,28,0.18)] transition hover:bg-[#B91F15]"
      >
        <Play className="h-4 w-4" />
        Reproducir
      </button>
      <p className={compact ? "mt-2 text-xs text-slate-500" : "mt-3 text-xs text-slate-500"}>
        {item.mimeType}
      </p>
    </div>
  );
}

function MediaActions({ item }: { item: TrainingMediaFile }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <a
        href={item.fileUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.1] hover:text-white"
      >
        <ExternalLink className="h-4 w-4" />
        Abrir en nueva pestaña
      </a>
    </div>
  );
}

function PlaybackError() {
  return (
    <div className="mt-3 flex gap-2 rounded-lg border border-[#DA291C]/25 bg-[#DA291C]/12 px-3 py-2 text-sm font-semibold leading-5 text-[#FFB4AC]">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>
        Este navegador no pudo reproducir el archivo. Intenta abrirlo en nueva
        pestaña.
      </span>
    </div>
  );
}

function PendingLibraryItem({
  icon: Icon,
  path,
}: {
  icon: ComponentType<{ className?: string }>;
  path: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-white/15 bg-[#111827]/55 p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-dashed border-white/20 text-slate-400">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-white">
          Archivo pendiente de cargar
        </p>
        <p className="mt-1 text-xs text-slate-500">{path}</p>
      </div>
    </div>
  );
}
