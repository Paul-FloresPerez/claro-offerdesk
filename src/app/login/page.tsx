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
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#F8FAFC] px-4 py-8 text-[#111827] sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF7F6_46%,#F1F5F9_100%)]" />
      {hasClaroImage ? (
        <div className="absolute inset-0 flex items-center justify-center px-6 py-10 sm:px-10">
          <img
            src="/login/claro-login.jpg"
            alt="Claro"
            className="h-auto max-h-[68vh] w-[86vw] max-w-[680px] object-contain opacity-95 drop-shadow-[0_26px_60px_rgba(218,41,28,0.16)]"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF1EF_46%,#F1F5F9_100%)]" />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(218,41,28,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.36),rgba(255,247,246,0.32)_46%,rgba(15,23,42,0.18))]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white/70 to-transparent" />

      <section className="relative z-10 w-full max-w-[440px]">
        <div className="rounded-2xl border border-white/[0.72] bg-white/[0.94] p-6 shadow-[0_28px_80px_rgba(15,23,42,0.26)] ring-1 ring-slate-900/[0.04] backdrop-blur-xl sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-6 grid h-20 w-64 max-w-full place-items-center rounded-2xl border border-slate-200/80 bg-white px-5 shadow-[0_16px_34px_rgba(15,23,42,0.10)]">
              {hasWitlinkLogo ? (
                <img
                  src="/login/empresa-login.jpg"
                  alt="WITLINK"
                  className="max-h-14 w-full object-contain"
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
