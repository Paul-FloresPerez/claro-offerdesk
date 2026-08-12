"use client";

import {
  BarChart3,
  Building2,
  FileVideo,
  LayoutDashboard,
  PackageCheck,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuarios", icon: UsersRound },
  { href: "/admin/sedes", label: "Sedes", icon: Building2 },
  { href: "/admin/ventas", label: "Ventas", icon: ShoppingCart },
  { href: "/admin/ranking", label: "Ranking", icon: BarChart3 },
  { href: "/admin/promociones", label: "Promociones", icon: PackageCheck },
  { href: "/admin/media", label: "Media", icon: FileVideo },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Administración"
      className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-7"
    >
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
              "flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C]/60",
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
