import { connection } from "next/server";
import AdminShell from "@/components/admin/AdminShell";
import SalesDashboard from "@/components/dashboard/SalesDashboard";
import {
  getAdminSalesDashboard,
  type DashboardSearchParams,
} from "@/lib/sales-dashboard";

export const runtime = "nodejs";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  await connection();
  const data = await getAdminSalesDashboard(await searchParams);

  return (
    <AdminShell
      title="Dashboard comercial"
      description="Lectura ejecutiva de ventas, conversión y carga operativa por sede y asesor."
      statusBadge={
        <span className="inline-flex h-10 w-fit items-center rounded-lg border border-border bg-card px-3 text-sm font-semibold text-muted-foreground">
          {data.scopeLabel}
        </span>
      }
    >
      <SalesDashboard
        data={data}
        basePath="/admin"
        showBranchFilter
      />
    </AdminShell>
  );
}
