import {
  FileText,
  GraduationCap,
  MessagesSquare,
  PackageCheck,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Inicio", icon: GraduationCap },
  { href: "/ofertas", label: "Promociones", icon: PackageCheck },
  { href: "/guion", label: "Guion Comercial", icon: FileText },
  { href: "/objeciones", label: "Objeciones", icon: MessagesSquare },
  { href: "/top-ventas", label: "Top ventas", icon: Trophy },
  { href: "/capacitacion", label: "Entrenamiento", icon: GraduationCap },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#111827] text-[#F9FAFB]">
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
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
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
