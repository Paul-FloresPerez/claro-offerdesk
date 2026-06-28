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
  const callbackUrl = getSafeCallbackUrl(getParam(params.callbackUrl));

  if (session?.user) {
    redirect(callbackUrl);
  }

  const hasLoginImage = existsSync(
    join(process.cwd(), "public", "login", "empresa-login.jpg")
  );

  return (
    <main className="mx-auto grid min-h-[calc(100vh-74px)] max-w-7xl place-items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_26px_78px_rgba(0,0,0,0.34)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[320px] overflow-hidden bg-[#111827] lg:min-h-[560px]">
          {hasLoginImage ? (
            <img
              src="/login/empresa-login.jpg"
              alt="Equipo Claro"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center bg-[linear-gradient(135deg,#111827_0%,#1F2937_55%,#5A151B_100%)] p-8">
              <div className="max-w-sm text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#DA291C] text-xl font-black text-white shadow-[0_16px_34px_rgba(218,41,28,0.30)]">
                  C
                </span>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#FFB4AC]">
                  Claro OfferDesk
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  Acceso interno
                </h1>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,39,0.10),rgba(17,24,39,0.72))]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FFB4AC]">
              Plataforma interna
            </p>
            <h1 className="mt-2 max-w-md text-3xl font-semibold tracking-tight">
              Herramientas comerciales para asesores Claro
            </h1>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-white p-6 text-[#111827] sm:p-8 lg:p-10">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#DA291C]">
              Iniciar sesión
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Bienvenido
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Acceso interno para asesores autorizados.
            </p>
          </div>

          <LoginForm callbackUrl={callbackUrl} />

          <p className="mt-6 text-xs leading-5 text-slate-400">
            Recuperación de contraseña próximamente.
          </p>
        </div>
      </section>
    </main>
  );
}

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getSafeCallbackUrl(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  if (value.startsWith("/login")) {
    return "/";
  }

  return value;
}
