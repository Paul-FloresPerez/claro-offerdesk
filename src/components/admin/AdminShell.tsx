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
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <section className="mb-5 flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-emphasis">
            Panel administrador
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
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
    <span className="inline-flex h-10 w-fit items-center rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-3 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
      Datos reales
    </span>
  );
}
