import { Medal, Trophy } from "lucide-react";
import RankingAvatar from "@/components/ranking/RankingAvatar";
import type { InstalledSalesAdvisor } from "@/lib/sales-ranking";
import { cn } from "@/lib/utils";

const positionStyles = {
  1: {
    card: "col-span-2 row-start-1 border-amber-300/35 bg-[#182235] lg:col-span-1 lg:col-start-2 lg:min-h-[25rem]",
    marker: "border-amber-300/40 bg-amber-300/10 text-amber-200",
    ring: "ring-4 ring-amber-300/25",
    size: "hero" as const,
    icon: Trophy,
  },
  2: {
    card: "col-start-1 row-start-2 border-slate-300/25 bg-[#151f31] lg:row-start-1 lg:min-h-[21rem]",
    marker: "border-slate-200/30 bg-slate-200/10 text-slate-100",
    ring: "ring-4 ring-slate-200/15",
    size: "podium" as const,
    icon: Medal,
  },
  3: {
    card: "col-start-2 row-start-2 border-orange-300/25 bg-[#151f31] lg:col-start-3 lg:row-start-1 lg:min-h-[21rem]",
    marker: "border-orange-300/30 bg-orange-300/10 text-orange-200",
    ring: "ring-4 ring-orange-300/15",
    size: "podium" as const,
    icon: Medal,
  },
} as const;

export default function SalesPodium({
  advisors,
}: {
  advisors: InstalledSalesAdvisor[];
}) {
  return (
    <div className="grid grid-cols-2 items-end gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {advisors.slice(0, 3).map((advisor) => (
        <PodiumPlace key={advisor.advisorId} advisor={advisor} />
      ))}
    </div>
  );
}

function PodiumPlace({ advisor }: { advisor: InstalledSalesAdvisor }) {
  const position = advisor.position as 1 | 2 | 3;
  const styles = positionStyles[position];
  const Icon = styles.icon;
  const isWinner = position === 1;

  return (
    <article
      className={cn(
        "relative flex min-w-0 flex-col items-center justify-end overflow-hidden rounded-2xl border px-3 py-6 text-center shadow-[0_20px_48px_rgba(0,0,0,0.24)] sm:px-5 sm:py-7",
        styles.card
      )}
    >
      <span
        className={cn(
          "mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em]",
          styles.marker
        )}
      >
        <Icon aria-hidden="true" className="size-4" />
        {position}.º puesto
      </span>
      <RankingAvatar
        fullName={advisor.fullName}
        photoUrl={advisor.photoUrl}
        priority={isWinner}
        size={styles.size}
        className={styles.ring}
      />
      <h3
        className={cn(
          "mt-5 line-clamp-2 font-bold tracking-tight text-white",
          isWinner ? "text-2xl sm:text-3xl" : "text-base sm:text-xl"
        )}
      >
        {advisor.fullName}
      </h3>
      <p className="mt-2 line-clamp-1 text-xs font-medium text-slate-400 sm:text-sm">
        {advisor.branchContext}
      </p>
      <p
        className={cn(
          "mt-4 font-black tabular-nums text-white",
          isWinner ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
        )}
      >
        {advisor.installedSales}
      </p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#FFB4AC] sm:text-sm">
        {advisor.installedSales === 1 ? "venta instalada" : "ventas instaladas"}
      </p>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 h-1",
          position === 1
            ? "bg-amber-300"
            : position === 2
              ? "bg-slate-300"
              : "bg-orange-300"
        )}
      />
    </article>
  );
}
