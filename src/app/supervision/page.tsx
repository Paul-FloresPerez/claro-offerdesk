import { Building2, MapPin, UserCheck, UsersRound } from "lucide-react";
import { connection } from "next/server";
import { requireSupervisor } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export default async function SupervisionPage() {
  await connection();
  const { user, scope } = await requireSupervisor();

  const [activeAdvisors, totalAdvisors] = await Promise.all([
    prisma.user.count({
      where: {
        branchId: scope.branchId,
        isActive: true,
        OR: [{ role: "ADVISOR" }, { role: null, isAdmin: false }],
      },
    }),
    prisma.user.count({
      where: {
        branchId: scope.branchId,
        OR: [{ role: "ADVISOR" }, { role: null, isAdmin: false }],
      },
    }),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-9">
      <section className="border-b border-white/10 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
          Panel de supervisión
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {user.branch.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
          Gestión comercial de la sede. Esta fase no incorpora ventas, ranking ni
          gestión de usuarios.
        </p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          icon={Building2}
          label="Sede asignada"
          value={user.branch.name}
        />
        <SummaryCard
          icon={MapPin}
          label="Ciudad"
          value={user.branch.city}
        />
        <SummaryCard
          icon={UserCheck}
          label="Asesores activos"
          value={`${activeAdvisors} de ${totalAdvisors}`}
        />
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.07] p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC]">
            <UsersRound className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Alcance limitado a tu sede
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              La autorización se valida en servidor con el rol y la sede vigentes.
              Las funciones operativas para supervisores se incorporarán en fases
              posteriores.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
      <Icon className="h-5 w-5 text-[#FFB4AC]" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </article>
  );
}
