"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { ImageIcon, ListPlus, Save } from "lucide-react";
import {
  createPromotionAction,
  updatePromotionAction,
} from "@/actions/promotions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PromotionActionState } from "@/lib/validations/promotion";

export type AdminPromotionRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  price: string;
  benefits: string[];
  conditions: string[];
  validity: string;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type PromotionFormProps = {
  compact?: boolean;
  mode?: "create" | "edit";
  promotion?: AdminPromotionRow;
};

const initialState: PromotionActionState = {
  status: "idle",
  message: "",
};

const categoryOptions = [
  "Oferta base",
  "Hogar",
  "Tecnologia / HFC",
  "Promociones especiales",
  "Linea Movil",
];

export default function PromotionForm({
  compact = false,
  mode = "create",
  promotion,
}: PromotionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = mode === "create" ? createPromotionAction : updatePromotionAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState(promotion?.imageUrl ?? "");
  const [previewFailed, setPreviewFailed] = useState(false);
  const isEdit = mode === "edit";

  useEffect(() => {
    if (mode === "create" && state.status === "success") {
      formRef.current?.reset();
      setImageUrl("");
    }
  }, [mode, state.status]);

  useEffect(() => {
    setPreviewFailed(false);
  }, [imageUrl]);

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
          <ListPlus className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {isEdit ? "Editar promocion" : "Nueva promocion"}
          </h2>
          <p className="text-sm text-slate-400">
            {isEdit
              ? "Actualiza datos, imagen y estado de visibilidad."
              : "Crea una promocion visible en el catalogo cuando este activa."}
          </p>
        </div>
      </div>

      <form
        ref={formRef}
        action={formAction}
        encType="multipart/form-data"
        className="grid gap-4 lg:grid-cols-3"
      >
        {isEdit ? <input type="hidden" name="id" value={promotion?.id} /> : null}

        <AdminField
          label="Titulo"
          name="title"
          defaultValue={promotion?.title}
          error={fieldError(state, "title")}
          required
        />
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Categoria
          <select
            name="category"
            defaultValue={promotion?.category ?? "Hogar"}
            className="h-10 rounded-md border border-white/10 bg-[#111827]/55 px-2.5 text-sm text-white outline-none transition focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
          >
            {categoryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {fieldError(state, "category") ? (
            <span className="text-xs font-medium text-[#FFB4AC]">
              {fieldError(state, "category")}
            </span>
          ) : null}
        </label>
        <AdminField
          label="Precio"
          name="price"
          defaultValue={promotion?.price}
          error={fieldError(state, "price")}
          required
        />

        <label className="grid gap-2 text-sm font-semibold text-slate-200 lg:col-span-3">
          Descripcion
          <textarea
            name="description"
            defaultValue={promotion?.description ?? ""}
            rows={3}
            className="min-h-24 rounded-md border border-white/10 bg-[#111827]/55 px-2.5 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
            placeholder="Resumen comercial que vera el asesor"
            required
          />
          {fieldError(state, "description") ? (
            <span className="text-xs font-medium text-[#FFB4AC]">
              {fieldError(state, "description")}
            </span>
          ) : null}
        </label>

        <AdminField
          label="Vigencia"
          name="validity"
          defaultValue={promotion?.validity}
          error={fieldError(state, "validity")}
          required
        />
        <AdminField
          label="Orden"
          name="sortOrder"
          defaultValue={promotion?.sortOrder?.toString() ?? "0"}
          error={fieldError(state, "sortOrder")}
          type="number"
          min="0"
          required
        />
        <label className="flex items-center gap-3 rounded-md border border-white/10 bg-[#111827]/45 px-3 py-2 text-sm font-semibold text-slate-200">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={promotion?.isActive ?? true}
            className="h-4 w-4 rounded border-white/20 bg-[#111827] accent-[#DA291C]"
          />
          Promocion activa
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-200 lg:col-span-3">
          Beneficios
          <textarea
            name="benefits"
            defaultValue={promotion?.benefits.join("\n") ?? ""}
            rows={4}
            className="min-h-28 rounded-md border border-white/10 bg-[#111827]/55 px-2.5 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
            placeholder={"Un beneficio por linea\nEjemplo: Repetidor incluido"}
          />
          {fieldError(state, "benefits") ? (
            <span className="text-xs font-medium text-[#FFB4AC]">
              {fieldError(state, "benefits")}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-200 lg:col-span-3">
          Condiciones
          <textarea
            name="conditions"
            defaultValue={promotion?.conditions.join("\n") ?? ""}
            rows={4}
            className="min-h-28 rounded-md border border-white/10 bg-[#111827]/55 px-2.5 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
            placeholder={"Una condicion por linea\nEjemplo: Sujeto a cobertura"}
          />
          {fieldError(state, "conditions") ? (
            <span className="text-xs font-medium text-[#FFB4AC]">
              {fieldError(state, "conditions")}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-200 lg:col-span-2">
          Imagen URL o ruta publica
          <Input
            name="imageUrl"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="/ofertas/promo.png o https://..."
            className="h-10 border-white/10 bg-[#111827]/55 text-white placeholder:text-slate-500"
          />
          {fieldError(state, "imageUrl") ? (
            <span className="text-xs font-medium text-[#FFB4AC]">
              {fieldError(state, "imageUrl")}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Subir imagen
          <input
            name="imageFile"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="h-10 rounded-md border border-white/10 bg-[#111827]/55 px-2.5 py-2 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-[#DA291C] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
          />
          {fieldError(state, "imageFile") ? (
            <span className="text-xs font-medium text-[#FFB4AC]">
              {fieldError(state, "imageFile")}
            </span>
          ) : null}
        </label>

        <ImagePreview
          imageUrl={imageUrl}
          previewFailed={previewFailed}
          onError={() => setPreviewFailed(true)}
        />

        <div className="flex flex-col gap-3 lg:col-span-3">
          {state.message ? (
            <div
              className={
                state.status === "success"
                  ? "rounded-md border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-200"
                  : "rounded-md border border-[#DA291C]/30 bg-[#DA291C]/12 px-3 py-2 text-sm font-semibold text-[#FFB4AC]"
              }
            >
              {state.message}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={isPending}
            className="h-11 w-full bg-[#DA291C] text-white hover:bg-[#B91F15] disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit"
          >
            <Save className="h-4 w-4" />
            {isPending
              ? "Guardando..."
              : isEdit
                ? "Guardar cambios"
                : "Crear promocion"}
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
  required,
  type = "text",
  ...props
}: {
  defaultValue?: string;
  error?: string;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-200">
      {label}
      <Input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="h-10 border-white/10 bg-[#111827]/55 text-white placeholder:text-slate-500"
        {...props}
      />
      {error ? (
        <span className="text-xs font-medium text-[#FFB4AC]">{error}</span>
      ) : null}
    </label>
  );
}

function ImagePreview({
  imageUrl,
  onError,
  previewFailed,
}: {
  imageUrl: string;
  onError: () => void;
  previewFailed: boolean;
}) {
  return (
    <div className="lg:col-span-3">
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#111827]/55 p-3">
        <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-md bg-white/[0.06] text-[#FFB4AC] ring-1 ring-white/10">
          {imageUrl && !previewFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Preview de promocion"
              className="h-full w-full object-cover"
              onError={onError}
            />
          ) : (
            <ImageIcon className="h-5 w-5" />
          )}
        </span>
        <div>
          <p className="text-sm font-semibold text-white">Preview de imagen</p>
          <p className="mt-1 text-xs text-slate-500">
            Si subes un archivo con Blob configurado, esa URL reemplazara la ruta
            manual.
          </p>
        </div>
      </div>
    </div>
  );
}

function fieldError(state: PromotionActionState, field: string) {
  return state.errors?.[field]?.[0];
}
