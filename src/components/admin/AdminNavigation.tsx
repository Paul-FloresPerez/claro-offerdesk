"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  adminContentNavigation,
  isNavigationItemActive,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Administración de contenido"
      className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-2"
    >
      <span className="px-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        Contenido
      </span>
      {adminContentNavigation.map((item) => {
        const isActive = isNavigationItemActive(item, pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
              isActive
                ? "border-primary/45 bg-primary/15 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0 text-brand-emphasis" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
