import { existsSync } from "fs";
import { join } from "path";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const params = await searchParams;
  const hasCallbackUrl = Boolean(getParam(params.callbackUrl));

  if (session?.user && !hasCallbackUrl) {
    redirect("/");
  }

  const hasLoginImage = existsSync(
    join(process.cwd(), "public", "login", "empresa-login.jpg")
  );

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0B1120] px-4 py-8 text-[#111827] sm:px-6 lg:px-8">
      {hasLoginImage ? (
        <img
          src="/login/empresa-login.jpg"
          alt="WITLINK"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0B1120_0%,#111827_48%,#5A151B_100%)]" />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(218,41,28,0.22),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.68),rgba(2,6,23,0.88))]" />

      <section className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-white/40 bg-white/90 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-8">
          <div className="mb-7 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#DA291C] text-lg font-black text-white shadow-[0_16px_34px_rgba(218,41,28,0.28)]">
              C
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#DA291C]">
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

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Acceso exclusivo para personal autorizado.
          </p>
        </div>
      </section>
    </main>
  );
}

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
