import { Building2 } from "lucide-react";
import RankingAvatar from "@/components/ranking/RankingAvatar";
import type { BranchSalesLeader } from "@/lib/sales-ranking";

export default function BranchLeaders({
  leaders,
}: {
  leaders: BranchSalesLeader[];
}) {
  if (leaders.length === 0) {
    return (
      <p className="px-5 py-8 text-sm leading-6 text-muted-foreground">
        Las sedes activas todavía no tienen ventas instaladas.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {leaders.map((leader) => (
        <li key={leader.branchId} className="flex items-center gap-3 px-4 py-4 sm:px-5">
          <RankingAvatar
            fullName={leader.fullName}
            photoUrl={leader.photoUrl}
            size="leader"
          />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 truncate text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
              <Building2 aria-hidden="true" className="size-3.5" />
              {leader.branchName}
            </p>
            <p className="mt-1 truncate font-bold text-foreground">{leader.fullName}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black tabular-nums text-foreground">
              {leader.installedSales}
            </p>
            <p className="text-[0.7rem] font-semibold text-muted-foreground">
              instaladas
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
