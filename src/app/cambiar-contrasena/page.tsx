import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export default async function CambiarContrasenaPage() {
  await connection();

  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/cambiar-contrasena");
  }

  if (!session.user.mustChangePassword) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      fullName: true,
      username: true,
      isActive: true,
    },
  });

  if (!user?.isActive) {
    redirect("/login");
  }

  return (
    <main className="relative min-h-[calc(100vh-74px)]">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(17,24,39,0.98)_0%,rgba(29,37,53,0.94)_50%,rgba(64,17,22,0.70)_100%)]" />
      <section className="mx-auto flex min-h-[calc(100vh-74px)] max-w-7xl items-center px-4 py-8 sm:px-6 lg:py-10">
        <ChangePasswordForm
          fullName={user.fullName}
          identifier={user.username}
        />
      </section>
    </main>
  );
}
