"use client";

import {
  BarChart3,
  FileVideo,
  PackageCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin/ranking", label: "Ranking", icon: BarChart3 },
  { href: "/admin/promociones", label: "Promociones", icon: PackageCheck },
  { href: "/admin/media", label: "Media", icon: FileVideo },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Administración de contenido"
      className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] p-2"
    >
      <span className="px-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
        Contenido
      </span>
      {adminLinks.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C]/60",
              isActive
                ? "border-[#DA291C]/45 bg-[#DA291C]/15 text-white"
                : "border-white/10 bg-white/[0.05] text-slate-300 hover:border-white/20 hover:bg-white/[0.09] hover:text-white"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0 text-[#FFB4AC]" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
