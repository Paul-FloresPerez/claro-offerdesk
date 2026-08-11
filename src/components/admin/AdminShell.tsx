import type { ReactNode } from "react";
import AdminNavigation from "@/components/admin/AdminNavigation";

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
        {statusBadge ?? <OperationalBadge />}
      </section>

      <AdminNavigation />

      {children}
    </main>
  );
}

export function OperationalBadge() {
  return (
    <span className="inline-flex w-fit rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
      Datos reales
    </span>
  );
}
