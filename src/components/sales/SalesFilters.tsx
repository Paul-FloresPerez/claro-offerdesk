import { RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import type {
  AdvisorOption,
  BranchFilterOption,
} from "@/components/sales/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SALE_STATUS_LABELS,
  SALE_STATUS_VALUES,
  type SaleStatusValue,
} from "@/lib/sale-status";
import { cn } from "@/lib/utils";

export type SalesFilterValues = {
  dni: string;
  advisorId: string;
  branchId: string;
  status: SaleStatusValue | "";
};

export default function SalesFilters({
  advisors,
  basePath,
  branches = [],
  values,
}: {
  advisors: AdvisorOption[];
  basePath: string;
  branches?: BranchFilterOption[];
  values: SalesFilterValues;
}) {
  const selectClassName =
    "h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

  return (
    <form
      method="get"
      className={cn(
        "grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2",
        branches.length > 0
          ? "xl:grid-cols-[1.2fr_1fr_1fr_1fr_auto]"
          : "xl:grid-cols-[1.2fr_1fr_1fr_auto]"
      )}
    >
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        DNI cliente
        <Input
          name="dni"
          defaultValue={values.dni}
          placeholder="Buscar DNI"
          maxLength={20}
          className="h-10 border-border bg-background text-foreground placeholder:text-muted-foreground"
        />
      </label>

      {branches.length > 0 ? (
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Sede
          <select
            name="branchId"
            defaultValue={values.branchId}
            className={selectClassName}
          >
            <option value="">Todas las sedes</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        Asesor
        <select
          name="advisorId"
          defaultValue={values.advisorId}
          className={selectClassName}
        >
          <option value="">Todos los asesores</option>
          {advisors.map((advisor) => (
            <option key={advisor.id} value={advisor.id}>
              {advisor.fullName}
              {branches.length > 0 ? ` · ${advisor.branchName}` : ""}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        Estado
        <select
          name="status"
          defaultValue={values.status}
          className={selectClassName}
        >
          <option value="">Todos los estados</option>
          {SALE_STATUS_VALUES.map((status) => (
            <option key={status} value={status}>
              {SALE_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-end gap-2 sm:col-span-2 xl:col-span-1">
        <Button type="submit" className="h-10 flex-1 xl:flex-none">
          <Search data-icon="inline-start" />
          Filtrar
        </Button>
        <Button asChild variant="outline" size="icon-lg">
          <Link href={basePath} aria-label="Limpiar filtros">
            <RotateCcw />
          </Link>
        </Button>
      </div>
    </form>
  );
}
