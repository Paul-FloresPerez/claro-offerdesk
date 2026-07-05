"use client";

import { useActionState, useEffect, useRef } from "react";
import { ImageIcon, Save, ShieldCheck, UserPlus } from "lucide-react";
import { createUserAction, updateUserAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserActionState } from "@/lib/validations/user";

export type AdminUserRow = {
  id: string;
  fullName: string;
  username: string;
  dni: string | null;
  email: string;
  branchName: string | null;
  photoUrl: string | null;
  isAdmin: boolean;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
};

type UserFormProps = {
  mode?: "create" | "edit";
  user?: AdminUserRow;
  compact?: boolean;
};

const initialState: UserActionState = {
  status: "idle",
  message: "",
};

export default function UserForm({
  compact = false,
  mode = "create",
  user,
}: UserFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = mode === "create" ? createUserAction : updateUserAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const isEdit = mode === "edit";

  useEffect(() => {
    if (mode === "create" && state.status === "success") {
      formRef.current?.reset();
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
          {isEdit ? (
            <ShieldCheck className="h-5 w-5" />
          ) : (
            <UserPlus className="h-5 w-5" />
          )}
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {isEdit ? "Editar usuario" : "Nuevo usuario"}
          </h2>
          <p className="text-sm text-slate-400">
            {isEdit
              ? "Actualiza datos, estado y permisos del asesor."
              : "Crea el acceso interno con password temporal."}
          </p>
        </div>
      </div>

      <form
        ref={formRef}
        action={formAction}
        encType="multipart/form-data"
        className="grid gap-4 sm:grid-cols-2"
      >
        {isEdit ? <input type="hidden" name="id" value={user?.id} /> : null}

        <AdminField
          label="Nombre completo"
          name="fullName"
          defaultValue={user?.fullName}
          error={fieldError(state, "fullName")}
          required
        />
        <AdminField
          label="Usuario"
          name="username"
          defaultValue={user?.username}
          error={fieldError(state, "username")}
          placeholder="usuario.apellido"
          required
        />
        <AdminField
          label="DNI"
          name="dni"
          defaultValue={user?.dni ?? ""}
          error={fieldError(state, "dni")}
          required
        />
        <AdminField
          label="Correo (recuperacion)"
          name="email"
          defaultValue={user?.email}
          error={fieldError(state, "email")}
          type="email"
          required
        />
        <AdminField
          label="Sede"
          name="branchName"
          defaultValue={user?.branchName ?? ""}
          error={fieldError(state, "branchName")}
          placeholder="Sede comercial"
        />
        <PhotoUploadField
          currentFullName={user?.fullName ?? ""}
          currentPhotoUrl={user?.photoUrl ?? null}
          fileError={fieldError(state, "photoFile")}
          urlError={fieldError(state, "photoUrl")}
        />

        {isEdit ? null : (
          <AdminField
            label="Password temporal"
            name="password"
            error={fieldError(state, "password")}
            type="password"
            autoComplete="new-password"
            required
          />
        )}

        <div className="grid content-end gap-3 rounded-lg border border-white/10 bg-[#111827]/55 p-3 sm:grid-cols-2">
          <ToggleField
            label="Admin"
            name="isAdmin"
            defaultChecked={Boolean(user?.isAdmin)}
          />
          <ToggleField
            label="Activo"
            name="isActive"
            defaultChecked={isEdit ? Boolean(user?.isActive) : true}
          />
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
                : "Crear usuario"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function PhotoUploadField({
  currentFullName,
  currentPhotoUrl,
  fileError,
  urlError,
}: {
  currentFullName: string;
  currentPhotoUrl: string | null;
  fileError?: string;
  urlError?: string;
}) {
  return (
    <div className="grid gap-2 text-sm font-semibold text-slate-200">
      <span>Foto de usuario</span>
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#111827]/55 p-3">
        {currentPhotoUrl ? (
          <img
            src={currentPhotoUrl}
            alt={currentFullName || "Foto actual"}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
          />
        ) : (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#DA291C] text-sm font-black text-white">
            {currentFullName ? getInitials(currentFullName) : <ImageIcon className="h-5 w-5" />}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <Input
            name="photoFile"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-invalid={Boolean(fileError)}
            className="h-10 border-white/10 bg-[#111827]/55 text-white file:text-white"
          />
          <p className="mt-1 text-xs leading-5 text-slate-500">
            JPG, JPEG, PNG o WEBP. Maximo 2 MB. Si Blob esta configurado, se sube automaticamente.
          </p>
        </div>
      </div>
      {fileError ? (
        <span className="text-xs font-medium text-[#FFB4AC]">{fileError}</span>
      ) : null}
      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        PhotoUrl manual
        <Input
          name="photoUrl"
          defaultValue={currentPhotoUrl ?? ""}
          placeholder="/usuarios/foto.jpg o https://..."
          aria-invalid={Boolean(urlError)}
          className="h-10 border-white/10 bg-[#111827]/55 text-white placeholder:text-slate-500"
        />
        <span className="text-xs font-medium text-slate-500">
          Respaldo para cuando Vercel Blob aun no tenga token configurado.
        </span>
        {urlError ? (
          <span className="text-xs font-medium text-[#FFB4AC]">{urlError}</span>
        ) : null}
      </label>
    </div>
  );
}

function AdminField({
  autoComplete,
  defaultValue,
  error,
  label,
  name,
  placeholder,
  required,
  type = "text",
}: {
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  label: string;
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
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className="h-10 border-white/10 bg-[#111827]/55 text-white placeholder:text-slate-500"
      />
      {error ? <span className="text-xs font-medium text-[#FFB4AC]">{error}</span> : null}
    </label>
  );
}

function ToggleField({
  defaultChecked,
  label,
  name,
}: {
  defaultChecked: boolean;
  label: string;
  name: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-slate-200">
      {label}
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[#DA291C]"
      />
    </label>
  );
}

function fieldError(state: UserActionState, field: string) {
  return state.errors?.[field]?.[0];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
