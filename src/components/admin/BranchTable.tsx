"use client";

import { useActionState, useState } from "react";
import { Building2, MapPin, Pencil, Plus, Power, PowerOff } from "lucide-react";
import { setBranchStatusAction } from "@/actions/branches";
import BranchForm, {
  type AdminBranchRow,
} from "@/components/admin/BranchForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BranchActionState } from "@/lib/validations/branch";

const initialState: BranchActionState = {
  status: "idle",
  message: "",
};

export default function BranchTable({ branches }: { branches: AdminBranchRow[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<AdminBranchRow | null>(null);

  function openCreateDialog() {
    setSelectedBranch(null);
    setDialogOpen(true);
  }

  function openEditDialog(branch: AdminBranchRow) {
    setSelectedBranch(branch);
    setDialogOpen(true);
  }

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.07]">
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">Sedes</h2>
          <p className="mt-1 text-sm text-slate-400">
            Crea, edita o desactiva sedes. No se eliminan registros.
          </p>
        </div>
        <Button
          type="button"
          onClick={openCreateDialog}
          className="h-9 bg-[#DA291C] text-white hover:bg-[#B91F15]"
        >
          <Plus />
          Nueva sede
        </Button>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {branches.map((branch) => (
          <article
            key={branch.id}
            className="rounded-lg border border-white/10 bg-[#111827]/55 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC]">
                <Building2 className="h-5 w-5" />
              </span>
              <StatusPill active={branch.isActive} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{branch.name}</h3>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="h-4 w-4" />
              {branch.city}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                <dt className="text-xs text-slate-500">Asesores</dt>
                <dd className="mt-1 font-semibold text-white">{branch.advisorCount}</dd>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                <dt className="text-xs text-slate-500">Supervisores</dt>
                <dd className="mt-1 font-semibold text-white">
                  {branch.supervisorCount}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openEditDialog(branch)}
                className="border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] hover:text-white"
              >
                <Pencil />
                Editar
              </Button>
              <BranchStatusAction branch={branch} />
            </div>
          </article>
        ))}

        {branches.length === 0 ? (
          <p className="p-2 text-sm text-slate-300 sm:col-span-2 xl:col-span-3">
            Aun no hay sedes registradas.
          </p>
        ) : null}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          key={selectedBranch?.id ?? "new-branch"}
          className="border border-white/10 bg-[#0B1120] text-white sm:max-w-lg"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedBranch ? "Editar sede" : "Nueva sede"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedBranch
                ? "Actualiza el nombre o la ciudad de la sede."
                : "Registra una sede para asignar supervisores y asesores."}
            </DialogDescription>
          </DialogHeader>
          <BranchForm
            branch={selectedBranch ?? undefined}
            onSuccess={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}

function BranchStatusAction({ branch }: { branch: AdminBranchRow }) {
  const [state, formAction, isPending] = useActionState(
    setBranchStatusAction,
    initialState
  );
  const nextActiveState = !branch.isActive;

  return (
    <form action={formAction} className="grid gap-1">
      <input type="hidden" name="id" value={branch.id} />
      <input type="hidden" name="isActive" value={String(nextActiveState)} />
      <Button
        type="submit"
        variant="outline"
        size="sm"
        disabled={isPending}
        className="border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] hover:text-white"
      >
        {nextActiveState ? <Power /> : <PowerOff />}
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

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={
        active
          ? "inline-flex h-7 items-center rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2.5 text-xs font-semibold text-emerald-200"
          : "inline-flex h-7 items-center rounded-md border border-slate-500/20 bg-slate-500/10 px-2.5 text-xs font-semibold text-slate-300"
      }
    >
      {active ? "Activa" : "Inactiva"}
    </span>
  );
}
