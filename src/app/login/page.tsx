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

  const hasLoginBackground = existsSync(
    join(process.cwd(), "public", "login", "clarofondo-login.jpg")
  );
  const hasWitlinkLogo = existsSync(
    join(process.cwd(), "public", "login", "empresa-login.jpg")
  );

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      {hasLoginBackground ? (
        <img
          src="/login/clarofondo-login.jpg"
          alt="Claro"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fafc_0%,#fee2e2_46%,#e2e8f0_100%)] dark:bg-[linear-gradient(135deg,#160B0E_0%,#3A0F13_46%,#0B1120_100%)]" />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(218,41,28,0.10),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.10),rgba(91,15,20,0.18)_44%,rgba(2,6,23,0.44))]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#090D18]/78 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/[0.10] to-transparent" />

      <section className="relative z-10 w-full max-w-[440px]">
        <div className="rounded-2xl border border-border bg-card/95 p-6 text-card-foreground shadow-2xl ring-1 ring-foreground/5 backdrop-blur-xl sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-6 flex h-20 w-full max-w-[300px] items-center justify-center overflow-hidden rounded-2xl bg-white px-6 py-3 shadow-sm ring-1 ring-border">
              {hasWitlinkLogo ? (
                <img
                  src="/login/empresa-login.jpg"
                  alt="WITLINK"
                  className="block h-auto max-h-full w-auto max-w-full object-contain"
                />
              ) : null}
            </div>
            <p className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-emphasis">
              Claro OfferDesk
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Acceso interno
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Consola comercial para asesores autorizados
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 border-t border-border pt-5 text-center text-xs leading-5 text-muted-foreground">
            Acceso exclusivo para personal autorizado.
          </p>
        </div>
      </section>
    </main>
  );
}
