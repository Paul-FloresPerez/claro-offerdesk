"use client";

import { useActionState, useEffect, useRef } from "react";
import { Building2, Save } from "lucide-react";
import {
  createBranchAction,
  updateBranchAction,
} from "@/actions/branches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BranchActionState } from "@/lib/validations/branch";

export type AdminBranchRow = {
  id: string;
  name: string;
  city: string;
  isActive: boolean;
  advisorCount: number;
  supervisorCount: number;
  createdAt: string;
  updatedAt: string;
};

const initialState: BranchActionState = {
  status: "idle",
  message: "",
};

export default function BranchForm({
  branch,
  onSuccess,
}: {
  branch?: AdminBranchRow;
  onSuccess?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = branch ? updateBranchAction : createBranchAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    if (!branch) {
      formRef.current?.reset();
    }

    onSuccess?.();
  }, [branch, onSuccess, state.status]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4">
      {branch ? <input type="hidden" name="id" value={branch.id} /> : null}

      <BranchField
        label="Nombre de la sede"
        name="name"
        defaultValue={branch?.name}
        error={fieldError(state, "name")}
        placeholder="Ej. Lima Centro"
      />
      <BranchField
        label="Ciudad"
        name="city"
        defaultValue={branch?.city}
        error={fieldError(state, "city")}
        placeholder="Ej. Lima"
      />

      {state.message ? (
        <p
          aria-live="polite"
          className={
            state.status === "success"
              ? "rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200"
              : "rounded-md border border-[#DA291C]/25 bg-[#DA291C]/12 px-3 py-2 text-sm font-semibold text-[#FFB4AC]"
          }
        >
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="h-10 justify-center bg-[#DA291C] text-white hover:bg-[#B91F15]"
      >
        {branch ? <Save /> : <Building2 />}
        {isPending
          ? "Guardando..."
          : branch
            ? "Guardar cambios"
            : "Crear sede"}
      </Button>
    </form>
  );
}

function BranchField({
  defaultValue,
  error,
  label,
  name,
  placeholder,
}: {
  defaultValue?: string;
  error?: string;
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-200">
      {label}
      <Input
        name={name}
        required
        maxLength={120}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="h-10 border-white/10 bg-[#111827]/70 text-white placeholder:text-slate-500"
      />
      {error ? (
        <span className="text-xs font-medium text-[#FFB4AC]">{error}</span>
      ) : null}
    </label>
  );
}

function fieldError(state: BranchActionState, field: string) {
  return state.errors?.[field]?.[0];
}
