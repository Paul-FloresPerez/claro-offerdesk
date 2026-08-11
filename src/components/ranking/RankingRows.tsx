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
      <p className="px-5 py-8 text-sm leading-6 text-slate-400">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ol className="divide-y divide-white/10">
      {advisors.map((advisor) => (
        <li
          key={advisor.advisorId}
          className="grid grid-cols-[2rem_2.75rem_minmax(0,1fr)] items-center gap-3 px-4 py-4 sm:grid-cols-[2.5rem_3rem_minmax(0,1fr)_auto] sm:px-5"
        >
          <span className="text-center text-lg font-black tabular-nums text-slate-400">
            {advisor.position}
          </span>
          <RankingAvatar
            fullName={advisor.fullName}
            photoUrl={advisor.photoUrl}
            size="row"
          />
          <div className="min-w-0">
            <p className="truncate font-bold text-white">{advisor.fullName}</p>
            <p className="mt-1 truncate text-xs text-slate-400">
              {advisor.branchContext}
            </p>
          </div>
          <div className="col-start-3 flex items-baseline gap-1.5 sm:col-start-4 sm:justify-end">
            <strong className="text-xl font-black tabular-nums text-white">
              {advisor.installedSales}
            </strong>
            <span className="text-xs font-semibold text-slate-400">
              {advisor.installedSales === 1 ? "instalada" : "instaladas"}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
