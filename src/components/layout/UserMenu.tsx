"use client";

import {
  Building2,
  ChevronDown,
  KeyRound,
  LogOut,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { AppShellUser } from "@/components/layout/AppShellFrame";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { USER_ROLE_LABELS } from "@/lib/roles";
import {
  isAppTheme,
  THEME_STORAGE_KEY,
  type AppTheme,
} from "@/lib/theme";

const THEME_CHANGE_EVENT = "claro-offerdesk-theme-change";

export function UserMenu({ user }: { user: AppShellUser }) {
  const label = user.name ?? user.email ?? "Usuario";
  const initials = getInitials(label);
  const branchLabel =
    user.branchName ?? (user.branchId ? "Sede asignada" : "Acceso global");
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-surface px-1.5 pr-2 text-left text-foreground transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Abrir menú de ${label}`}
        >
          <Avatar size="lg" className="size-8 bg-primary/15 ring-1 ring-border">
            {user.image ? <AvatarImage src={user.image} alt="" /> : null}
            <AvatarFallback className="bg-primary/15 text-xs font-bold text-brand-emphasis">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden min-w-0 max-w-28 2xl:block">
            <span className="block truncate text-xs font-semibold text-foreground">
              {label}
            </span>
            <span className="block text-[11px] text-muted-foreground">
              {USER_ROLE_LABELS[user.role]}
            </span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground transition group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(21rem,calc(100vw-2rem))] rounded-xl border-border p-1.5 shadow-xl"
      >
        <DropdownMenuLabel className="p-3 font-normal">
          <span className="flex items-center gap-3">
            <Avatar size="lg" className="size-11 bg-primary/10">
              {user.image ? <AvatarImage src={user.image} alt="" /> : null}
              <AvatarFallback className="bg-primary/10 font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">
                {label}
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </span>
          </span>
        </DropdownMenuLabel>

        <div className="mx-2 mb-2 grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted p-2.5 text-xs">
          <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
            <UserRound className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">{USER_ROLE_LABELS[user.role]}</span>
          </span>
          <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
            <Building2 className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">{branchLabel}</span>
          </span>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="px-3 pb-1 pt-2 text-[0.7rem] font-bold uppercase tracking-[0.12em]">
          Apariencia
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            if (isAppTheme(value)) setTheme(value);
          }}
          className="grid grid-cols-2 gap-1 px-1 pb-1"
        >
          <DropdownMenuRadioItem value="light" className="min-h-11 rounded-lg pr-7">
            <Sun />
            Claro
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="min-h-11 rounded-lg pr-7">
            <Moon />
            Oscuro
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="min-h-11 cursor-pointer rounded-lg px-3">
            <Link href="/cambiar-contrasena">
              <KeyRound />
              Cambiar contraseña
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="min-h-11 cursor-pointer rounded-lg px-3"
            onSelect={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getServerThemeSnapshot(): AppTheme {
  return "dark";
}

function getThemeSnapshot(): AppTheme {
  const currentTheme = document.documentElement.dataset.theme;

  return isAppTheme(currentTheme) ? currentTheme : "dark";
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
}

function setTheme(theme: AppTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The preference still applies for the current tab.
  }

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function getInitials(value: string) {
  return (
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}
