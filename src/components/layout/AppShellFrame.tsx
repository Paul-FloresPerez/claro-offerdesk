"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { cn } from "@/lib/utils";

export type AppShellUser = {
  name: string | null;
  email: string | null;
  isAdmin: boolean;
  mustChangePassword: boolean;
};

const navigation = [
  { href: "/", label: "Inicio", match: ["/"] },
  { href: "/promociones", label: "Promociones", match: ["/promociones", "/ofertas"] },
  { href: "/guion", label: "Guion Comercial", match: ["/guion"] },
  { href: "/objeciones", label: "Objeciones", match: ["/objeciones"] },
  { href: "/top-ventas", label: "Top ventas", match: ["/top-ventas"] },
  {
    href: "/entrenamiento",
    label: "Entrenamiento",
    match: ["/entrenamiento", "/capacitacion"],
  },
];

export function AppShellFrame({
  children,
  user,
}: {
  children: ReactNode;
  user: AppShellUser | null;
}) {
  const pathname = usePathname();
  const isPasswordChangeRoute = pathname === "/cambiar-contrasena";
  const shouldLimitNavigation = user?.mustChangePassword || isPasswordChangeRoute;

  if (!user || pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#111827] text-[#F9FAFB]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1120]/90 shadow-[0_14px_34px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
          <Link
            href={shouldLimitNavigation ? "/cambiar-contrasena" : "/"}
            className="flex items-center gap-3"
          >
            <ClaroLogoMark />
            <span>
              <span className="block text-base font-semibold leading-5 text-white">
                Claro OfferDesk
              </span>
              <span className="block text-xs text-slate-300">
                Consola comercial para asesores
              </span>
            </span>
          </Link>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            {shouldLimitNavigation ? (
              <span className="inline-flex h-9 w-fit items-center rounded-md border border-[#DA291C]/25 bg-[#DA291C]/12 px-3 text-sm font-semibold text-[#FFB4AC]">
                Cambio de contrasena requerido
              </span>
            ) : (
              <nav
                className="flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.045] p-1 shadow-inner shadow-black/10 xl:pb-1"
                aria-label="Principal"
              >
                {navigation.map((item) => {
                  const isActive = item.match.some((route) =>
                    route === "/"
                      ? pathname === "/"
                      : pathname === route || pathname.startsWith(`${route}/`)
                  );

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "inline-flex h-9 shrink-0 items-center rounded-lg px-3 text-sm font-semibold transition hover:bg-white/10 hover:text-white",
                        isActive
                          ? "bg-white/[0.12] text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
                          : "text-slate-300"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] p-1.5">
              {user.isAdmin && !shouldLimitNavigation ? (
                <Link
                  href="/admin"
                  className="inline-flex h-9 items-center rounded-md border border-[#DA291C]/30 bg-[#DA291C]/12 px-3 text-sm font-semibold text-[#FFB4AC] transition hover:border-[#DA291C]/45 hover:bg-[#DA291C]/18"
                >
                  Panel admin
                </Link>
              ) : null}

              <span className="hidden max-w-44 truncate text-sm font-medium text-slate-300 sm:inline">
                {user.name ?? user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">{children}</main>
      <footer className="border-t border-white/10 bg-[#0B1120]/72">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>Claro OfferDesk</span>
          <span className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-slate-400 shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
            <span>Distribuidor / soporte</span>
            <span className="relative grid h-10 w-44 place-items-center overflow-hidden rounded-full bg-white shadow-sm">
              <span className="absolute inset-0 grid place-items-center text-xs font-black tracking-[0.16em] text-slate-500">
                WITLINK
              </span>
              <img
                src="/login/empresa-login.jpg"
                alt="WITLINK"
                className="relative z-10 h-full w-full scale-[3.1] object-contain"
              />
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
}

function ClaroLogoMark() {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/[0.18] bg-white p-0.5 shadow-[0_12px_26px_rgba(218,41,28,0.24)] ring-1 ring-[#DA291C]/20">
      <img
        src="/login/claro-login.jpg"
        alt="Claro"
        className="h-full w-full rounded-[0.6rem] object-contain"
      />
    </span>
  );
}
