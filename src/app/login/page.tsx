import { existsSync } from "fs";
import { join } from "path";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  const hasClaroImage = existsSync(
    join(process.cwd(), "public", "login", "claro-login.jpg")
  );
  const hasWitlinkLogo = existsSync(
    join(process.cwd(), "public", "login", "empresa-login.jpg")
  );

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#090D18] px-4 py-8 text-[#111827] sm:px-6 lg:px-8">
      {hasClaroImage ? (
        <img
          src="/login/claro-login.jpg"
          alt="Claro"
          className="absolute inset-0 h-full w-full scale-110 object-contain opacity-95"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#090D18_0%,#111827_46%,#5A151B_100%)]" />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(218,41,28,0.30),transparent_34%),linear-gradient(135deg,rgba(2,6,23,0.54),rgba(91,15,20,0.50)_42%,rgba(2,6,23,0.86))]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#090D18] to-transparent" />

      <section className="relative z-10 w-full max-w-[440px]">
        <div className="rounded-2xl border border-white/[0.55] bg-white/[0.92] p-6 shadow-[0_32px_95px_rgba(0,0,0,0.48)] ring-1 ring-white/[0.45] backdrop-blur-xl sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-5 grid h-16 w-52 place-items-center rounded-xl border border-slate-200/80 bg-white px-4 shadow-sm">
              {hasWitlinkLogo ? (
                <img
                  src="/login/empresa-login.jpg"
                  alt="WITLINK"
                  className="max-h-11 w-full object-contain"
                />
              ) : (
                <span className="text-lg font-black tracking-[0.18em] text-slate-700">
                  WITLINK
                </span>
              )}
            </div>
            <p className="inline-flex rounded-full border border-[#DA291C]/20 bg-[#DA291C]/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#B91F15]">
              Claro OfferDesk
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">
              Acceso interno
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Consola comercial para asesores autorizados
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 border-t border-slate-200 pt-5 text-center text-xs leading-5 text-slate-500">
            Acceso exclusivo para personal autorizado.
          </p>
        </div>
      </section>
    </main>
  );
}
