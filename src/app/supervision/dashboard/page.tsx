import { BarChart3, ClipboardList } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import SalesDashboard from "@/components/dashboard/SalesDashboard";
import { buttonVariants } from "@/components/ui/button";
import {
  getSupervisorSalesDashboard,
  type DashboardSearchParams,
} from "@/lib/sales-dashboard";
import { cn } from "@/lib/utils";

export const runtime = "nodejs";

export default async function SupervisorDashboardPage({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  await connection();
  const data = await getSupervisorSalesDashboard(await searchParams);

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-9">
      <section className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
            Supervisión · Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {data.scopeLabel}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Seguimiento comercial de tu sede con alcance protegido desde el servidor.
          </p>
        </div>
        <Link
          href="/supervision"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 w-fit border-white/15 bg-white/[0.05] px-4 text-white hover:bg-white/[0.1] hover:text-white"
          )}
        >
          <ClipboardList className="size-4" aria-hidden="true" />
          Ir a operación
        </Link>
      </section>

      <nav aria-label="Vistas de supervisión" className="mb-6 flex gap-2">
        <Link
          href="/supervision"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
        >
          <ClipboardList className="size-4 text-[#FFB4AC]" aria-hidden="true" />
          Operación
        </Link>
        <span
          aria-current="page"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#DA291C]/45 bg-[#DA291C]/15 px-3 text-sm font-semibold text-white"
        >
          <BarChart3 className="size-4 text-[#FFB4AC]" aria-hidden="true" />
          Dashboard
        </span>
      </nav>

      <SalesDashboard
        data={data}
        basePath="/supervision/dashboard"
        showBranchFilter={false}
      />
    </main>
  );
}
