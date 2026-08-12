import {
  BarChart3,
  BookOpenText,
  Building2,
  FileVideo,
  GraduationCap,
  Home,
  LayoutDashboard,
  PackageCheck,
  ShoppingCart,
  Trophy,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { UserRoleValue } from "@/lib/roles";

export type NavigationItem = {
  kind: "item";
  id: string;
  href: string;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  match: readonly string[];
  exact?: boolean;
};

export type NavigationGroup = {
  kind: "group";
  id: string;
  label: string;
  icon: LucideIcon;
  items: readonly NavigationItem[];
};

export type NavigationNode = NavigationItem | NavigationGroup;

export type QuickLink = NavigationItem & {
  description: string;
};

export const navigationItems = {
  home: item("home", "/", "Inicio", Home, ["/"]),
  promotions: item(
    "promotions",
    "/promociones",
    "Promociones",
    PackageCheck,
    ["/promociones", "/ofertas"]
  ),
  script: item(
    "script",
    "/guion",
    "Guion y objeciones",
    BookOpenText,
    ["/guion", "/objeciones"],
    "Guion"
  ),
  training: item(
    "training",
    "/entrenamiento",
    "Entrenamiento",
    GraduationCap,
    ["/entrenamiento", "/capacitacion"]
  ),
  mySales: item(
    "my-sales",
    "/mis-ventas",
    "Mis ventas",
    ShoppingCart,
    ["/mis-ventas"]
  ),
  supervisionOperation: item(
    "supervision-operation",
    "/supervision",
    "Operación",
    ShoppingCart,
    ["/supervision"],
    undefined,
    true
  ),
  supervisionDashboard: item(
    "supervision-dashboard",
    "/supervision/dashboard",
    "Dashboard",
    BarChart3,
    ["/supervision/dashboard"]
  ),
  ranking: item(
    "ranking",
    "/top-ventas",
    "Top ventas",
    Trophy,
    ["/top-ventas"],
    "Top"
  ),
  adminDashboard: item(
    "admin-dashboard",
    "/admin",
    "Dashboard",
    LayoutDashboard,
    ["/admin"]
  ),
  adminSales: item(
    "admin-sales",
    "/admin/ventas",
    "Ventas",
    ShoppingCart,
    ["/admin/ventas"]
  ),
  adminUsers: item(
    "admin-users",
    "/admin/usuarios",
    "Usuarios",
    UsersRound,
    ["/admin/usuarios"]
  ),
  adminBranches: item(
    "admin-branches",
    "/admin/sedes",
    "Sedes",
    Building2,
    ["/admin/sedes"]
  ),
  adminContent: item(
    "admin-content",
    "/admin/ranking",
    "Contenido",
    FileVideo,
    ["/admin/ranking", "/admin/promociones", "/admin/media"]
  ),
  adminRanking: item(
    "admin-ranking",
    "/admin/ranking",
    "Ranking",
    BarChart3,
    ["/admin/ranking"]
  ),
  adminPromotions: item(
    "admin-promotions",
    "/admin/promociones",
    "Promociones",
    PackageCheck,
    ["/admin/promociones"]
  ),
  adminMedia: item(
    "admin-media",
    "/admin/media",
    "Media",
    FileVideo,
    ["/admin/media"]
  ),
  recommender: item(
    "recommender",
    "/recomendador",
    "Recomendador",
    PackageCheck,
    ["/recomendador"]
  ),
} as const;

const commercialView: NavigationGroup = {
  kind: "group",
  id: "commercial-view",
  label: "Vista comercial",
  icon: PackageCheck,
  items: [
    navigationItems.promotions,
    navigationItems.script,
    navigationItems.training,
  ],
};

const supervision: NavigationGroup = {
  kind: "group",
  id: "supervision",
  label: "Supervisión",
  icon: BarChart3,
  items: [
    navigationItems.supervisionOperation,
    navigationItems.supervisionDashboard,
  ],
};

const administration: NavigationGroup = {
  kind: "group",
  id: "administration",
  label: "Administración",
  icon: LayoutDashboard,
  items: [
    navigationItems.adminDashboard,
    navigationItems.adminSales,
    navigationItems.adminUsers,
    navigationItems.adminBranches,
    navigationItems.adminContent,
  ],
};

export const navigationByRole: Record<
  UserRoleValue,
  readonly NavigationNode[]
> = {
  ADVISOR: [
    navigationItems.home,
    navigationItems.promotions,
    navigationItems.script,
    navigationItems.training,
    navigationItems.mySales,
    navigationItems.ranking,
  ],
  SUPERVISOR: [
    navigationItems.home,
    navigationItems.promotions,
    navigationItems.script,
    navigationItems.training,
    supervision,
    navigationItems.ranking,
  ],
  ADMIN: [
    navigationItems.home,
    commercialView,
    navigationItems.ranking,
    administration,
  ],
};

export const quickLinksByRole: Record<
  UserRoleValue,
  readonly QuickLink[]
> = {
  ADVISOR: [
    quickLink(navigationItems.promotions, "Ver promociones", "Consulta la oferta vigente."),
    quickLink(navigationItems.script, "Abrir guion", "Guion y respuestas rápidas."),
    quickLink(navigationItems.mySales, "Revisar mis ventas", "Consulta estados y observaciones."),
    quickLink(navigationItems.training, "Entrenamiento", "Practica con video y audio."),
    quickLink(navigationItems.ranking, "Top ventas", "Revisa tu avance en la sede."),
  ],
  SUPERVISOR: [
    quickLink(navigationItems.supervisionOperation, "Gestionar ventas", "Registra y actualiza al equipo."),
    quickLink(navigationItems.supervisionDashboard, "Ver dashboard", "Analiza la operación de la sede."),
    quickLink(navigationItems.script, "Abrir guion", "Orienta al equipo durante la llamada."),
    quickLink(navigationItems.promotions, "Promociones", "Consulta el material comercial."),
    quickLink(navigationItems.training, "Entrenamiento", "Comparte recursos con la sede."),
    quickLink(navigationItems.ranking, "Top ventas", "Revisa el avance del equipo."),
  ],
  ADMIN: [
    quickLink(navigationItems.promotions, "Abrir vista comercial", "Comprueba la experiencia publicada."),
    quickLink(navigationItems.adminDashboard, "Abrir dashboard", "Vista gerencial consolidada."),
    quickLink(navigationItems.adminSales, "Gestionar ventas", "Consulta la operación global."),
    quickLink(navigationItems.adminUsers, "Administrar usuarios", "Cuentas, roles y sedes."),
    quickLink(navigationItems.adminBranches, "Administrar sedes", "Estructura multi-sede."),
    quickLink(navigationItems.ranking, "Top ventas", "Compara el rendimiento comercial."),
  ],
};

export const homePrimaryActionByRole: Record<
  UserRoleValue,
  Pick<QuickLink, "href" | "label">
> = {
  ADVISOR: { href: navigationItems.promotions.href, label: "Ver promociones" },
  SUPERVISOR: {
    href: navigationItems.supervisionOperation.href,
    label: "Gestionar ventas",
  },
  ADMIN: {
    href: navigationItems.promotions.href,
    label: "Abrir vista comercial",
  },
};

export const adminContentNavigation = [
  navigationItems.adminRanking,
  navigationItems.adminPromotions,
  navigationItems.adminMedia,
] as const;

export function isNavigationItemActive(
  item: NavigationItem,
  pathname: string
) {
  if (item.exact) {
    return item.match.includes(pathname);
  }

  return item.match.some((route) =>
    route === "/" || route === "/admin"
      ? pathname === route
      : pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function isNavigationNodeActive(
  node: NavigationNode,
  pathname: string
) {
  return node.kind === "item"
    ? isNavigationItemActive(node, pathname)
    : node.items.some((item) => isNavigationItemActive(item, pathname));
}

function item(
  id: string,
  href: string,
  label: string,
  icon: LucideIcon,
  match: readonly string[],
  shortLabel?: string,
  exact?: boolean
): NavigationItem {
  return { kind: "item", id, href, label, shortLabel, icon, match, exact };
}

function quickLink(
  navigationItem: NavigationItem,
  label: string,
  description: string
): QuickLink {
  return { ...navigationItem, label, description };
}
