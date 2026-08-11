"use client";

import { useActionState, useEffect, useState } from "react";
import { ExternalLink, ImageIcon, Save } from "lucide-react";
import { createUserAction, updateUserAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  USER_ROLE_LABELS,
  USER_ROLE_VALUES,
  type UserRoleValue,
} from "@/lib/roles";
import type { UserActionState } from "@/lib/validations/user";

export type AdminUserRow = {
  id: string;
  fullName: string;
  username: string;
  dni: string | null;
  email: string;
  branchName: string | null;
  branchId: string | null;
  branch: {
    id: string;
    name: string;
    isActive: boolean;
  } | null;
  role: UserRoleValue;
  photoUrl: string | null;
  isAdmin: boolean;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BranchOption = {
  id: string;
  name: string;
  city: string;
  isActive: boolean;
};

const initialState: UserActionState = {
  status: "idle",
  message: "",
};

export default function UserForm({
  branches,
  mode = "create",
  onSuccess,
  user,
}: {
  branches: BranchOption[];
  mode?: "create" | "edit";
  onSuccess?: () => void;
  user?: AdminUserRow;
}) {
  const action = mode === "create" ? createUserAction : updateUserAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl ?? "");
  const [role, setRole] = useState<UserRoleValue>(user?.role ?? "ADVISOR");
  const isEdit = mode === "edit";
  const availableBranches = branches.filter(
    (branch) => branch.isActive || branch.id === user?.branchId
  );
  const keepsLegacyBranchlessAdvisor =
    isEdit && user?.role === "ADVISOR" && !user.branchId;

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    onSuccess?.();
  }, [isEdit, onSuccess, state.status]);

  return (
    <form
      action={formAction}
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
        label="Correo (recuperación)"
        name="email"
        defaultValue={user?.email}
        error={fieldError(state, "email")}
        type="email"
        required
      />

      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        Rol
        <select
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value as UserRoleValue)}
          className="h-10 rounded-md border border-white/10 bg-[#111827]/70 px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C]/60"
        >
          {USER_ROLE_VALUES.map((value) => (
            <option key={value} value={value}>
              {USER_ROLE_LABELS[value]}
            </option>
          ))}
        </select>
        {fieldError(state, "role") ? (
          <span className="text-xs font-medium text-[#FFB4AC]">
            {fieldError(state, "role")}
          </span>
        ) : null}
      </label>

      {role === "ADMIN" ? (
        <div className="grid content-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-400">
          <input type="hidden" name="branchId" value="" />
          <span className="font-semibold text-slate-200">Sede</span>
          <span>El administrador tiene alcance global.</span>
        </div>
      ) : (
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Sede
          <select
            name="branchId"
            defaultValue={user?.branchId ?? ""}
            required={role === "SUPERVISOR" || !keepsLegacyBranchlessAdvisor}
            className="h-10 rounded-md border border-white/10 bg-[#111827]/70 px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C]/60"
          >
            <option value="">
              {keepsLegacyBranchlessAdvisor
                ? "Sin sede (registro legacy)"
                : "Selecciona una sede"}
            </option>
            {availableBranches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} - {branch.city}
                {branch.isActive ? "" : " (inactiva)"}
              </option>
            ))}
          </select>
          {fieldError(state, "branchId") ? (
            <span className="text-xs font-medium text-[#FFB4AC]">
              {fieldError(state, "branchId")}
            </span>
          ) : null}
        </label>
      )}

      <PhotoUploadField
        currentFullName={user?.fullName ?? ""}
        currentPhotoUrl={photoUrl}
        onPhotoUrlChange={setPhotoUrl}
        urlError={fieldError(state, "photoUrl")}
      />

      {isEdit ? null : (
        <AdminField
          label="Contraseña temporal"
          name="password"
          error={fieldError(state, "password")}
          type="password"
          autoComplete="new-password"
          required
        />
      )}

      <div className="grid content-end gap-3 rounded-lg border border-white/10 bg-[#111827]/55 p-3">
        <ToggleField
          label="Cuenta activa"
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
          <Save />
          {isPending
            ? "Guardando..."
            : isEdit
              ? "Guardar cambios"
              : "Crear usuario"}
        </Button>
      </div>
    </form>
  );
}

function PhotoUploadField({
  currentFullName,
  currentPhotoUrl,
  onPhotoUrlChange,
  urlError,
}: {
  currentFullName: string;
  currentPhotoUrl: string;
  onPhotoUrlChange: (value: string) => void;
  urlError?: string;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const imageFailed = failedUrl === currentPhotoUrl;
  const initials = currentFullName ? getInitials(currentFullName) : null;

  return (
    <div className="grid gap-2 text-sm font-semibold text-slate-200 sm:col-span-2">
      <span>URL de foto</span>
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#111827]/55 p-3">
        {currentPhotoUrl && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentPhotoUrl}
            alt={currentFullName || "Foto actual"}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
            onError={() => setFailedUrl(currentPhotoUrl)}
          />
        ) : (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#DA291C] text-sm font-black text-white">
            {initials ?? <ImageIcon className="h-5 w-5" />}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <Input
            name="photoUrl"
            value={currentPhotoUrl}
            onChange={(event) => onPhotoUrlChange(event.target.value)}
            placeholder="Pega la URL publica de Vercel Blob"
            aria-invalid={Boolean(urlError)}
            className="h-10 border-white/10 bg-[#111827]/55 text-white placeholder:text-slate-500"
          />
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Acepta https://... o /usuarios/archivo.jpg como fallback legacy.
          </p>
        </div>
      </div>
      {currentPhotoUrl ? (
        <a
          href={currentPhotoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-[#FFB4AC] underline-offset-4 hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Abrir foto
        </a>
      ) : null}
      {urlError ? (
        <span className="text-xs font-medium text-[#FFB4AC]">{urlError}</span>
      ) : null}
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
      {error ? (
        <span className="text-xs font-medium text-[#FFB4AC]">{error}</span>
      ) : null}
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
