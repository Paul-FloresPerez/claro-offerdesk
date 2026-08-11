import { Building2, Trophy } from "lucide-react";
import { connection } from "next/server";
import BranchLeaders from "@/components/ranking/BranchLeaders";
import BranchRankingFilter from "@/components/ranking/BranchRankingFilter";
import RankingRows from "@/components/ranking/RankingRows";
import SalesPodium from "@/components/ranking/SalesPodium";
import { getAutomaticSalesRanking } from "@/lib/sales-ranking";

export const runtime = "nodejs";

type TopVentasPageProps = {
  searchParams: Promise<{
    branchId?: string | string[];
  }>;
};

export default async function TopVentasPage({
  searchParams,
}: TopVentasPageProps) {
  await connection();
  const params = await searchParams;
  const requestedBranchId = Array.isArray(params.branchId)
    ? params.branchId[0]
    : params.branchId;
  const ranking = await getAutomaticSalesRanking(requestedBranchId);
  const selectedBranch = ranking.selectionValid ? ranking.selectedBranch : null;
  const isGlobal = !selectedBranch;
  const viewTitle = selectedBranch ? `Top ${selectedBranch.name}` : "Top global";
  const viewDescription = selectedBranch
    ? `Ventas instaladas históricamente en ${selectedBranch.name}.`
    : "Resultados acumulados de todas las sedes.";

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-9">
      <header className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#FFB4AC]">
            Ranking comercial
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Top ventas
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Clasificación automática por ventas instaladas.
          </p>
        </div>
        <BranchRankingFilter
          branches={ranking.branches}
          selectedBranchId={selectedBranch?.id ?? null}
        />
      </header>

      {!ranking.selectionValid ? (
        <p className="mt-5 rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm font-medium text-amber-100">
          La sede solicitada no está disponible. Se muestra el ranking global.
        </p>
      ) : null}

      <section className="pt-8" aria-labelledby="ranking-view-title">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="ranking-view-title"
              className="text-2xl font-black tracking-tight text-white sm:text-3xl"
            >
              {viewTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-400">{viewDescription}</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-slate-300">
            <Trophy aria-hidden="true" className="size-4 text-[#FFB4AC]" />
            Solo ventas instaladas
          </span>
        </div>

        {ranking.advisors.length > 0 ? (
          <SalesPodium advisors={ranking.advisors} />
        ) : (
          <EmptyRankingState branchName={selectedBranch?.name} />
        )}
      </section>

      {ranking.advisors.length > 0 ? (
        <div
          className={`mt-7 grid gap-6 ${isGlobal ? "lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.75fr)]" : ""}`}
        >
          <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.055]">
            <div className="border-b border-white/10 px-5 py-4">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Posiciones 4 en adelante
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Clasificación completa, sin métricas paralelas.
              </p>
            </div>
            <RankingRows advisors={ranking.advisors.slice(3)} />
          </section>

          {isGlobal ? (
            <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.055]">
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Líderes por sede
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Primer lugar de cada sede activa.
                </p>
              </div>
              <BranchLeaders leaders={ranking.leadersByBranch} />
            </section>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}

function EmptyRankingState({ branchName }: { branchName?: string }) {
  return (
    <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.04] px-6 py-12 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#DA291C]/15 text-[#FFB4AC]">
          <Building2 aria-hidden="true" className="size-6" />
        </span>
        <h3 className="mt-5 text-xl font-bold text-white">
          Aún no hay ventas instaladas
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {branchName
            ? `${branchName} aparecerá aquí cuando registre su primera venta instalada.`
            : "El podio se activará automáticamente con la primera venta instalada del equipo."}
        </p>
      </div>
    </div>
  );
}
