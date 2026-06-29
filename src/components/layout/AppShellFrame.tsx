"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SignOutButton } from "@/components/auth/SignOutButton";

export type AppShellUser = {
  name: string | null;
  email: string | null;
  isAdmin: boolean;
};

const navigation = [
  { href: "/", label: "Inicio" },
  { href: "/ofertas", label: "Promociones" },
  { href: "/guion", label: "Guion Comercial" },
  { href: "/objeciones", label: "Objeciones" },
  { href: "/top-ventas", label: "Top ventas" },
  { href: "/capacitacion", label: "Entrenamiento" },
];

export function AppShellFrame({
  children,
  user,
}: {
  children: ReactNode;
  user: AppShellUser | null;
}) {
  const pathname = usePathname();

  if (!user || pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#111827] text-[#F9FAFB]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#111827]/92 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-[#DA291C] text-sm font-black text-white shadow-[0_10px_22px_rgba(218,41,28,0.35)] ring-1 ring-white/10">
              C
            </span>
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
            <nav
              className="flex gap-1 overflow-x-auto pb-1 xl:pb-0"
              aria-label="Principal"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex h-10 shrink-0 items-center rounded-lg px-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {user.isAdmin ? (
                <Link
                  href="/admin"
                  className="inline-flex h-9 items-center rounded-md border border-[#DA291C]/30 bg-[#DA291C]/12 px-3 text-sm font-semibold text-[#FFB4AC] transition hover:bg-[#DA291C]/18"
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
    </div>
  );
}
