import { Database } from "lucide-react";
import { connection } from "next/server";
import AdminShell from "@/components/admin/AdminShell";
import UserTable from "@/components/admin/UserTable";
import { requireAdmin } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { resolveUserRole } from "@/lib/roles";

export const runtime = "nodejs";

export default async function AdminUsuariosPage() {
  await connection();

  const [{ user: currentUser }, users, branches] = await Promise.all([
    requireAdmin(),
    prisma.user.findMany({
      orderBy: [{ isActive: "desc" }, { fullName: "asc" }],
      select: {
        id: true,
        fullName: true,
        username: true,
        dni: true,
        email: true,
        branchName: true,
        branchId: true,
        branch: {
          select: { id: true, name: true, isActive: true },
        },
        role: true,
        photoUrl: true,
        isAdmin: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.branch.findMany({
      orderBy: [{ isActive: "desc" }, { city: "asc" }, { name: "asc" }],
      select: { id: true, name: true, city: true, isActive: true },
    }),
  ]);

  return (
    <AdminShell
      title="Usuarios"
      description="Gestiona cuentas, roles y asignacion de sede."
      statusBadge={<ConnectedUsersBadge />}
    >
      <UserTable
        currentUserId={currentUser.id}
        branches={branches}
        users={users.map((user) => ({
          ...user,
          role: resolveUserRole(user.role, user.isAdmin),
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        }))}
      />
    </AdminShell>
  );
}

function ConnectedUsersBadge() {
  return (
    <span className="inline-flex h-10 w-fit items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
      <Database className="h-4 w-4" />
      Datos conectados
    </span>
  );
}
