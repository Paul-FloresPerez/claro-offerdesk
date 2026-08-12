"use client";

import {
  Building2,
  ChevronDown,
  KeyRound,
  LogOut,
  UserRound,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { USER_ROLE_LABELS } from "@/lib/roles";
import type { AppShellUser } from "@/components/layout/AppShellFrame";

export function UserMenu({ user }: { user: AppShellUser }) {
  const label = user.name ?? user.email ?? "Usuario";
  const initials = getInitials(label);
  const branchLabel = user.branchName ?? (user.branchId ? "Sede asignada" : "Acceso global");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-1.5 pr-2 text-left text-white transition hover:border-white/20 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8D83]"
          aria-label={`Abrir menú de ${label}`}
        >
          <Avatar size="lg" className="size-8 bg-[#DA291C]/18 ring-1 ring-white/15">
            {user.image ? <AvatarImage src={user.image} alt="" /> : null}
            <AvatarFallback className="bg-[#DA291C]/18 text-xs font-bold text-[#FFB4AC]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden min-w-0 max-w-28 2xl:block">
            <span className="block truncate text-xs font-semibold text-white">{label}</span>
            <span className="block text-[11px] text-slate-400">
              {USER_ROLE_LABELS[user.role]}
            </span>
          </span>
          <ChevronDown className="size-4 text-slate-400 transition group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(21rem,calc(100vw-2rem))] rounded-xl border-slate-200 p-1.5 shadow-[0_18px_55px_rgba(2,6,23,0.28)]"
      >
        <DropdownMenuLabel className="p-3 font-normal">
          <span className="flex items-center gap-3">
            <Avatar size="lg" className="size-11 bg-red-50">
              {user.image ? <AvatarImage src={user.image} alt="" /> : null}
              <AvatarFallback className="bg-red-50 font-bold text-[#DA291C]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-950">{label}</span>
              <span className="mt-0.5 block truncate text-xs text-slate-500">
                {user.email}
              </span>
            </span>
          </span>
        </DropdownMenuLabel>

        <div className="mx-2 mb-2 grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs">
          <span className="flex min-w-0 items-center gap-2 text-slate-600">
            <UserRound className="size-3.5 shrink-0 text-[#DA291C]" />
            <span className="truncate">{USER_ROLE_LABELS[user.role]}</span>
          </span>
          <span className="flex min-w-0 items-center gap-2 text-slate-600">
            <Building2 className="size-3.5 shrink-0 text-[#DA291C]" />
            <span className="truncate">{branchLabel}</span>
          </span>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="h-10 cursor-pointer rounded-lg px-3 focus:bg-slate-100 focus:text-slate-950">
          <Link href="/cambiar-contrasena">
            <KeyRound />
            Cambiar contraseña
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="h-10 cursor-pointer rounded-lg px-3"
          onSelect={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}
