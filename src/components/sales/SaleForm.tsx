"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSaleAction, updateSaleAction } from "@/actions/sales";
import type {
  AdvisorOption,
  EditableSaleRow,
} from "@/components/sales/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SALE_STATUS_LABELS,
  SALE_STATUS_VALUES,
  type SaleStatusValue,
} from "@/lib/sale-status";
import type { SaleActionState } from "@/lib/validations/sale";

const initialState: SaleActionState = {
  status: "idle",
  message: "",
};

export default function SaleForm({
  advisors,
  defaultSaleDate,
  onSuccess,
  sale,
}: {
  advisors: AdvisorOption[];
  defaultSaleDate: string;
  onSuccess: () => void;
  sale?: EditableSaleRow;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const action = sale ? updateSaleAction : createSaleAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [status, setStatus] = useState<SaleStatusValue>(
    sale?.status ?? "PENDIENTE"
  );
  const currentAdvisorIsAvailable = advisors.some(
    (advisor) => advisor.id === sale?.advisorId
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    if (!sale) {
      formRef.current?.reset();
    }

    router.refresh();
    onSuccess();
  }, [onSuccess, router, sale, state.status]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 sm:grid-cols-2">
      {sale ? <input type="hidden" name="id" value={sale.id} /> : null}

      <label className="grid gap-2 text-sm font-semibold text-muted-foreground sm:col-span-2">
        Asesor *
        <select
          name="advisorId"
          defaultValue={sale?.advisorId ?? ""}
          required
          aria-invalid={Boolean(fieldError(state, "advisorId"))}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/60 aria-invalid:border-primary"
        >
          <option value="">Selecciona un asesor</option>
          {sale && !currentAdvisorIsAvailable ? (
            <option value={sale.advisorId}>
              {sale.advisorName} · asignación histórica
            </option>
          ) : null}
          {advisors.map((advisor) => (
            <option key={advisor.id} value={advisor.id}>
              {advisor.fullName} · {advisor.branchName}
            </option>
          ))}
        </select>
        <FieldError message={fieldError(state, "advisorId")} />
      </label>

      <SaleField
        label="Cliente *"
        name="customerName"
        defaultValue={sale?.customerName}
        error={fieldError(state, "customerName")}
        maxLength={160}
        autoComplete="name"
        required
      />
      <SaleField
        label="DNI *"
        name="customerDni"
        defaultValue={sale?.customerDni}
        error={fieldError(state, "customerDni")}
        maxLength={20}
        inputMode="text"
        required
      />
      <SaleField
        label="Teléfono *"
        name="customerPhone"
        defaultValue={sale?.customerPhone}
        error={fieldError(state, "customerPhone")}
        maxLength={30}
        inputMode="tel"
        autoComplete="tel"
        required
      />
      <SaleField
        label="Correo"
        name="customerEmail"
        defaultValue={sale?.customerEmail ?? ""}
        error={fieldError(state, "customerEmail")}
        maxLength={160}
        type="email"
        autoComplete="email"
      />

      <label className="grid gap-2 text-sm font-semibold text-muted-foreground sm:col-span-2">
        Dirección
        <textarea
          name="customerAddress"
          defaultValue={sale?.customerAddress ?? ""}
          maxLength={240}
          rows={2}
          autoComplete="street-address"
          aria-invalid={Boolean(fieldError(state, "customerAddress"))}
          className="min-h-20 resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/60 aria-invalid:border-primary"
        />
        <FieldError message={fieldError(state, "customerAddress")} />
      </label>

      <SaleField
        label="Servicio *"
        name="service"
        defaultValue={sale?.service}
        error={fieldError(state, "service")}
        maxLength={120}
        placeholder="Ej. Internet HFC"
        required
      />
      <SaleField
        label="Plan"
        name="planName"
        defaultValue={sale?.planName ?? ""}
        error={fieldError(state, "planName")}
        maxLength={160}
        placeholder="Nombre comercial del plan"
      />
      <SaleField
        label="Fecha de venta *"
        name="saleDate"
        defaultValue={sale?.saleDate ?? defaultSaleDate}
        error={fieldError(state, "saleDate")}
        type="date"
        required
      />

      <label className="grid gap-2 text-sm font-semibold text-muted-foreground">
        Estado *
        <select
          name="status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as SaleStatusValue)
          }
          aria-invalid={Boolean(fieldError(state, "status"))}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/60 aria-invalid:border-primary"
        >
          {SALE_STATUS_VALUES.map((value) => (
            <option key={value} value={value}>
              {SALE_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
        <FieldError message={fieldError(state, "status")} />
      </label>

      {status === "RECHAZADA" ? (
        <label className="grid gap-2 text-sm font-semibold text-muted-foreground sm:col-span-2">
          Motivo de rechazo *
          <textarea
            name="rejectionReason"
            defaultValue={sale?.rejectionReason ?? ""}
            maxLength={300}
            rows={3}
            required
            aria-invalid={Boolean(fieldError(state, "rejectionReason"))}
            className="min-h-24 resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/60 aria-invalid:border-primary"
            placeholder="Describe por qué fue rechazada"
          />
          <FieldError message={fieldError(state, "rejectionReason")} />
        </label>
      ) : null}

      {state.message ? (
        <p
          aria-live="polite"
          className={
            state.status === "success"
              ? "rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-200 sm:col-span-2"
              : "rounded-md border border-primary/25 bg-primary/12 px-3 py-2 text-sm font-semibold text-brand-emphasis sm:col-span-2"
          }
        >
          {state.message}
        </p>
      ) : null}

      <div className="sm:col-span-2 sm:flex sm:justify-end">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : (
            <Save data-icon="inline-start" />
          )}
          {isPending
            ? "Guardando..."
            : sale
              ? "Guardar cambios"
              : "Registrar venta"}
        </Button>
      </div>
    </form>
  );
}

function SaleField({
  autoComplete,
  defaultValue,
  error,
  inputMode,
  label,
  maxLength,
  name,
  placeholder,
  required,
  type = "text",
}: {
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  inputMode?: "text" | "tel";
  label: string;
  maxLength?: number;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-muted-foreground">
      {label}
      <Input
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        inputMode={inputMode}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className="h-10 border-border bg-background text-foreground placeholder:text-muted-foreground"
      />
      <FieldError message={error} />
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <span className="text-xs font-medium text-brand-emphasis">{message}</span>
  ) : null;
}

function fieldError(state: SaleActionState, field: string) {
  return state.errors?.[field]?.[0];
}
