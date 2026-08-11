import { connection } from "next/server";
import AdminShell from "@/components/admin/AdminShell";
import BranchTable from "@/components/admin/BranchTable";
import { prisma } from "@/lib/prisma";
import { resolveUserRole } from "@/lib/roles";

export const runtime = "nodejs";

export default async function AdminBranchesPage() {
  await connection();

  const branches = await prisma.branch.findMany({
    orderBy: [{ isActive: "desc" }, { city: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      city: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      users: {
        select: {
          role: true,
          isAdmin: true,
          isActive: true,
        },
      },
    },
  });

  return (
    <AdminShell
      title="Sedes"
      description="Administra la estructura comercial multi-sede y su disponibilidad."
    >
      <BranchTable
        branches={branches.map((branch) => ({
          id: branch.id,
          name: branch.name,
          city: branch.city,
          isActive: branch.isActive,
          advisorCount: branch.users.filter(
            (user) => resolveUserRole(user.role, user.isAdmin) === "ADVISOR"
          ).length,
          supervisorCount: branch.users.filter(
            (user) =>
              resolveUserRole(user.role, user.isAdmin) === "SUPERVISOR"
          ).length,
          createdAt: branch.createdAt.toISOString(),
          updatedAt: branch.updatedAt.toISOString(),
        }))}
      />
    </AdminShell>
  );
}
