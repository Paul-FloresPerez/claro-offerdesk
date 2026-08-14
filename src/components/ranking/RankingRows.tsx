import RankingAvatar from "@/components/ranking/RankingAvatar";
import type { InstalledSalesAdvisor } from "@/lib/sales-ranking";

export default function RankingRows({
  advisors,
  emptyMessage = "Todavía no hay más posiciones en el ranking.",
}: {
  advisors: InstalledSalesAdvisor[];
  emptyMessage?: string;
}) {
  if (advisors.length === 0) {
    return (
      <p className="px-5 py-8 text-sm leading-6 text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ol className="divide-y divide-border">
      {advisors.map((advisor) => (
        <li
          key={advisor.advisorId}
          className="grid grid-cols-[2rem_2.75rem_minmax(0,1fr)] items-center gap-3 px-4 py-4 sm:grid-cols-[2.5rem_3rem_minmax(0,1fr)_auto] sm:px-5"
        >
          <span className="text-center text-lg font-black tabular-nums text-muted-foreground">
            {advisor.position}
          </span>
          <RankingAvatar
            fullName={advisor.fullName}
            photoUrl={advisor.photoUrl}
            size="row"
          />
          <div className="min-w-0">
            <p className="truncate font-bold text-foreground">{advisor.fullName}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {advisor.branchContext}
            </p>
          </div>
          <div className="col-start-3 flex items-baseline gap-1.5 sm:col-start-4 sm:justify-end">
            <strong className="text-xl font-black tabular-nums text-foreground">
              {advisor.installedSales}
            </strong>
            <span className="text-xs font-semibold text-muted-foreground">
              {advisor.installedSales === 1 ? "instalada" : "instaladas"}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
