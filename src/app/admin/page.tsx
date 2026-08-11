import {
  BarChart3,
  Building2,
  FileVideo,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Trophy,
  UserCheck,
  UserRound,
  UserX,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { getPromotionMetrics } from "@/lib/promotions";
import { getAutomaticSalesRanking } from "@/lib/sales-ranking";

export const runtime = "nodejs";

export default async function AdminPage() {
  await connection();
  const promotionMetrics = getPromotionMetrics();

  const [
    activeUsers,
    inactiveUsers,
    advisors,
    supervisors,
    admins,
    activeBranches,
    activeMedia,
    automaticRanking,
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
    prisma.user.count({
      where: {
        OR: [{ role: "ADVISOR" }, { role: null, isAdmin: false }],
      },
    }),
    prisma.user.count({
      where: {
        role: "SUPERVISOR",
      },
    }),
    prisma.user.count({
      where: {
        OR: [{ role: "ADMIN" }, { role: null, isAdmin: true }],
      },
    }),
    prisma.branch.count({
      where: {
        isActive: true,
      },
    }),
    prisma.trainingMedia.count({
      where: {
        isActive: true,
      },
    }),
    getAutomaticSalesRanking(),
  ]);

  const cards: DashboardCard[] = [
    {
      label: "Usuarios activos",
      value: activeUsers.toString(),
      detail: "Cuentas habilitadas",
      icon: UserCheck,
    },
    {
      label: "Usuarios inactivos",
      value: inactiveUsers.toString(),
      detail: "Cuentas deshabilitadas",
      icon: UserX,
    },
    {
      label: "Total asesores",
      value: advisors.toString(),
      detail: "Usuarios con rol asesor",
      icon: UsersRound,
    },
    {
      label: "Total supervisores",
      value: supervisors.toString(),
      detail: "Usuarios con rol supervisor",
      icon: UsersRound,
    },
    {
      label: "Total admins",
      value: admins.toString(),
      detail: "Usuarios administradores",
      icon: ShieldCheck,
    },
    {
      label: "Sedes activas",
      value: activeBranches.toString(),
      detail: "Disponibles para asignacion",
      icon: Building2,
    },
    {
      label: "Promociones activas",
      value: promotionMetrics.active.toString(),
      detail: "Versionadas en codigo",
      icon: PackageCheck,
    },
    {
      label: "Promociones inactivas",
      value: promotionMetrics.inactive.toString(),
      detail: "Sin estado inactivo en codigo",
      icon: PackageCheck,
    },
    {
      label: "Media activa",
      value: activeMedia.toString(),
      detail: "Visible en entrenamiento",
      icon: FileVideo,
    },
    {
      label: "Asesores en ranking",
      value: automaticRanking.advisors.length.toString(),
      detail: "Con ventas instaladas",
      icon: BarChart3,
    },
  ];

  const topRanking = automaticRanking.advisors[0];
  const topSellerName = topRanking?.fullName ?? "Sin registros";
  const quickLinks = [
    {
      href: "/admin/sedes",
      label: "Sedes",
      icon: Building2,
    },
    {
      href: "/admin/usuarios",
      label: "Usuarios",
      icon: UserRound,
    },
    {
      href: "/admin/ventas",
      label: "Ventas",
      icon: ShoppingCart,
    },
    {
      href: "/admin/promociones",
      label: "Promociones",
      icon: PackageCheck,
    },
    {
      href: "/admin/ranking",
      label: "Ranking",
      icon: BarChart3,
    },
    {
      href: "/admin/media",
      label: "Entrenamiento",
      icon: FileVideo,
    },
  ];

  return (
    <AdminShell
      title="Resumen"
      description="Indicadores operativos reales de Claro OfferDesk."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard key={card.label} card={card} />
        ))}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-[0_20px_56px_rgba(0,0,0,0.18)]">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC]">
              <Trophy className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">
                Top vendedor actual
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
                {topSellerName}
              </h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            {topRanking
              ? `#1 con ${topRanking.installedSales} ventas instaladas.`
              : "Aún no hay ventas instaladas."}
          </p>
        </article>

        <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-[0_20px_56px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Accesos rapidos
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#111827]/55 p-4 text-sm font-semibold text-white transition hover:border-[#DA291C]/40 hover:bg-white/[0.08]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC]">
                  <item.icon className="h-5 w-5" />
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </article>
      </section>
    </AdminShell>
  );
}

type DashboardCard = {
  detail: string;
  icon: LucideIcon;
  label: string;
  value: string;
};

function MetricCard({ card }: { card: DashboardCard }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-[0_20px_56px_rgba(0,0,0,0.18)]">
      <span className="grid h-11 w-11 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC]">
        <card.icon className="h-5 w-5" />
      </span>
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">
        {card.label}
      </p>
      <p className="mt-2 text-4xl font-bold tracking-tight text-white">
        {card.value}
      </p>
      <p className="mt-2 text-sm text-slate-400">{card.detail}</p>
    </article>
  );
}
