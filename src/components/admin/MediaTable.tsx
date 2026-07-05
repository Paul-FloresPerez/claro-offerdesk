"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import { ExternalLink, FileAudio, FileVideo, UserCheck, UserX } from "lucide-react";
import { setMediaStatusAction } from "@/actions/media";
import MediaForm, { type AdminMediaRow } from "@/components/admin/MediaForm";
import { Button } from "@/components/ui/button";
import type { MediaActionState } from "@/lib/validations/media";

type MediaTableProps = {
  mediaItems: AdminMediaRow[];
};

const initialState: MediaActionState = {
  status: "idle",
  message: "",
};

export default function MediaTable({ mediaItems }: MediaTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.07]">
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
              <MediaRow key={item.id} item={item} />
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

function MediaRow({ item }: { item: AdminMediaRow }) {
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
              <p className="font-semibold text-white">{item.title}</p>
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
          {item.fileKey ? (
            <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
              {item.fileKey}
            </p>
          ) : null}
        </td>
        <td className="px-5 py-4">
          <StatusPill tone={item.isActive ? "active" : "inactive"}>
            {item.isActive ? "Activo" : "Inactivo"}
          </StatusPill>
        </td>
        <td className="px-5 py-4">
          <StatusAction item={item} />
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
