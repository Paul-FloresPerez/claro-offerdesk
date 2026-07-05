import {
  BarChart3,
  Database,
  FileVideo,
  LayoutDashboard,
  PackageCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const adminLinks = [
  {
    href: "/admin",
    label: "Resumen",
    description: "Vista general",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/usuarios",
    label: "Usuarios",
    description: "Asesores y permisos",
    icon: UsersRound,
  },
  {
    href: "/admin/ranking",
    label: "Ranking",
    description: "Ventas destacadas",
    icon: BarChart3,
  },
  {
    href: "/admin/promociones",
    label: "Promociones",
    description: "Catalogo comercial",
    icon: PackageCheck,
  },
  {
    href: "/admin/media",
    label: "Media",
    description: "Audios y videos",
    icon: FileVideo,
  },
];

type AdminShellProps = {
  title: string;
  description: string;
  statusBadge?: ReactNode;
  children: ReactNode;
};

export default function AdminShell({
  title,
  description,
  statusBadge,
  children,
}: AdminShellProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-9">
      <section className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
            Panel administrador
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            {description}
          </p>
        </div>
        {statusBadge ?? <PendingDatabaseBadge />}
      </section>

      <nav
        aria-label="Administración"
        className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        {adminLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-white/10 bg-white/[0.06] p-4 transition hover:border-[#DA291C]/40 hover:bg-white/[0.09]"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC]">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </nav>

      {children}
    </main>
  );
}

export function PendingDatabaseBadge() {
  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#DA291C]/30 bg-[#DA291C]/12 px-4 py-3 text-sm font-semibold text-[#FFB4AC]">
      <Database className="h-4 w-4" />
      Pendiente de conectar a base de datos
    </span>
  );
}
