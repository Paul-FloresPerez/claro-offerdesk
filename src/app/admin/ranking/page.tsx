import { ArrowRight, Database, RefreshCw, ShoppingCart, Trophy } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import AdminShell from "@/components/admin/AdminShell";
import RankingRows from "@/components/ranking/RankingRows";
import { Button } from "@/components/ui/button";
import { getAutomaticSalesRanking } from "@/lib/sales-ranking";

export const runtime = "nodejs";

export default async function AdminRankingPage() {
  await connection();
  const ranking = await getAutomaticSalesRanking({
    scope: { kind: "GLOBAL" },
  });
  const topAdvisor = ranking.advisors[0];

  return (
    <AdminShell
      title="Ranking automático"
      description="El Top Ventas se calcula desde las ventas instaladas. Ya no requiere carga manual."
      statusBadge={<AutomaticRankingBadge />}
    >
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)]">
        <article className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-emphasis">
                Vista global
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">
                Clasificación actual
              </h2>
            </div>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/top-ventas">
                Abrir Top Ventas
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
          <RankingRows
            advisors={ranking.advisors.slice(0, 8)}
            emptyMessage="El ranking aparecerá cuando exista una venta instalada."
          />
        </article>

        <aside className="grid content-start gap-4">
          <article className="rounded-xl border border-primary/25 bg-primary/10 p-5">
            <span className="grid size-11 place-items-center rounded-lg bg-primary/20 text-brand-emphasis">
              <RefreshCw aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-foreground">
              Sin edición manual
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Una venta suma solo cuando su estado es INSTALADA. Las pendientes y
              rechazadas no alteran la clasificación.
            </p>
          </article>

          <article className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-card text-muted-foreground">
                <Trophy aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Líder actual
                </p>
                <p className="mt-1 font-bold text-foreground">
                  {topAdvisor?.fullName ?? "Sin ventas instaladas"}
                </p>
                {topAdvisor ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {topAdvisor.installedSales} instaladas
                  </p>
                ) : null}
              </div>
            </div>
          </article>

          <Button asChild variant="outline" className="h-11 border-border bg-card text-foreground hover:bg-accent">
            <Link href="/admin/ventas">
              <ShoppingCart data-icon="inline-start" />
              Administrar ventas
            </Link>
          </Button>
        </aside>
      </section>
    </AdminShell>
  );
}

function AutomaticRankingBadge() {
  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
      <Database aria-hidden="true" className="size-4" />
      Conectado a ventas
    </span>
  );
}
