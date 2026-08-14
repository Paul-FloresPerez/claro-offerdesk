import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RankingBranchOption } from "@/lib/sales-ranking";

export default function BranchRankingFilter({
  branches,
  selectedBranchId,
}: {
  branches: RankingBranchOption[];
  selectedBranchId: string | null;
}) {
  return (
    <form
      action="/top-ventas"
      className="flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end lg:w-auto lg:min-w-[30rem]"
    >
      <label className="grid flex-1 gap-2 text-sm font-semibold text-muted-foreground">
        Sede
        <span className="relative">
          <select
            name="branchId"
            defaultValue={selectedBranchId ?? ""}
            className="h-11 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-10 text-sm font-medium text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/25"
          >
            <option value="">Todas las sedes</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
                {branch.isActive ? "" : " (histórica)"}
              </option>
            ))}
          </select>
          <SlidersHorizontal
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
        </span>
      </label>
      <Button
        type="submit"
        className="h-11 bg-primary px-5 font-bold text-primary-foreground hover:bg-primary/90"
      >
        Aplicar filtro
      </Button>
    </form>
  );
}
