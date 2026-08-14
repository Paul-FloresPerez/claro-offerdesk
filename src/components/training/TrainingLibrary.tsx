"use client";

import { useState, type ComponentType } from "react";
import { AlertCircle, ExternalLink, Headphones, Play, Video } from "lucide-react";
import { NativeVideoPlayer } from "@/components/training/NativeVideoPlayer";
import type { TrainingMediaFile } from "@/lib/training-media";

type TrainingLibraryProps = {
  videos: TrainingMediaFile[];
  audios: TrainingMediaFile[];
};

export function TrainingLibrary({ videos, audios }: TrainingLibraryProps) {
  return (
    <div className="grid gap-4">
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
    <section className="rounded-xl border border-border bg-card p-4 shadow-[0_14px_34px_rgba(0,0,0,0.12)] sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-brand-emphasis">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <span className="inline-flex w-fit rounded-md border border-border bg-background/55 px-3 py-2 text-xs font-semibold text-muted-foreground">
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
  const youtubeEmbedUrl =
    isVideo && item.sourceType === "youtube" ? getYouTubeEmbedUrl(item.fileUrl) : null;

  return (
    <article
      className={
        isVideo
          ? "overflow-hidden rounded-xl border border-border bg-background/55"
          : "rounded-xl border border-border bg-background/55 p-3"
      }
    >
      {isVideo ? (
        <div className="aspect-video w-full bg-[#070B13]">
          {isMounted && youtubeEmbedUrl ? (
            <iframe
              src={youtubeEmbedUrl}
              title={item.title}
              className="h-full w-full bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : youtubeEmbedUrl ? (
            <MediaPlaceholder item={item} onPlay={() => setIsMounted(true)} />
          ) : (
            <NativeVideoPlayer
              className="h-full w-full"
              src={item.fileUrl}
              title={item.title}
            />
          )}
        </div>
      ) : (
        <div className="mb-3 flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-card text-brand-emphasis ring-1 ring-border">
            <Headphones className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
            <p className="mt-1 truncate text-xs text-muted-foreground">{item.fileName}</p>
            {item.weekLabel ? (
              <p className="mt-1 text-xs font-semibold text-brand-emphasis">
                {item.weekLabel}
              </p>
            ) : null}
          </div>
        </div>
      )}

      <div className={isVideo ? "p-3" : "grid gap-3"}>
        {isVideo ? (
          <>
            <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
            <p className="mt-1 truncate text-xs text-muted-foreground">{item.fileName}</p>
            {item.description ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            ) : null}
            {item.weekLabel ? (
              <p className="mt-2 text-xs font-semibold text-brand-emphasis">
                {item.weekLabel}
              </p>
            ) : null}
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

function getYouTubeEmbedUrl(fileUrl: string) {
  try {
    const url = new URL(fileUrl);
    const host = url.hostname.toLowerCase();
    const videoId =
      host === "youtu.be"
        ? url.pathname.split("/").filter(Boolean)[0]
        : url.searchParams.get("v") ?? getYouTubePathVideoId(url.pathname);

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
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
          ? "rounded-lg border border-dashed border-border bg-background/55 p-3"
          : "grid h-full min-h-48 place-items-center p-5 text-center"
      }
    >
      <button
        type="button"
        onClick={onPlay}
        className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_14px_30px_rgba(218,41,28,0.18)] transition hover:bg-primary/90"
      >
        <Play className="h-4 w-4" />
        Reproducir
      </button>
      <p className={compact ? "mt-2 text-xs text-muted-foreground" : "mt-3 text-xs text-muted-foreground"}>
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
        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground"
      >
        <ExternalLink className="h-4 w-4" />
        Abrir en nueva pestana
      </a>
    </div>
  );
}

function PlaybackError() {
  return (
    <div className="mt-3 flex gap-2 rounded-lg border border-primary/25 bg-primary/12 px-3 py-2 text-sm font-semibold leading-5 text-brand-emphasis">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>
        Este navegador no pudo reproducir el archivo integrado. Usa “Abrir en
        nueva pestaña” para reproducir el original o revisar si Brave está
        bloqueando su origen.
      </span>
    </div>
  );
}

function getYouTubePathVideoId(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "shorts" || segments[0] === "embed") {
    return segments[1] ?? null;
  }

  return null;
}

function PendingLibraryItem({
  icon: Icon,
  path,
}: {
  icon: ComponentType<{ className?: string }>;
  path: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-background/55 p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-dashed border-border text-muted-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">
          Archivo pendiente de cargar
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{path}</p>
      </div>
    </div>
  );
}
