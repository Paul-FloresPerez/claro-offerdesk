import { connection } from "next/server";
import { Database } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import RankingForm from "@/components/admin/RankingForm";
import RankingTable from "@/components/admin/RankingTable";
import { prisma } from "@/lib/prisma";
import { rankingOrder } from "@/lib/ranking";

export const runtime = "nodejs";

export default async function AdminRankingPage() {
  await connection();

  const [rankings, users] = await Promise.all([
    prisma.salesRanking.findMany({
      orderBy: rankingOrder,
      select: {
        id: true,
        periodLabel: true,
        userId: true,
        fullName: true,
        branchName: true,
        photoUrl: true,
        salesCount: true,
        pendingSales: true,
        rejectedSales: true,
        note: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            fullName: true,
            branchName: true,
            photoUrl: true,
            isActive: true,
          },
        },
      },
    }),
    prisma.user.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        {
          fullName: "asc",
        },
      ],
      select: {
        id: true,
        fullName: true,
        branchName: true,
        photoUrl: true,
      },
    }),
  ]);

  return (
    <AdminShell
      title="Ranking"
      description="Gestiona resultados comerciales; el puesto se calcula automáticamente por desempeño."
      statusBadge={<ConnectedRankingBadge />}
    >
      <div className="grid gap-5">
        <RankingForm users={users} />
        <RankingTable
          users={users}
          rankings={rankings.map((ranking) => ({
            id: ranking.id,
            periodLabel: ranking.periodLabel,
            userId: ranking.userId,
            fullName: ranking.user?.fullName ?? ranking.fullName,
            branchName: ranking.user?.branchName ?? ranking.branchName,
            photoUrl: ranking.user?.photoUrl ?? ranking.photoUrl,
            salesCount: ranking.salesCount,
            pendingSales: ranking.pendingSales,
            rejectedSales: ranking.rejectedSales,
            note: ranking.note,
            isActive: ranking.isActive,
            hasActiveUser: Boolean(ranking.user?.isActive),
            createdAt: ranking.createdAt.toISOString(),
            updatedAt: ranking.updatedAt.toISOString(),
          }))}
        />
      </div>
    </AdminShell>
  );
}

function ConnectedRankingBadge() {
  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">
      <Database className="h-4 w-4" />
      Conectado a Neon
    </span>
  );
}
