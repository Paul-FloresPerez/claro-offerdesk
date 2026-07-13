"use client";

import { useActionState, type FormEvent, type ReactNode } from "react";
import {
  ExternalLink,
  FileAudio,
  FileVideo,
  House,
  MonitorPlay,
  Star,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  setFeaturedMediaAction,
  setMediaStatusAction,
} from "@/actions/media";
import MediaForm, { type AdminMediaRow } from "@/components/admin/MediaForm";
import { Button } from "@/components/ui/button";
import type { MediaActionState } from "@/lib/validations/media";

type MediaTableProps = {
  hasFeaturedVideo: boolean;
  mediaItems: AdminMediaRow[];
};

const initialState: MediaActionState = {
  status: "idle",
  message: "",
};

export function FeaturedMediaPanel({
  media,
}: {
  media: AdminMediaRow | null;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#DA291C]/30 bg-white/[0.075] shadow-[0_18px_54px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#DA291C]/18 text-[#FFB4AC] ring-1 ring-[#DA291C]/25">
          <House className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
            Seleccion explicita
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
            Video destacado del Inicio
          </h2>
        </div>
      </div>

      {media ? (
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_340px] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone={media.isActive ? "active" : "inactive"}>
                {media.isActive ? "Activo" : "Inactivo"}
              </StatusPill>
              <span className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[#DA291C]/25 bg-[#DA291C]/12 px-2.5 text-xs font-semibold text-[#FFB4AC]">
                <Star className="h-3.5 w-3.5" />
                Visible solo en Inicio
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">
              {media.title}
            </h3>
            {media.description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                {media.description}
              </p>
            ) : null}
            <p className="mt-2 break-all text-xs text-slate-500">
              {media.fileUrl}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={media.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.1] hover:text-white"
              >
                <MonitorPlay className="h-4 w-4" />
                Vista previa
              </a>
              <a
                href="#media-library"
                className="inline-flex h-9 items-center gap-2 rounded-md bg-[#DA291C] px-3 text-sm font-semibold text-white transition hover:bg-[#B91F15]"
              >
                Cambiar video
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[#070B13] p-2">
            <MediaPreview item={media} />
          </div>
        </div>
      ) : (
        <div className="p-5">
          <p className="text-base font-semibold text-white">
            Aun no hay un video seleccionado explicitamente.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Inicio conservara temporalmente el video base. Selecciona un video
            de la biblioteca para administrar esta portada.
          </p>
          <a
            href="#media-library"
            className="mt-4 inline-flex h-9 items-center rounded-md bg-[#DA291C] px-3 text-sm font-semibold text-white transition hover:bg-[#B91F15]"
          >
            Seleccionar video
          </a>
        </div>
      )}
    </section>
  );
}

