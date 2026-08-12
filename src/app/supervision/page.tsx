import { Prisma } from "@prisma/client";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { CreateSaleDialog } from "@/components/sales/SaleDialogs";
import ManagerSalesList from "@/components/sales/ManagerSalesList";
import SalesFilters from "@/components/sales/SalesFilters";
import SalesKpis from "@/components/sales/SalesKpis";
import { buttonVariants } from "@/components/ui/button";
import { requireSupervisor } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import {
  currentLimaDate,
  managerSaleSelect,
  parseSalesFilters,
  saleFilterWhere,
  toEditableSaleRow,
  toSaleKpis,
  type SalesSearchParams,
} from "@/lib/sales-query";
import { cn } from "@/lib/utils";

export const runtime = "nodejs";

export default async function SupervisionPage({
  searchParams,
}: {
  searchParams: Promise<SalesSearchParams>;
}) {
  await connection();
  const [{ user, scope }, resolvedSearchParams] = await Promise.all([
    requireSupervisor(),
    searchParams,
  ]);
  const filters = parseSalesFilters(resolvedSearchParams);
  const branchWhere = { branchId: scope.branchId } satisfies Prisma.SaleWhereInput;
  const listWhere = {
    ...branchWhere,
    ...saleFilterWhere(filters),
  } satisfies Prisma.SaleWhereInput;

  const [advisors, sales, statusGroups] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: "ADVISOR",
        isActive: true,
        branchId: scope.branchId,
      },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true },
    }),
    prisma.sale.findMany({
      where: listWhere,
      orderBy: [{ saleDate: "desc" }, { createdAt: "desc" }],
      select: managerSaleSelect,
    }),
    prisma.sale.groupBy({
      by: ["status"],
      where: branchWhere,
      _count: { _all: true },
    }),
  ]);

  const advisorOptions = advisors.map((advisor) => ({
    ...advisor,
    branchId: scope.branchId,
    branchName: user.branch.name,
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <section className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#FF8D83]">
            Supervisión
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {user.branch.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Registra y actualiza las ventas de los asesores de tu sede.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/supervision/dashboard"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 border-white/15 bg-white/[0.05] px-3 text-white hover:bg-white/[0.1] hover:text-white"
            )}
          >
            <BarChart3 className="size-4" aria-hidden="true" />
            Ver dashboard
          </Link>
          <CreateSaleDialog
            advisors={advisorOptions}
            defaultSaleDate={currentLimaDate()}
          />
        </div>
      </section>

      <div className="mt-6">
        <SalesKpis kpis={toSaleKpis(statusGroups)} />
      </div>

      <section className="mt-8">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#FF8D83]">
            Operación comercial
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
            Ventas de la sede
          </h2>
        </div>
        <SalesFilters
          advisors={advisorOptions}
          basePath="/supervision"
          values={filters}
        />
        <div className="mt-4">
          <ManagerSalesList
            advisors={advisorOptions}
            sales={sales.map(toEditableSaleRow)}
          />
        </div>
      </section>
    </main>
  );
}
