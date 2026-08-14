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
      <section className="mb-6 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-emphasis">
            Supervisión · Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {data.scopeLabel}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Seguimiento comercial de tu sede con alcance protegido desde el servidor.
          </p>
        </div>
        <Link
          href="/supervision"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 w-fit border-border bg-card px-4 text-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <ClipboardList className="size-4" aria-hidden="true" />
          Ir a operación
        </Link>
      </section>

      <nav aria-label="Vistas de supervisión" className="mb-6 flex gap-2">
        <Link
          href="/supervision"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <ClipboardList className="size-4 text-brand-emphasis" aria-hidden="true" />
          Operación
        </Link>
        <span
          aria-current="page"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-primary/45 bg-primary/15 px-3 text-sm font-semibold text-foreground"
        >
          <BarChart3 className="size-4 text-brand-emphasis" aria-hidden="true" />
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
