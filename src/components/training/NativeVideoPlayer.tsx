"use client";

import { useState, type MouseEvent } from "react";

type NativeVideoPlayerProps = {
  className?: string;
  src: string;
  title: string;
};

export function NativeVideoPlayer({
  className,
  src,
  title,
}: NativeVideoPlayerProps) {
  const [hasPlaybackError, setHasPlaybackError] = useState(false);

  function handleSurfaceClick(event: MouseEvent<HTMLVideoElement>) {
    const video = event.currentTarget;
    const nativeControlsHeight = 56;

    if (
      !video.paused ||
      event.nativeEvent.offsetY >= video.clientHeight - nativeControlsHeight
    ) {
      return;
    }

    void video.play().catch(() => setHasPlaybackError(true));
  }

  return (
    <div className={`relative isolate ${className ?? ""}`}>
      <video
        key={src}
        controls
        playsInline
        preload="metadata"
        src={src}
        aria-label={`Reproductor de video: ${title}`}
        className="relative z-10 block h-full w-full bg-black"
        onCanPlay={() => setHasPlaybackError(false)}
        onClick={handleSurfaceClick}
        onError={() => setHasPlaybackError(true)}
        onLoadedMetadata={() => setHasPlaybackError(false)}
        onPlaying={() => setHasPlaybackError(false)}
      >
        Tu navegador no puede reproducir este video.
      </video>

      {hasPlaybackError ? (
        <div className="absolute inset-x-3 bottom-3 z-20 rounded-md border border-[#DA291C]/30 bg-[#111827]/95 p-3 text-sm font-medium text-slate-100 shadow-lg">
          No se pudo reproducir el video integrado. {" "}
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#FFB4AC] underline underline-offset-2"
          >
            Abrir archivo original
          </a>
        </div>
      ) : null}
    </div>
  );
}
