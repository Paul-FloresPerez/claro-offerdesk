"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { ImageIcon, ListPlus, Save } from "lucide-react";
import { createRankingAction, updateRankingAction } from "@/actions/ranking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RankingActionState } from "@/lib/validations/ranking";

export type AdminRankingUser = {
  id: string;
  fullName: string;
  branchName: string | null;
  photoUrl: string | null;
};

export type AdminRankingRow = {
  id: string;
  periodLabel: string;
  userId: string | null;
  fullName: string;
  branchName: string | null;
  photoUrl: string | null;
  salesCount: number;
  pendingSales: number;
  rejectedSales: number;
  note: string | null;
  isActive: boolean;
  hasActiveUser: boolean;
  createdAt: string;
  updatedAt: string;
};

type RankingFormProps = {
  mode?: "create" | "edit";
  ranking?: AdminRankingRow;
  users: AdminRankingUser[];
  compact?: boolean;
};

const initialState: RankingActionState = {
  status: "idle",
  message: "",
};

export default function RankingForm({
  compact = false,
  mode = "create",
  ranking,
  users,
}: RankingFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = mode === "create" ? createRankingAction : updateRankingAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [selectedUserId, setSelectedUserId] = useState(ranking?.userId ?? "");
  const [previewFailed, setPreviewFailed] = useState(false);
  const isEdit = mode === "edit";

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId),
    [selectedUserId, users]
  );

  useEffect(() => {
    setPreviewFailed(false);
  }, [selectedUserId]);

  useEffect(() => {
    if (mode === "create" && state.status === "success") {
      formRef.current?.reset();
      setSelectedUserId("");
    }
  }, [mode, state.status]);

  function handleUserChange(value: string) {
    setSelectedUserId(value);
  }

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
            {isEdit ? "Editar registro" : "Registro de ventas"}
          </h2>
          <p className="text-sm text-slate-400">
            {isEdit
              ? "Actualiza resultados, usuario y periodo. El puesto se recalcula solo."
              : "Registra resultados; el puesto se calcula automáticamente."}
          </p>
        </div>
      </div>

      <form ref={formRef} action={formAction} className="grid gap-4 lg:grid-cols-3">
        {isEdit ? <input type="hidden" name="id" value={ranking?.id} /> : null}

        <label className="grid gap-2 text-sm font-semibold text-slate-200 lg:col-span-3">
          Usuario vinculado
          <select
            name="userId"
            value={selectedUserId}
            onChange={(event) => handleUserChange(event.target.value)}
            className="h-10 rounded-md border border-white/10 bg-[#111827]/55 px-2.5 text-sm text-white outline-none transition focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
          >
            <option value="">Selecciona un usuario activo</option>
            {selectedUserId && !selectedUser ? (
              <option value={selectedUserId} disabled>
                Usuario actual no disponible
              </option>
            ) : null}
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName}
              </option>
            ))}
          </select>
          {fieldError(state, "userId") ? (
            <span className="text-xs font-medium text-[#FFB4AC]">
              {fieldError(state, "userId")}
            </span>
          ) : selectedUser ? (
            <span className="text-xs font-medium text-slate-500">
              El ranking usara nombre, sede y foto del usuario seleccionado.
            </span>
          ) : null}
        </label>

        <UserPreview
          fallbackFullName={ranking?.fullName ?? ""}
          fallbackPhotoUrl={ranking?.photoUrl ?? null}
          previewFailed={previewFailed}
          selectedUser={selectedUser}
          onError={() => setPreviewFailed(true)}
        />

        <AdminField
          label="Periodo"
          name="periodLabel"
          defaultValue={ranking?.periodLabel}
          error={fieldError(state, "periodLabel")}
          required
        />
        <AdminField
          label="Ventas concretadas"
          name="salesCount"
          defaultValue={ranking?.salesCount?.toString() ?? "0"}
          error={fieldError(state, "salesCount")}
          type="number"
          min="0"
        />
        <AdminField
          label="Ventas pendientes"
          name="pendingSales"
          defaultValue={ranking?.pendingSales?.toString() ?? "0"}
          error={fieldError(state, "pendingSales")}
          type="number"
          min="0"
        />
        <AdminField
          label="Ventas rechazadas"
          name="rejectedSales"
          defaultValue={ranking?.rejectedSales?.toString() ?? "0"}
          error={fieldError(state, "rejectedSales")}
          type="number"
          min="0"
        />

        <label className="grid gap-2 text-sm font-semibold text-slate-200 lg:col-span-2">
          Nota
          <textarea
            name="note"
            defaultValue={ranking?.note ?? ""}
            rows={3}
            className="min-h-20 rounded-md border border-white/10 bg-[#111827]/55 px-2.5 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#DA291C] focus:ring-2 focus:ring-[#DA291C]/20"
            placeholder="Reconocimiento, comentario o detalle del periodo"
          />
          {fieldError(state, "note") ? (
            <span className="text-xs font-medium text-[#FFB4AC]">
              {fieldError(state, "note")}
            </span>
          ) : null}
        </label>

        <div className="grid content-start gap-3 rounded-lg border border-white/10 bg-[#111827]/55 p-3">
          <p className="text-xs leading-5 text-slate-500">
            Nombre, sede y foto se toman del perfil del usuario activo.
          </p>
          <label className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-slate-200">
            Activo
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={isEdit ? Boolean(ranking?.isActive) : true}
              className="h-4 w-4 accent-[#DA291C]"
            />
          </label>
        </div>

        {state.message ? (
          <p
            aria-live="polite"
            className={
              state.status === "success"
                ? "rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200 lg:col-span-3"
                : "rounded-md border border-[#DA291C]/25 bg-[#DA291C]/12 px-3 py-2 text-sm font-semibold text-[#FFB4AC] lg:col-span-3"
            }
          >
            {state.message}
          </p>
        ) : null}

        <div className="lg:col-span-3">
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
                : "Crear registro"}
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
  min,
  name,
  placeholder,
  required,
  type = "text",
}: {
  defaultValue?: string;
  error?: string;
  label: string;
  min?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-200">
      {label}
      <Input
        name={name}
        type={type}
        min={min}
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

function UserPreview({
  fallbackFullName,
  fallbackPhotoUrl,
  onError,
  previewFailed,
  selectedUser,
}: {
  fallbackFullName: string;
  fallbackPhotoUrl: string | null;
  onError: () => void;
  previewFailed: boolean;
  selectedUser?: AdminRankingUser;
}) {
  const fullName = selectedUser?.fullName ?? fallbackFullName;
  const branchName = selectedUser?.branchName ?? null;
  const photoUrl = selectedUser?.photoUrl ?? fallbackPhotoUrl;

  return (
    <div className="grid gap-3 rounded-lg border border-white/10 bg-[#111827]/55 p-3 lg:col-span-3">
      <PhotoPreview
        fullName={fullName}
        photoUrl={photoUrl ?? ""}
        previewFailed={previewFailed}
        onError={onError}
      />
      <div className="grid gap-1 text-sm text-slate-300">
        <p>
          <span className="font-semibold text-white">Nombre:</span>{" "}
          {fullName || "Selecciona un usuario"}
        </p>
        <p>
          <span className="font-semibold text-white">Sede:</span>{" "}
          {branchName || "Sin sede registrada"}
        </p>
      </div>
    </div>
  );
}

function PhotoPreview({
  fullName,
  onError,
  photoUrl,
  previewFailed,
}: {
  fullName: string;
  onError: () => void;
  photoUrl: string;
  previewFailed: boolean;
}) {
  if (photoUrl && !previewFailed) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={photoUrl}
          alt={fullName || "Preview de asesor"}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10"
          onError={onError}
        />
        <div>
          <p className="text-sm font-semibold text-white">Preview de foto</p>
          <p className="mt-1 max-w-44 truncate text-xs text-slate-500">{photoUrl}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#DA291C] text-sm font-black text-white">
        {fullName ? getInitials(fullName) : <ImageIcon className="h-5 w-5" />}
      </span>
      <div>
        <p className="text-sm font-semibold text-white">Avatar por iniciales</p>
        <p className="mt-1 text-xs text-slate-500">
          La foto viene del perfil del usuario.
        </p>
      </div>
    </div>
  );
}

function fieldError(state: RankingActionState, field: string) {
  return state.errors?.[field]?.[0];
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
