import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-74px)] max-w-7xl place-items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur lg:grid-cols-[1fr_420px]">
        <div className="flex min-h-[420px] flex-col justify-between border-b border-white/10 bg-[#111827]/70 p-6 lg:border-b-0 lg:border-r lg:p-8">
          <div>
            <span className="inline-flex h-9 items-center rounded-md border border-[#DA291C]/35 bg-[#DA291C]/12 px-3 text-sm font-semibold text-[#FFB4AC]">
              Claro OfferDesk
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Acceso interno para asesores Claro
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">
              Ingresa con tus credenciales asignadas para consultar herramientas
              comerciales, capacitaciones y paneles operativos.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Promociones", "Top ventas", "Capacitación"].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-3"
              >
                <p className="text-sm font-semibold text-white">{item}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Disponible para asesores
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 text-[#111827] sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#DA291C]">
                Login
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Bienvenido
              </h2>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-md bg-[#DA291C]/10 text-[#DA291C]">
              <ShieldCheck className="h-5 w-5" />
            </span>
          </div>

          <form className="grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Correo
              <span className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="email"
                  autoComplete="off"
                  placeholder="asesor@claro.pe"
                  className="h-11 border-slate-200 bg-slate-50 pl-9 text-[#111827]"
                />
              </span>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Contraseña
              <span className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="password"
                  autoComplete="off"
                  placeholder="Ingresa tu contraseña"
                  className="h-11 border-slate-200 bg-slate-50 pl-9 text-[#111827]"
                />
              </span>
            </label>

            <Button
              type="button"
              className="mt-2 h-11 bg-[#DA291C] text-white shadow-[0_12px_26px_rgba(218,41,28,0.24)] hover:bg-[#B91F15]"
            >
              Ingresar
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Acceso interno para asesores autorizados
          </p>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium leading-6 text-slate-600">
              La validación de credenciales se activará en la siguiente fase.
            </p>
          </div>

          <Link
            href="/"
            className="mt-5 inline-flex text-sm font-semibold text-[#DA291C] hover:text-[#B91F15]"
          >
            Volver a promociones
          </Link>
        </div>
      </section>
    </main>
  );
}