export default function MediaTable({
  hasFeaturedVideo,
  mediaItems,
}: MediaTableProps) {
  return (
    <section
      id="media-library"
      className="scroll-mt-28 overflow-hidden rounded-lg border border-white/10 bg-white/[0.07]"
    >
      <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Biblioteca
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Materiales guardados en training_media.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-md border border-white/10 bg-[#111827]/55 px-3 py-2 text-xs font-semibold text-slate-300">
          {mediaItems.length} material{mediaItems.length === 1 ? "" : "es"}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-[#111827]/70 text-xs uppercase tracking-[0.12em] text-slate-400">
            <tr>
              <th className="px-5 py-3">Titulo</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Etiqueta</th>
              <th className="px-5 py-3">Ruta</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {mediaItems.map((item) => (
              <MediaRow
                key={item.id}
                hasFeaturedVideo={hasFeaturedVideo}
                item={item}
              />
            ))}
            {mediaItems.length === 0 ? (
              <tr className="text-slate-300">
                <td className="px-5 py-6" colSpan={6}>
                  No hay materiales registrados en base de datos.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MediaRow({
  hasFeaturedVideo,
  item,
}: {
  hasFeaturedVideo: boolean;
  item: AdminMediaRow;
}) {
  const Icon = item.mediaType === "audio" ? FileAudio : FileVideo;

  return (
    <>
      <tr className="align-top text-slate-200">
        <td className="px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC]">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-white">{item.title}</p>
                {item.mediaType === "video" ? (
                  item.isFeatured ? (
                    <span className="inline-flex h-6 items-center gap-1 rounded-md border border-[#DA291C]/25 bg-[#DA291C]/12 px-2 text-[11px] font-semibold text-[#FFB4AC]">
                      <House className="h-3 w-3" />
                      Video del Inicio
                    </span>
                  ) : (
                    <span className="inline-flex h-6 items-center rounded-md border border-sky-300/20 bg-sky-400/10 px-2 text-[11px] font-semibold text-sky-100">
                      Entrenamiento
                    </span>
                  )
                ) : null}
              </div>
              {item.description ? (
                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                  {item.description}
                </p>
              ) : null}
            </div>
          </div>
        </td>
        <td className="px-5 py-4 capitalize">{item.mediaType}</td>
        <td className="px-5 py-4">{item.weekLabel ?? "-"}</td>
        <td className="px-5 py-4">
          <a
            href={item.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex max-w-xs items-center gap-2 truncate text-[#FFB4AC] underline-offset-4 hover:underline"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.fileUrl}</span>
          </a>
          {item.isActive ? <MediaPreview item={item} /> : null}
        </td>
        <td className="px-5 py-4">
          <StatusPill tone={item.isActive ? "active" : "inactive"}>
            {item.isActive ? "Activo" : "Inactivo"}
          </StatusPill>
        </td>
        <td className="px-5 py-4">
          <div className="grid gap-2">
            <StatusAction item={item} />
            {item.mediaType === "video" && !item.isFeatured ? (
              <FeaturedAction
                hasFeaturedVideo={hasFeaturedVideo}
                item={item}
              />
            ) : null}
          </div>
        </td>
      </tr>
      <tr className="bg-[#111827]/35">
        <td colSpan={6} className="px-5 pb-5">
          <details className="rounded-lg border border-white/10 bg-white/[0.035]">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[#FFB4AC] transition hover:text-white">
              Editar material
            </summary>
            <div className="border-t border-white/10 p-4">
              <MediaForm mode="edit" media={item} compact />
            </div>
          </details>
        </td>
      </tr>
    </>
  );
}

function FeaturedAction({
  hasFeaturedVideo,
  item,
}: {
  hasFeaturedVideo: boolean;
  item: AdminMediaRow;
}) {
  const [state, formAction, isPending] = useActionState(
    setFeaturedMediaAction,
    initialState
  );

  function confirmReplacement(event: FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      hasFeaturedVideo
        ? "Este video se mostrara exclusivamente en Inicio. El video actual pasara a Entrenamiento. ¿Deseas continuar?"
        : "Este video se mostrara exclusivamente en Inicio. ¿Deseas continuar?"
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={confirmReplacement} className="grid gap-1">
      <input type="hidden" name="id" value={item.id} />
      <Button
        type="submit"
        disabled={isPending}
        className="h-auto min-h-8 w-fit border border-[#DA291C]/30 bg-[#DA291C]/12 px-2 py-1.5 text-left text-xs leading-4 text-[#FFB4AC] hover:bg-[#DA291C]/20 hover:text-white"
      >
        <House className="h-3.5 w-3.5" />
        {isPending ? "Actualizando..." : "Usar como video de Inicio"}
      </Button>
      {state.message ? (
        <p
          aria-live="polite"
          className={
            state.status === "success"
              ? "max-w-48 text-xs font-semibold text-emerald-200"
              : "max-w-48 text-xs font-semibold text-[#FFB4AC]"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function MediaPreview({ item }: { item: AdminMediaRow }) {
  const youtubeEmbedUrl =
    item.mediaType === "video" ? getYouTubeEmbedUrl(item.fileUrl) : null;

  if (youtubeEmbedUrl) {
    return (
      <iframe
        src={youtubeEmbedUrl}
        title={item.title}
        className="mt-3 aspect-video w-full max-w-xs rounded-md bg-black"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  if (item.mediaType === "video") {
    return (
      <video
        controls
        playsInline
        preload="none"
        className="mt-3 aspect-video w-full max-w-xs rounded-md bg-black"
      >
        <source src={item.fileUrl} type="video/mp4" />
      </video>
    );
  }

  return (
    <audio controls preload="none" className="mt-3 w-full max-w-xs">
      <source src={item.fileUrl} type={getAudioMimeType(item.fileUrl)} />
    </audio>
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

function getYouTubePathVideoId(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "shorts" || segments[0] === "embed") {
    return segments[1] ?? null;
  }

  return null;
}

function getAudioMimeType(fileUrl: string) {
  const pathname = safePathname(fileUrl).toLowerCase();

  if (pathname.endsWith(".m4a")) return "audio/mp4";
  if (pathname.endsWith(".ogg")) return "audio/ogg";

  return "audio/mpeg";
}

function safePathname(fileUrl: string) {
  try {
    return new URL(fileUrl).pathname;
  } catch {
    return fileUrl;
  }
}

function StatusAction({ item }: { item: AdminMediaRow }) {
  const [state, formAction, isPending] = useActionState(
    setMediaStatusAction,
    initialState
  );
  const nextActiveState = !item.isActive;

  return (
    <form action={formAction} className="grid gap-1">
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="isActive" value={String(nextActiveState)} />
      <Button
        type="submit"
        disabled={isPending}
        className="h-8 w-fit border border-white/10 bg-white/[0.06] px-2 text-xs text-slate-200 hover:bg-white/[0.1]"
      >
        {nextActiveState ? (
          <UserCheck className="h-3.5 w-3.5" />
        ) : (
          <UserX className="h-3.5 w-3.5" />
        )}
        {nextActiveState ? "Activar" : "Desactivar"}
      </Button>
      {state.message ? (
        <p
          aria-live="polite"
          className={
            state.status === "success"
              ? "text-xs font-semibold text-emerald-200"
              : "text-xs font-semibold text-[#FFB4AC]"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function StatusPill({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "active" | "inactive";
}) {
  const className =
    tone === "active"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
      : "border-slate-500/20 bg-slate-500/10 text-slate-300";

  return (
    <span
      className={`inline-flex h-7 w-fit items-center rounded-md border px-2.5 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}
