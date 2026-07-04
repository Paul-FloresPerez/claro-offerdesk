import { connection } from "next/server";
import { Database } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import RankingForm from "@/components/admin/RankingForm";
import RankingTable from "@/components/admin/RankingTable";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export default async function AdminRankingPage() {
  await connection();

  const [rankings, users] = await Promise.all([
    prisma.salesRanking.findMany({
      orderBy: [
        {
          rankPosition: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        id: true,
        periodLabel: true,
        rankPosition: true,
        userId: true,
        fullName: true,
        branchName: true,
        photoUrl: true,
        salesCount: true,
        note: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.findMany({
      orderBy: [
        {
          isActive: "desc",
        },
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
      description="Crea y edita registros del ranking comercial con foto, periodo y ventas."
      statusBadge={<ConnectedRankingBadge />}
    >
      <div className="grid gap-5">
        <RankingForm users={users} />
        <RankingTable
          users={users}
          rankings={rankings.map((ranking) => ({
            ...ranking,
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
