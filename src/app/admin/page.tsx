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
        <span className="inline-flex w-fit rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-slate-200">
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
