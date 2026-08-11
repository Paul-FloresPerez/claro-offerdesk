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
      className="flex w-full flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-4 sm:flex-row sm:items-end lg:w-auto lg:min-w-[30rem]"
    >
      <label className="grid flex-1 gap-2 text-sm font-semibold text-slate-200">
        Sede
        <span className="relative">
          <select
            name="branchId"
            defaultValue={selectedBranchId ?? ""}
            className="h-11 w-full appearance-none rounded-lg border border-white/15 bg-[#111827] px-3 pr-10 text-sm font-medium text-white outline-none transition focus-visible:border-[#DA291C] focus-visible:ring-3 focus-visible:ring-[#DA291C]/25"
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
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
        </span>
      </label>
      <Button
        type="submit"
        className="h-11 bg-[#DA291C] px-5 font-bold text-white hover:bg-[#C52218]"
      >
        Aplicar filtro
      </Button>
    </form>
  );
}
