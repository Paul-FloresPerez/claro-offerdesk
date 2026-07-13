"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { FileVideo, Link2, Save } from "lucide-react";
import { createMediaAction, updateMediaAction } from "@/actions/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MediaActionState, MediaType } from "@/lib/validations/media";

export type AdminMediaRow = {
  id: string;
  title: string;
  description: string | null;
  mediaType: MediaType;
  fileUrl: string;
  weekLabel: string | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type MediaFormProps = {
  compact?: boolean;
  media?: AdminMediaRow;
  mode?: "create" | "edit";
};

const initialState: MediaActionState = {
  status: "idle",
  message: "",
};

export default function MediaForm({
  compact = false,
  media,
  mode = "create",
}: MediaFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = mode === "edit";
  const action = isEdit ? updateMediaAction : createMediaAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [mediaType, setMediaType] = useState<MediaType>(media?.mediaType ?? "video");

  useEffect(() => {
    if (mode === "create" && state.status === "success") {
      formRef.current?.reset();
      setMediaType("video");
    }
  }, [mode, state.status]);

  return (
    <section
      className={
        compact
          ? "rounded-lg border border-white/10 bg-[#111827]/55 p-4"
          : "rounded-lg border border-white/10 bg-white/[0.07] p-5"
      }
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC]">
          {isEdit ? <FileVideo className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {isEdit ? "Editar material" : "Nuevo material"}
          </h2>
          <p className="text-sm text-slate-400">
            {isEdit
              ? "Actualiza datos, estado y ruta del material."
              : "Registra audios o videos para entrenamiento comercial."}
          </p>
        </div>
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="grid gap-4 sm:grid-cols-2"
      >
        {isEdit ? <input type="hidden" name="id" value={media?.id} /> : null}

        <AdminField
          label="Titulo"
          name="title"
          defaultValue={media?.title}
          error={fieldError(state, "title")}
          required
        />

        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Tipo
          <select
            name="mediaType"
            value={mediaType}
            onChange={(event) => setMediaType(event.target.value as MediaType)}
            className="h-10 rounded-md border border-white/10 bg-[#111827]/55 px-2.5 text-sm text-white outline-none transition focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
          >
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
          {fieldError(state, "mediaType") ? (
            <span className="text-xs font-medium text-[#FFB4AC]">
              {fieldError(state, "mediaType")}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-200 sm:col-span-2">
          Descripcion
          <textarea
            name="description"
            defaultValue={media?.description ?? ""}
            rows={3}
            className="min-h-20 rounded-md border border-white/10 bg-[#111827]/55 px-2.5 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
            placeholder="Detalle breve para orientar al asesor"
          />
          {fieldError(state, "description") ? (
            <span className="text-xs font-medium text-[#FFB4AC]">
              {fieldError(state, "description")}
            </span>
          ) : null}
        </label>

        <AdminField
          label="URL externa"
          name="fileUrl"
          defaultValue={media?.fileUrl}
          error={fieldError(state, "fileUrl")}
          placeholder={
            mediaType === "video"
              ? "YouTube o URL publica .mp4"
              : "URL publica .mp3, .m4a u .ogg"
          }
          required
        />
        <AdminField
          label="Semana / etiqueta"
          name="weekLabel"
          defaultValue={media?.weekLabel ?? ""}
          error={fieldError(state, "weekLabel")}
          placeholder="Semana 27 - 2026"
        />

        {media?.isFeatured ? (
          <p className="rounded-md border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-sm font-semibold leading-5 text-amber-100 sm:col-span-2">
            Este es el video de Inicio. Selecciona otro video antes de cambiarlo
            a audio o desactivarlo.
          </p>
        ) : null}

        <div className="grid content-end gap-3 rounded-lg border border-white/10 bg-[#111827]/55 p-3">
          <label className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-slate-200">
            Activo
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={isEdit ? Boolean(media?.isActive) : true}
              className="h-4 w-4 accent-[#DA291C]"
            />
          </label>
        </div>

        {state.message ? (
          <p
            aria-live="polite"
            className={
              state.status === "success"
                ? "rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200 sm:col-span-2"
                : "rounded-md border border-[#DA291C]/25 bg-[#DA291C]/12 px-3 py-2 text-sm font-semibold text-[#FFB4AC] sm:col-span-2"
            }
          >
            {state.message}
          </p>
        ) : null}

        <div className="sm:col-span-2">
          <Button
            type="submit"
            disabled={isPending}
            className="h-10 bg-[#DA291C] text-white hover:bg-[#B91F15]"
          >
            <Save className="h-4 w-4" />
            {isPending
              ? "Guardando..."
              : isEdit
                ? "Guardar cambios"
                : "Crear material"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function AdminField({
  defaultValue,
  error,
  label,
  name,
  placeholder,
  required,
}: {
  defaultValue?: string;
  error?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-200">
      {label}
      <Input
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="h-10 border-white/10 bg-[#111827]/55 text-white placeholder:text-slate-500"
      />
      {error ? <span className="text-xs font-medium text-[#FFB4AC]">{error}</span> : null}
    </label>
  );
}

function fieldError(state: MediaActionState, field: string) {
  return state.errors?.[field]?.[0];
}
