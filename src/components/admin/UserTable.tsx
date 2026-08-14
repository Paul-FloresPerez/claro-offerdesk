"use client";

import { useActionState, useState } from "react";
import type { ReactNode } from "react";
import {
  ExternalLink,
  KeyRound,
  Pencil,
  Plus,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  resetUserPasswordAction,
  setUserStatusAction,
} from "@/actions/users";
import UserForm, {
  type AdminUserRow,
  type BranchOption,
} from "@/components/admin/UserForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { USER_ROLE_LABELS } from "@/lib/roles";
import type { UserActionState } from "@/lib/validations/user";

type UserTableProps = {
  users: AdminUserRow[];
  branches: BranchOption[];
  currentUserId: string;
};

const initialState: UserActionState = {
  status: "idle",
  message: "",
};

export default function UserTable({
  branches,
  currentUserId,
  users,
}: UserTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserRow | null>(null);

  function openCreateDialog() {
    setSelectedUser(null);
    setDialogOpen(true);
  }

  function openEditDialog(user: AdminUserRow) {
    setSelectedUser(user);
    setDialogOpen(true);
  }

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Usuarios
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona accesos, rol, sede y estado. No se eliminan usuarios.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-md border border-border bg-background/55 px-3 py-2 text-xs font-semibold text-muted-foreground">
            {users.length} usuario{users.length === 1 ? "" : "s"}
          </span>
          <Button
            type="button"
            onClick={openCreateDialog}
            className="h-9 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus />
            Nuevo usuario
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="bg-background text-xs uppercase tracking-[0.12em] text-muted-foreground">
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
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                isCurrentUser={user.id === currentUserId}
                onEdit={() => openEditDialog(user)}
              />
            ))}
            {users.length === 0 ? (
              <tr>
                <td className="px-5 py-6 text-muted-foreground" colSpan={7}>
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          key={selectedUser?.id ?? "new-user"}
          className="max-h-[90vh] overflow-y-auto border border-border bg-header text-foreground sm:max-w-3xl"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedUser ? "Editar usuario" : "Nuevo usuario"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedUser
                ? "Actualiza sus datos, rol, sede y estado de acceso."
                : "Crea un acceso con rol, sede y password temporal."}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            mode={selectedUser ? "edit" : "create"}
            user={selectedUser ?? undefined}
            branches={branches}
            onSuccess={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}

function UserRow({
  isCurrentUser,
  onEdit,
  user,
}: {
  isCurrentUser: boolean;
  onEdit: () => void;
  user: AdminUserRow;
}) {
  return (
    <tr className="align-top text-muted-foreground">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} />
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{user.fullName}</p>
            <p className="mt-1 text-xs text-muted-foreground">@{user.username}</p>
            {user.photoUrl ? (
              <a
                href={user.photoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-emphasis underline-offset-4 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Abrir foto
              </a>
            ) : null}
            {isCurrentUser ? (
              <span className="mt-2 block w-fit rounded-md border border-primary/25 bg-primary/12 px-2 py-1 text-[11px] font-semibold text-brand-emphasis">
                Tu cuenta
              </span>
            ) : null}
          </div>
        </div>
      </td>
      <td className="px-5 py-4">{user.dni ?? "-"}</td>
      <td className="px-5 py-4">{user.email}</td>
      <td className="px-5 py-4">
        <p>
          {user.role === "ADMIN"
            ? "Alcance global"
            : user.branch?.name ?? user.branchName ?? "Sin sede"}
        </p>
        {user.branch && !user.branch.isActive ? (
          <span className="mt-1 block text-xs text-amber-800 dark:text-amber-200">Sede inactiva</span>
        ) : null}
      </td>
      <td className="px-5 py-4">
        <StatusPill tone={user.role === "ADMIN" ? "admin" : "neutral"}>
          {USER_ROLE_LABELS[user.role]}
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Pencil />
              Editar
            </Button>
            <StatusAction user={user} isCurrentUser={isCurrentUser} />
          </div>
          <ResetPasswordForm user={user} />
        </div>
      </td>
    </tr>
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
        variant="outline"
        size="sm"
        disabled={isPending || (isCurrentUser && !nextActiveState)}
        className="border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        {nextActiveState ? <UserCheck /> : <UserX />}
        {nextActiveState ? "Activar" : "Desactivar"}
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
          className="h-8 border-border bg-background/60 text-xs text-foreground placeholder:text-muted-foreground"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="h-8 border border-primary/30 bg-primary/12 px-2 text-xs text-brand-emphasis hover:bg-primary/18"
        >
          <KeyRound />
          Reset
        </Button>
      </div>
      <ActionMessage state={state} />
    </form>
  );
}

function ActionMessage({ state }: { state: UserActionState }) {
  if (!state.message) return null;

  return (
    <p
      aria-live="polite"
      className={
        state.status === "success"
          ? "text-xs font-semibold text-emerald-700 dark:text-emerald-200"
          : "text-xs font-semibold text-brand-emphasis"
      }
    >
      {state.message}
    </p>
  );
}

function UserAvatar({ user }: { user: AdminUserRow }) {
  const [failed, setFailed] = useState(false);

  if (user.photoUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.photoUrl}
        alt={user.fullName}
        className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground">
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
    active: "border-emerald-400/20 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
    admin: "border-primary/30 bg-primary/12 text-brand-emphasis",
    inactive: "border-slate-500/20 bg-muted0/10 text-muted-foreground",
    neutral: "border-border bg-card text-muted-foreground",
    warning: "border-yellow-300/20 bg-yellow-300/10 text-yellow-800 dark:text-yellow-100",
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
