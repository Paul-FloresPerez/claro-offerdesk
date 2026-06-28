import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export default async function DbTestPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/db-test");
  }

  if (!session.user.isAdmin) {
    redirect("/");
  }

  await connection();

  let result:
    | {
        ok: true;
        userCount: number;
        users: Array<{
          email: string;
          fullName: string;
          isAdmin: boolean;
        }>;
      }
    | {
        ok: false;
        message: string;
      };

  try {
    const [userCount, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          email: true,
          fullName: true,
          isAdmin: true,
        },
        take: 20,
      }),
    ]);

    result = {
      ok: true,
      userCount,
      users,
    };
  } catch {
    result = {
      ok: false,
      message:
        "No se pudo consultar la base de datos. Revisa DATABASE_URL y DIRECT_URL en el entorno del servidor.",
    };
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <section className="rounded-xl border border-white/10 bg-white/[0.07] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)]">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FFB4AC]">
          Neon PostgreSQL
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Prueba temporal de base de datos
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
          Esta vista valida lectura de usuarios para el futuro login. No muestra
          contraseñas ni hashes.
        </p>
      </section>

      <section className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.07]">
        {result.ok ? (
          <>
            <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  Usuarios detectados
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Total: {result.userCount}
                </p>
              </div>
              <span className="inline-flex w-fit rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200">
                Conexión OK
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-[#111827]/70 text-xs uppercase tracking-[0.12em] text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Nombre</th>
                    <th className="px-5 py-3">Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {result.users.map((user) => (
                    <tr key={user.email} className="text-slate-200">
                      <td className="px-5 py-4 font-medium text-white">
                        {user.email}
                      </td>
                      <td className="px-5 py-4">{user.fullName}</td>
                      <td className="px-5 py-4">
                        {user.isAdmin ? "Sí" : "No"}
                      </td>
                    </tr>
                  ))}
                  {result.users.length === 0 ? (
                    <tr>
                      <td className="px-5 py-4 text-slate-300" colSpan={3}>
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-5">
            <span className="inline-flex rounded-md border border-[#DA291C]/30 bg-[#DA291C]/12 px-3 py-2 text-xs font-semibold text-[#FFB4AC]">
              Conexión pendiente
            </span>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              {result.message}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
