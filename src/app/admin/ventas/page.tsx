import { connection } from "next/server";
import AdminShell from "@/components/admin/AdminShell";
import { CreateSaleDialog } from "@/components/sales/SaleDialogs";
import ManagerSalesList from "@/components/sales/ManagerSalesList";
import SalesFilters from "@/components/sales/SalesFilters";
import SalesKpis from "@/components/sales/SalesKpis";
import type { AdvisorOption } from "@/components/sales/types";
import { requireAdmin } from "@/lib/authorization";
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

export default async function AdminSalesPage({
  searchParams,
}: {
  searchParams: Promise<SalesSearchParams>;
}) {
  await connection();
  const [, resolvedSearchParams] = await Promise.all([
    requireAdmin(),
    searchParams,
  ]);
  const filters = parseSalesFilters(resolvedSearchParams);

  const [branches, editableAdvisors, filterAdvisors, sales, statusGroups] =
    await Promise.all([
      prisma.branch.findMany({
        orderBy: [{ isActive: "desc" }, { name: "asc" }],
        select: { id: true, name: true },
      }),
      prisma.user.findMany({
        where: {
          role: "ADVISOR",
          isActive: true,
          branchId: { not: null },
          branch: { is: { isActive: true } },
        },
        orderBy: { fullName: "asc" },
        select: {
          id: true,
          fullName: true,
          branchId: true,
          branch: { select: { name: true } },
        },
      }),
      prisma.user.findMany({
        where: {
          role: "ADVISOR",
          branchId: { not: null },
        },
        orderBy: { fullName: "asc" },
        select: {
          id: true,
          fullName: true,
          branchId: true,
          branch: { select: { name: true } },
        },
      }),
      prisma.sale.findMany({
        where: saleFilterWhere(filters),
        orderBy: [{ saleDate: "desc" }, { createdAt: "desc" }],
        select: managerSaleSelect,
      }),
      prisma.sale.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

  const editableAdvisorOptions = toAdvisorOptions(editableAdvisors);
  const filterAdvisorOptions = toAdvisorOptions(filterAdvisors);

  return (
    <AdminShell
      title="Ventas"
      description="Consulta y corrige la operación comercial de todas las sedes."
    >
      <div className="flex flex-col gap-5">
        <div className="flex justify-end">
          <CreateSaleDialog
            advisors={editableAdvisorOptions}
            defaultSaleDate={currentLimaDate()}
          />
        </div>

        <SalesKpis kpis={toSaleKpis(statusGroups)} />

        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#FFB4AC]">
              Alcance global
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-white">
              Ventas registradas
            </h2>
          </div>
          <SalesFilters
            advisors={filterAdvisorOptions}
            basePath="/admin/ventas"
            branches={branches}
            values={filters}
          />
          <div className="mt-4">
            <ManagerSalesList
              advisors={editableAdvisorOptions}
              sales={sales.map(toEditableSaleRow)}
              showBranch
            />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function toAdvisorOptions(
  advisors: Array<{
    id: string;
    fullName: string;
    branchId: string | null;
    branch: { name: string } | null;
  }>
): AdvisorOption[] {
  return advisors.flatMap((advisor) =>
    advisor.branchId && advisor.branch
      ? [
          {
            id: advisor.id,
            fullName: advisor.fullName,
            branchId: advisor.branchId,
            branchName: advisor.branch.name,
          },
        ]
      : []
  );
}
