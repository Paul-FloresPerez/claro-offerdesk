import { BarChart3, FileVideo, UsersRound } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { rankingMock } from "@/data/ranking";
import { getTrainingMedia } from "@/lib/training-media";

export default function AdminPage() {
  const { audios, videos } = getTrainingMedia();
  const dashboardCards = [
    {
      label: "Usuarios",
      value: "3",
      detail: "Asesores de ejemplo",
      icon: UsersRound,
    },
    {
      label: "Ventas destacadas",
      value: `${rankingMock[0]?.salesCount ?? 0}`,
      detail: "Mayor registro semanal",
      icon: BarChart3,
    },
    {
      label: "Materiales",
      value: `${audios.length + videos.length}`,
      detail: "Audios y videos detectados",
      icon: FileVideo,
    },
  ];

  return (
    <AdminShell
      title="Resumen"
      description="Vista visual del futuro panel operativo. Todavia no guarda ni consulta datos reales."
    >
      <section className="grid gap-4 lg:grid-cols-3">
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
                Vista previa
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
          Panel preparado para la proxima conexion de usuarios, permisos,
          ranking y biblioteca de capacitacion.
        </p>
      </section>
    </AdminShell>
  );
}
