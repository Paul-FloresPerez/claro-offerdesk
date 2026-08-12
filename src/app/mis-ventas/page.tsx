import { connection } from "next/server";
import AdvisorSalesList from "@/components/sales/AdvisorSalesList";
import SalesKpis from "@/components/sales/SalesKpis";
import { requireAdvisor } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { toAdvisorSaleRow, toSaleKpis } from "@/lib/sales-query";

export const runtime = "nodejs";

export default async function MySalesPage() {
  await connection();
  const { user, scope } = await requireAdvisor();

  const [sales, statusGroups] = await Promise.all([
    prisma.sale.findMany({
      where: { advisorId: scope.userId },
      orderBy: [{ saleDate: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        customerDni: true,
        service: true,
        planName: true,
        status: true,
        rejectionReason: true,
        saleDate: true,
      },
    }),
    prisma.sale.groupBy({
      by: ["status"],
      where: { advisorId: scope.userId },
      _count: { _all: true },
    }),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <section className="border-b border-white/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#FF8D83]">
          Actividad personal
        </p>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Mis ventas
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
          {user.fullName}, consulta el estado actual de tus ventas registradas.
        </p>
      </section>

      <div className="mt-6">
        <SalesKpis kpis={toSaleKpis(statusGroups)} />
      </div>

      <section className="mt-7">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#FFB4AC]">
            Historial
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
            Ventas registradas
          </h2>
        </div>
        <AdvisorSalesList sales={sales.map(toAdvisorSaleRow)} />
      </section>
    </main>
  );
}
