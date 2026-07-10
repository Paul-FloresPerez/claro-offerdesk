import { connection } from "next/server";
import { Award, Medal, TrendingUp, Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  formatRankingEffectiveness,
  getRankingEffectiveness,
  rankingOrder,
} from "@/lib/ranking";

export const runtime = "nodejs";

type RankingAdvisor = {
  id: string;
  rankPosition: number;
  fullName: string;
  branchName: string;
  salesCount: number;
  periodLabel: string;
  photoUrl: string | null;
  pendingSales: number;
  rejectedSales: number;
  note: string | null;
  effectiveness: number | null;
};

const medalStyles = [
  "border-yellow-300/50 bg-yellow-300/12 text-yellow-200",
  "border-slate-300/50 bg-slate-200/12 text-slate-100",
  "border-orange-300/50 bg-orange-300/12 text-orange-100",
];

export default async function TopVentasPage() {
  await connection();

  const ranking = await prisma.salesRanking.findMany({
    where: {
      isActive: true,
      user: {
        is: {
          isActive: true,
        },
      },
    },
    orderBy: rankingOrder,
    select: {
      id: true,
      salesCount: true,
      pendingSales: true,
      rejectedSales: true,
      periodLabel: true,
      note: true,
      fullName: true,
      branchName: true,
      photoUrl: true,
      user: {
        select: {
          fullName: true,
          branchName: true,
          photoUrl: true,
        },
      },
    },
  });

  const advisors: RankingAdvisor[] = ranking.map((advisor, index) => {
    const salesCount = advisor.salesCount;
    const rejectedSales = advisor.rejectedSales;

    return {
      id: advisor.id,
      rankPosition: index + 1,
      fullName: advisor.user?.fullName ?? advisor.fullName,
      branchName: advisor.user?.branchName ?? advisor.branchName ?? "Sin sede",
      photoUrl: advisor.user?.photoUrl ?? advisor.photoUrl,
      salesCount,
      pendingSales: advisor.pendingSales,
      rejectedSales,
      periodLabel: advisor.periodLabel,
      note: advisor.note,
      effectiveness: getRankingEffectiveness(salesCount, rejectedSales),
    };
  });
  const topThree = advisors.slice(0, 3);
  const periodLabel = advisors[0]?.periodLabel ?? "Periodo actual";

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-9">
      <section className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
            Ranking comercial
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Top ventas
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Reconocimiento semanal para asesores destacados por desempeño
            comercial.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-semibold text-white">
          <TrendingUp className="h-4 w-4 text-[#FFB4AC]" />
          {periodLabel}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {topThree.map((advisor, index) => (
          <TopAdvisorCard key={advisor.rankPosition} advisor={advisor} index={index} />
        ))}
        {topThree.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 text-sm text-slate-300 lg:col-span-3">
            Todavia no hay registros activos en el ranking.
          </div>
        ) : null}
      </section>

      <section className="mt-7 overflow-hidden rounded-lg border border-white/10 bg-white/[0.07] shadow-[0_20px_56px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-2 border-b border-white/10 px-4 py-4 sm:px-5">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Listado completo
          </h2>
          <p className="text-sm text-slate-400">
            Vista previa del ranking semanal.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-[#111827]/70 text-xs uppercase tracking-[0.12em] text-slate-400">
              <tr>
                <th className="px-5 py-3">Puesto</th>
                <th className="px-5 py-3">Asesor</th>
                <th className="px-5 py-3">Sede</th>
                <th className="px-5 py-3">Concretadas</th>
                <th className="px-5 py-3">Pendientes</th>
                <th className="px-5 py-3">Rechazadas</th>
                <th className="px-5 py-3">Efectividad</th>
                <th className="px-5 py-3">Periodo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {advisors.map((advisor) => (
                <tr key={advisor.id} className="text-slate-200">
                  <td className="px-5 py-4 font-semibold text-white">
                    #{advisor.rankPosition}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <AdvisorAvatar advisor={advisor} size="sm" />
                      <span className="font-semibold text-white">
                        {advisor.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">{advisor.branchName}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex h-7 items-center rounded-md bg-[#DA291C]/15 px-2.5 font-bold text-[#FFB4AC]">
                      {advisor.salesCount}
                    </span>
                  </td>
                  <td className="px-5 py-4">{advisor.pendingSales}</td>
                  <td className="px-5 py-4">{advisor.rejectedSales}</td>
                  <td className="px-5 py-4">
                    {formatRankingEffectiveness(advisor.effectiveness)}
                  </td>
                  <td className="px-5 py-4">{advisor.periodLabel}</td>
                </tr>
              ))}
              {advisors.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-slate-300" colSpan={8}>
                    No hay asesores activos en el ranking.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function TopAdvisorCard({
  advisor,
  index,
}: {
  advisor: RankingAdvisor;
  index: number;
}) {
  const Icon = index === 0 ? Trophy : index === 1 ? Medal : Award;

  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-[0_20px_56px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <AdvisorAvatar advisor={advisor} size="lg" />
        <span
          className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-bold ${medalStyles[index]}`}
        >
          <Icon className="h-4 w-4" />
          #{advisor.rankPosition}
        </span>
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">
        {advisor.fullName}
      </h2>
      <p className="mt-1 text-sm text-slate-400">{advisor.branchName}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <RankingMetric label="Concretadas" value={advisor.salesCount.toString()} />
        <RankingMetric label="Pendientes" value={advisor.pendingSales.toString()} />
        <RankingMetric label="Rechazadas" value={advisor.rejectedSales.toString()} />
        <RankingMetric
          label="Efectividad"
          value={formatRankingEffectiveness(advisor.effectiveness)}
        />
      </div>
      <p className="mt-4 text-sm text-slate-400">{advisor.periodLabel}</p>
      {advisor.note ? (
        <p className="mt-4 rounded-lg border border-[#DA291C]/25 bg-[#DA291C]/10 px-3 py-2 text-sm font-medium text-[#FFB4AC]">
          {advisor.note}
        </p>
      ) : null}
    </article>
  );
}

function RankingMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#111827]/55 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function AdvisorAvatar({
  advisor,
  size,
}: {
  advisor: RankingAdvisor;
  size: "sm" | "lg";
}) {
  const sizeClass = size === "lg" ? "h-16 w-16 text-lg" : "h-10 w-10 text-sm";

  if (advisor.photoUrl) {
    return (
      <img
        src={advisor.photoUrl}
        alt={advisor.fullName}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-white/10`}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} grid shrink-0 place-items-center rounded-full bg-[#DA291C] font-black text-white shadow-[0_10px_24px_rgba(218,41,28,0.24)]`}
    >
      {getInitials(advisor.fullName)}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
