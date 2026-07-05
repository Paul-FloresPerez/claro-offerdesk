import { BarChart3, FileVideo, UserCheck, UserX } from "lucide-react";
import { connection } from "next/server";
import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { getTrainingMedia } from "@/lib/training-media";

export const runtime = "nodejs";

export default async function AdminPage() {
  await connection();

  const { audios, videos } = getTrainingMedia();
  const detectedMediaCount = audios.length + videos.length;
  const [
    activeUsers,
    inactiveUsers,
    activeRankingRecords,
    activeTrainingMediaRecords,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        isActive: true,
      },
    }),
    prisma.user.count({
      where: {
        isActive: false,
      },
    }),
    prisma.salesRanking.count({
      where: {
        isActive: true,
      },
    }),
    prisma.trainingMedia.count({
      where: {
        isActive: true,
      },
    }),
  ]);
  const mediaMetricValue =
    activeTrainingMediaRecords > 0 ? activeTrainingMediaRecords : detectedMediaCount;
  const mediaMetricDetail =
    activeTrainingMediaRecords > 0
      ? "Registros activos en training_media"
      : "Audios y videos detectados";
  const dashboardCards = [
    {
      label: "Usuarios activos",
      value: activeUsers.toString(),
      detail: "Cuentas habilitadas para ingresar",
      icon: UserCheck,
    },
    {
      label: "Usuarios inactivos",
      value: inactiveUsers.toString(),
      detail: "Cuentas deshabilitadas",
      icon: UserX,
    },
    {
      label: "Ranking activo",
      value: activeRankingRecords.toString(),
      detail: "Registros visibles en Top ventas",
      icon: BarChart3,
    },
    {
      label: "Materiales",
      value: mediaMetricValue.toString(),
      detail: mediaMetricDetail,
      icon: FileVideo,
    },
  ];

  return (
    <AdminShell
      title="Resumen"
      description="Vista operativa con indicadores reales del sistema."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card) => (
          <article
            key={card.label}
            className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-[0_20px_56px_rgba(0,0,0,0.18)]"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC]">
                <card.icon className="h-5 w-5" />
              </span>
              <span className="rounded-md border border-white/10 bg-[#111827]/55 px-2.5 py-1 text-xs font-semibold text-[#FFB4AC]">
                Dato real
              </span>
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">
              {card.label}
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-slate-400">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.07] p-5">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Estado de la fase
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Usuarios y ranking ya consultan Neon mediante Prisma. La biblioteca de
          capacitacion usa registros de base si existen; si no, muestra archivos
          detectados en public.
        </p>
      </section>
    </AdminShell>
  );
}
