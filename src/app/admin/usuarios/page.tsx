import { connection } from "next/server";
import { Database } from "lucide-react";
import { auth } from "@/auth";
import AdminShell from "@/components/admin/AdminShell";
import UserForm from "@/components/admin/UserForm";
import UserTable from "@/components/admin/UserTable";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export default async function AdminUsuariosPage() {
  await connection();

  const session = await auth();
  const users = await prisma.user.findMany({
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
      username: true,
      dni: true,
      email: true,
      branchName: true,
      photoUrl: true,
      isAdmin: true,
      isActive: true,
      mustChangePassword: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <AdminShell
      title="Usuarios"
      description="Gestiona asesores autorizados, permisos y estado de acceso."
      statusBadge={<ConnectedUsersBadge />}
    >
      <div className="grid gap-5">
        <UserForm />
        <UserTable
          currentUserId={session?.user.id ?? ""}
          users={users.map((user) => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          }))}
        />
      </div>
    </AdminShell>
  );
}

function ConnectedUsersBadge() {
  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">
      <Database className="h-4 w-4" />
      Conectado a Neon
    </span>
  );
}
