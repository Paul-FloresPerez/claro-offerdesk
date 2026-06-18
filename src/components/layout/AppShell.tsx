import {
  FileText,
  Home,
  ListChecks,
  MessagesSquare,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/ofertas", label: "Ofertas", icon: PackageCheck },
  { href: "/recomendador", label: "Recomendador", icon: Sparkles },
  { href: "/guion", label: "Guion", icon: FileText },
  { href: "/objeciones", label: "Objeciones", icon: MessagesSquare },
  { href: "/validaciones", label: "Validaciones", icon: ListChecks },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#111827] text-[#F9FAFB]">
      <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-[#DA291C]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-10 h-[28rem] w-[28rem] rounded-full border border-white/10 bg-[#DA291C]/5 blur-sm" />
      <div className="pointer-events-none absolute right-10 top-36 h-40 w-40 rounded-full border border-[#DA291C]/20" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#111827]/92 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
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

          <nav className="flex gap-1 overflow-x-auto pb-1 lg:pb-0" aria-label="Principal">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
