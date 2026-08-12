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
        <article className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.055]">
          <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#FFB4AC]">
                Vista global
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
                Clasificación actual
              </h2>
            </div>
            <Button asChild className="bg-[#DA291C] text-white hover:bg-[#C52218]">
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
          <article className="rounded-xl border border-[#DA291C]/25 bg-[#DA291C]/10 p-5">
            <span className="grid size-11 place-items-center rounded-lg bg-[#DA291C]/20 text-[#FFB4AC]">
              <RefreshCw aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-white">
              Sin edición manual
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Una venta suma solo cuando su estado es INSTALADA. Las pendientes y
              rechazadas no alteran la clasificación.
            </p>
          </article>

          <article className="rounded-xl border border-white/10 bg-white/[0.055] p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/[0.07] text-slate-200">
                <Trophy aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  Líder actual
                </p>
                <p className="mt-1 font-bold text-white">
                  {topAdvisor?.fullName ?? "Sin ventas instaladas"}
                </p>
                {topAdvisor ? (
                  <p className="mt-1 text-sm text-slate-400">
                    {topAdvisor.installedSales} instaladas
                  </p>
                ) : null}
              </div>
            </div>
          </article>

          <Button asChild variant="outline" className="h-11 border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.09]">
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
    <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">
      <Database aria-hidden="true" className="size-4" />
      Conectado a ventas
    </span>
  );
}
