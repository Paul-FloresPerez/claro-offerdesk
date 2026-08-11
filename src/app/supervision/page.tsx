import { Prisma } from "@prisma/client";
import { connection } from "next/server";
import { CreateSaleDialog } from "@/components/sales/SaleDialogs";
import ManagerSalesList from "@/components/sales/ManagerSalesList";
import SalesFilters from "@/components/sales/SalesFilters";
import SalesKpis from "@/components/sales/SalesKpis";
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
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-9">
      <section className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
            Supervisión
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {user.branch.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Registra y actualiza las ventas de los asesores de tu sede.
          </p>
        </div>
        <CreateSaleDialog
          advisors={advisorOptions}
          defaultSaleDate={currentLimaDate()}
        />
      </section>

      <div className="mt-6">
        <SalesKpis kpis={toSaleKpis(statusGroups)} />
      </div>

      <section className="mt-8">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#FFB4AC]">
            Operación comercial
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
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
