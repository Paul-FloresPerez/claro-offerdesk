import { Building2, Trophy } from "lucide-react";
import { connection } from "next/server";
import BranchLeaders from "@/components/ranking/BranchLeaders";
import BranchRankingFilter from "@/components/ranking/BranchRankingFilter";
import RankingRows from "@/components/ranking/RankingRows";
import SalesPodium from "@/components/ranking/SalesPodium";
import { requireRankingAccess } from "@/lib/authorization";
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
  const [params, authorization] = await Promise.all([
    searchParams,
    requireRankingAccess(),
  ]);
  const requestedBranchId = Array.isArray(params.branchId)
    ? params.branchId[0]
    : params.branchId;
  const ranking = await getAutomaticSalesRanking({
    requestedBranchId,
    scope: authorization.scope,
  });
  const visibleAdvisors = ranking.advisors.slice(0, 20);
  const selectedBranch = ranking.selectionValid ? ranking.selectedBranch : null;
  const isGlobal = !selectedBranch;
  const viewTitle = selectedBranch
    ? `Top 20 · ${selectedBranch.name}`
    : "Top 20 global";
  const viewDescription = selectedBranch
    ? `Ventas instaladas históricamente en ${selectedBranch.name}.`
    : "Resultados acumulados de todas las sedes.";

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-9">
      <header className="flex flex-col gap-5 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-emphasis">
            Ranking comercial
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Top ventas
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Clasificación automática por ventas instaladas.
          </p>
        </div>
        <BranchRankingFilter
          branches={ranking.branches}
          selectedBranchId={selectedBranch?.id ?? null}
        />
      </header>

      {!ranking.selectionValid ? (
        <p className="mt-5 rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm font-medium text-amber-800 dark:text-amber-100">
          La sede solicitada no está disponible. Se muestra el ranking global.
        </p>
      ) : null}

      <section className="pt-8" aria-labelledby="ranking-view-title">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="ranking-view-title"
              className="text-2xl font-black tracking-tight text-foreground sm:text-3xl"
            >
              {viewTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{viewDescription}</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground">
            <Trophy aria-hidden="true" className="size-4 text-brand-emphasis" />
            Solo ventas instaladas
          </span>
        </div>

        {visibleAdvisors.length > 0 ? (
          <SalesPodium advisors={visibleAdvisors} />
        ) : (
          <EmptyRankingState branchName={selectedBranch?.name} />
        )}
      </section>

      {visibleAdvisors.length > 0 ? (
        <div
          className={`mt-7 grid gap-6 ${isGlobal ? "lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.75fr)]" : ""}`}
        >
          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Posiciones 4 al 20
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Clasificación principal basada solo en ventas instaladas.
              </p>
            </div>
            <RankingRows advisors={visibleAdvisors.slice(3)} />
          </section>

          {isGlobal ? (
            <section className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Líderes por sede
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
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
    <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/15 text-brand-emphasis">
          <Building2 aria-hidden="true" className="size-6" />
        </span>
        <h3 className="mt-5 text-xl font-bold text-foreground">
          Aún no hay ventas instaladas
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {branchName
            ? `${branchName} aparecerá aquí cuando registre su primera venta instalada.`
            : "El podio se activará automáticamente con la primera venta instalada del equipo."}
        </p>
      </div>
    </div>
  );
}
