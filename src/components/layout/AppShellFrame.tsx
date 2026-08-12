"use client";

import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { UserMenu } from "@/components/layout/UserMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  isNavigationItemActive,
  isNavigationNodeActive,
  navigationByRole,
  type NavigationGroup,
  type NavigationItem,
  type NavigationNode,
} from "@/lib/navigation";
import type { UserRoleValue } from "@/lib/roles";
import { cn } from "@/lib/utils";

export type AppShellUser = {
  name: string | null;
  email: string | null;
  image: string | null;
  isAdmin: boolean;
  role: UserRoleValue;
  branchId: string | null;
  branchName: string | null;
  mustChangePassword: boolean;
};

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

  const navigation = shouldLimitNavigation ? [] : navigationByRole[user.role];

  return (
    <div className="flex min-h-screen flex-col bg-[#111827] text-[#F9FAFB]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1120] shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6">
          <MobileNavigation
            navigation={navigation}
            pathname={pathname}
            userRole={user.role}
          />

          <Link
            href={shouldLimitNavigation ? "/cambiar-contrasena" : "/"}
            className="flex min-w-0 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8D83]"
          >
            <ClaroLogoMark />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-bold text-white sm:text-base">
                <span className="text-[#FF4A3D]">Claro</span> OfferDesk
              </span>
              <span className="hidden text-[10px] text-slate-400 sm:block">
                Distribuido por <span className="font-semibold text-cyan-300">WITLINK</span>
              </span>
            </span>
          </Link>

          {shouldLimitNavigation ? (
            <span className="ml-auto hidden rounded-lg border border-[#DA291C]/30 bg-[#DA291C]/10 px-3 py-2 text-xs font-semibold text-[#FFB4AC] sm:inline-flex">
              Cambio de contraseña requerido
            </span>
          ) : (
            <DesktopNavigation navigation={navigation} pathname={pathname} />
          )}

          <div className="ml-auto shrink-0 xl:ml-0">
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      <main className="relative flex-1">{children}</main>
      <footer className="border-t border-white/10 bg-[#0B1120]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 text-[11px] text-slate-500 sm:px-6">
          <span>Claro OfferDesk</span>
          <span>Soporte comercial WITLINK</span>
        </div>
      </footer>
    </div>
  );
}

function DesktopNavigation({
  navigation,
  pathname,
}: {
  navigation: readonly NavigationNode[];
  pathname: string;
}) {
  return (
    <nav className="ml-auto hidden h-full items-center gap-0.5 lg:flex" aria-label="Principal">
      {navigation.map((node) =>
        node.kind === "group" ? (
          <DesktopNavigationGroup key={node.id} group={node} pathname={pathname} />
        ) : (
          <NavigationLink
            key={node.id}
            item={node}
            pathname={pathname}
            className="h-full rounded-none border-b-2 border-transparent px-3"
          />
        )
      )}
    </nav>
  );
}

function DesktopNavigationGroup({
  group,
  pathname,
}: {
  group: NavigationGroup;
  pathname: string;
}) {
  const isActive = isNavigationNodeActive(group, pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "inline-flex h-full items-center gap-2 rounded-none border-b-2 border-transparent px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8D83]",
            isActive
              ? "border-[#DA291C] bg-white/[0.055] text-white"
              : "text-slate-300 hover:bg-white/[0.055] hover:text-white"
          )}
        >
          <group.icon
            aria-hidden="true"
            className={cn("size-4", isActive ? "text-[#FF5145]" : "text-slate-400")}
          />
          {group.label}
          <ChevronDown aria-hidden="true" className="size-3.5 text-slate-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-64 border border-slate-700 bg-[#111827] p-1.5 text-white shadow-xl"
      >
        <DropdownMenuGroup>
          {group.items.map((item) => {
            const itemIsActive = isNavigationItemActive(item, pathname);

            return (
              <DropdownMenuItem
                asChild
                key={item.id}
                className="min-h-11 cursor-pointer rounded-lg p-0 focus:bg-white/[0.08] focus:text-white"
              >
                <Link
                  href={item.href}
                  aria-current={itemIsActive ? "page" : undefined}
                  className="flex w-full items-center gap-3 px-3 py-2.5"
                >
                  <item.icon
                    aria-hidden="true"
                    className={cn(
                      "size-4",
                      itemIsActive ? "text-[#FF5145]" : "text-slate-400"
                    )}
                  />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNavigation({
  navigation,
  pathname,
  userRole,
}: {
  navigation: readonly NavigationNode[];
  pathname: string;
  userRole: UserRoleValue;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.055] text-slate-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8D83] lg:hidden"
          aria-label="Abrir navegación"
        >
          <Menu className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(22rem,88vw)] border-slate-800 bg-[#0B1120] p-0 text-white">
        <SheetHeader className="border-b border-white/10 px-5 py-5 text-left">
          <SheetTitle className="text-base font-bold text-white">Claro OfferDesk</SheetTitle>
          <SheetDescription className="text-slate-400">
            Menú de {getRoleMenuLabel(userRole)}
          </SheetDescription>
        </SheetHeader>
        <nav className="grid gap-1 p-3" aria-label="Principal móvil">
          {navigation.map((node) =>
            node.kind === "group" ? (
              <MobileNavigationGroup key={node.id} group={node} pathname={pathname} />
            ) : (
              <SheetClose asChild key={node.id}>
                <NavigationLink
                  item={node}
                  pathname={pathname}
                  className="h-12 rounded-lg px-3"
                />
              </SheetClose>
            )
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function MobileNavigationGroup({
  group,
  pathname,
}: {
  group: NavigationGroup;
  pathname: string;
}) {
  return (
    <section className="mt-2 border-t border-white/10 pt-2 first:mt-0 first:border-t-0 first:pt-0">
      <p className="flex h-9 items-center gap-2 px-3 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
        <group.icon aria-hidden="true" className="size-4" />
        {group.label}
      </p>
      <div className="grid gap-1">
        {group.items.map((item) => (
          <SheetClose asChild key={item.id}>
            <NavigationLink
              item={item}
              pathname={pathname}
              useFullLabel
              className="h-12 rounded-lg px-3 pl-7"
            />
          </SheetClose>
        ))}
      </div>
    </section>
  );
}

function NavigationLink({
  item,
  pathname,
  className,
  useFullLabel = false,
}: {
  item: NavigationItem;
  pathname: string;
  className?: string;
  useFullLabel?: boolean;
}) {
  const isActive = isNavigationItemActive(item, pathname);

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8D83]",
        isActive
          ? "border-[#DA291C] bg-white/[0.055] text-white"
          : "text-slate-300 hover:bg-white/[0.055] hover:text-white",
        className
      )}
    >
      <item.icon
        aria-hidden="true"
        className={cn("size-4", isActive ? "text-[#FF5145]" : "text-slate-400")}
      />
      {useFullLabel ? item.label : item.shortLabel ?? item.label}
    </Link>
  );
}

function ClaroLogoMark() {
  return (
    <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/15 bg-white p-0.5">
      <Image
        src="/login/claro-login.jpg"
        alt=""
        width={36}
        height={36}
        className="size-full rounded-[0.4rem] object-contain"
      />
    </span>
  );
}

function getRoleMenuLabel(role: UserRoleValue) {
  if (role === "ADMIN") return "administración";
  if (role === "SUPERVISOR") return "supervisión";
  return "asesor";
}
