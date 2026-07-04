"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import { KeyRound, Shield, ShieldOff, UserCheck, UserX } from "lucide-react";
import {
  resetUserPasswordAction,
  setUserRoleAction,
  setUserStatusAction,
} from "@/actions/users";
import UserForm, { type AdminUserRow } from "@/components/admin/UserForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserActionState } from "@/lib/validations/user";

type UserTableProps = {
  users: AdminUserRow[];
  currentUserId: string;
};

const initialState: UserActionState = {
  status: "idle",
  message: "",
};

export default function UserTable({ currentUserId, users }: UserTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.07]">
      <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Usuarios
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Gestiona accesos, roles y estado de cuenta. No se eliminan usuarios.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-md border border-white/10 bg-[#111827]/55 px-3 py-2 text-xs font-semibold text-slate-300">
          {users.length} usuario{users.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-[#111827]/70 text-xs uppercase tracking-[0.12em] text-slate-400">
            <tr>
              <th className="px-5 py-3">Usuario</th>
              <th className="px-5 py-3">DNI</th>
              <th className="px-5 py-3">Correo</th>
              <th className="px-5 py-3">Sede</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                isCurrentUser={user.id === currentUserId}
              />
            ))}
            {users.length === 0 ? (
              <tr>
                <td className="px-5 py-6 text-slate-300" colSpan={7}>
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function UserRow({
  isCurrentUser,
  user,
}: {
  isCurrentUser: boolean;
  user: AdminUserRow;
}) {
  return (
    <>
      <tr className="align-top text-slate-200">
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} />
            <div className="min-w-0">
              <p className="font-semibold text-white">{user.fullName}</p>
              <p className="mt-1 text-xs text-slate-500">@{user.username}</p>
              {isCurrentUser ? (
                <span className="mt-2 inline-flex rounded-md border border-[#DA291C]/25 bg-[#DA291C]/12 px-2 py-1 text-[11px] font-semibold text-[#FFB4AC]">
                  Tu cuenta
                </span>
              ) : null}
            </div>
          </div>
        </td>
        <td className="px-5 py-4">{user.dni ?? "-"}</td>
        <td className="px-5 py-4">{user.email}</td>
        <td className="px-5 py-4">{user.branchName ?? "-"}</td>
        <td className="px-5 py-4">
          <StatusPill tone={user.isAdmin ? "admin" : "neutral"}>
            {user.isAdmin ? "Admin" : "Asesor"}
          </StatusPill>
        </td>
        <td className="px-5 py-4">
          <div className="grid gap-2">
            <StatusPill tone={user.isActive ? "active" : "inactive"}>
              {user.isActive ? "Activo" : "Inactivo"}
            </StatusPill>
            {user.mustChangePassword ? (
              <StatusPill tone="warning">Cambio pendiente</StatusPill>
            ) : null}
          </div>
        </td>
        <td className="px-5 py-4">
          <div className="grid gap-2">
            <div className="flex flex-wrap gap-2">
              <StatusAction user={user} isCurrentUser={isCurrentUser} />
              <RoleAction user={user} isCurrentUser={isCurrentUser} />
            </div>
            <ResetPasswordForm user={user} />
          </div>
        </td>
      </tr>
      <tr className="bg-[#111827]/35">
        <td colSpan={7} className="px-5 pb-5">
          <details className="rounded-lg border border-white/10 bg-white/[0.035]">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[#FFB4AC] transition hover:text-white">
              Editar datos del usuario
            </summary>
            <div className="border-t border-white/10 p-4">
              <UserForm mode="edit" user={user} compact />
            </div>
          </details>
        </td>
      </tr>
    </>
  );
}

function StatusAction({
  isCurrentUser,
  user,
}: {
  isCurrentUser: boolean;
  user: AdminUserRow;
}) {
  const [state, formAction, isPending] = useActionState(
    setUserStatusAction,
    initialState
  );
  const nextActiveState = !user.isActive;

  return (
    <form action={formAction} className="grid gap-1">
      <input type="hidden" name="id" value={user.id} />
      <input type="hidden" name="isActive" value={String(nextActiveState)} />
      <Button
        type="submit"
        disabled={isPending || (isCurrentUser && !nextActiveState)}
        className="h-8 border border-white/10 bg-white/[0.06] px-2 text-xs text-slate-200 hover:bg-white/[0.1]"
      >
        {nextActiveState ? (
          <UserCheck className="h-3.5 w-3.5" />
        ) : (
          <UserX className="h-3.5 w-3.5" />
        )}
        {nextActiveState ? "Activar" : "Desactivar"}
      </Button>
      <ActionMessage state={state} />
    </form>
  );
}

function RoleAction({
  isCurrentUser,
  user,
}: {
  isCurrentUser: boolean;
  user: AdminUserRow;
}) {
  const [state, formAction, isPending] = useActionState(
    setUserRoleAction,
    initialState
  );
  const nextAdminState = !user.isAdmin;

  return (
    <form action={formAction} className="grid gap-1">
      <input type="hidden" name="id" value={user.id} />
      <input type="hidden" name="isAdmin" value={String(nextAdminState)} />
      <Button
        type="submit"
        disabled={isPending || (isCurrentUser && !nextAdminState)}
        className="h-8 border border-white/10 bg-white/[0.06] px-2 text-xs text-slate-200 hover:bg-white/[0.1]"
      >
        {nextAdminState ? (
          <Shield className="h-3.5 w-3.5" />
        ) : (
          <ShieldOff className="h-3.5 w-3.5" />
        )}
        {nextAdminState ? "Hacer admin" : "Hacer asesor"}
      </Button>
      <ActionMessage state={state} />
    </form>
  );
}

function ResetPasswordForm({ user }: { user: AdminUserRow }) {
  const [state, formAction, isPending] = useActionState(
    resetUserPasswordAction,
    initialState
  );

  return (
    <form action={formAction} className="grid max-w-xs gap-2">
      <input type="hidden" name="id" value={user.id} />
      <div className="flex gap-2">
        <Input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Nueva password"
          autoComplete="new-password"
          className="h-8 border-white/10 bg-[#111827]/60 text-xs text-white placeholder:text-slate-500"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="h-8 border border-[#DA291C]/30 bg-[#DA291C]/12 px-2 text-xs text-[#FFB4AC] hover:bg-[#DA291C]/18"
        >
          <KeyRound className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>
      <ActionMessage state={state} />
    </form>
  );
}

function ActionMessage({ state }: { state: UserActionState }) {
  if (!state.message) {
    return null;
  }

  return (
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
  );
}

function UserAvatar({ user }: { user: AdminUserRow }) {
  if (user.photoUrl) {
    return (
      <img
        src={user.photoUrl}
        alt={user.fullName}
        className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10"
      />
    );
  }

  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#DA291C] text-sm font-black text-white">
      {getInitials(user.fullName)}
    </span>
  );
}

function StatusPill({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "active" | "admin" | "inactive" | "neutral" | "warning";
}) {
  const className = {
    active: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    admin: "border-[#DA291C]/30 bg-[#DA291C]/12 text-[#FFB4AC]",
    inactive: "border-slate-500/20 bg-slate-500/10 text-slate-300",
    neutral: "border-white/10 bg-white/[0.06] text-slate-300",
    warning: "border-yellow-300/20 bg-yellow-300/10 text-yellow-100",
  }[tone];

  return (
    <span
      className={`inline-flex h-7 w-fit items-center rounded-md border px-2.5 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
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
