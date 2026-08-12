import type { UserRoleValue } from "@/lib/roles";

type ExclusiveRoutePolicy = {
  prefix: string;
  role: UserRoleValue;
};

const exclusiveRoutePolicies: readonly ExclusiveRoutePolicy[] = [
  { prefix: "/admin", role: "ADMIN" },
  { prefix: "/supervision", role: "SUPERVISOR" },
  { prefix: "/mis-ventas", role: "ADVISOR" },
];

export function getRequiredRole(pathname: string): UserRoleValue | null {
  return (
    exclusiveRoutePolicies.find(
      ({ prefix }) =>
        pathname === prefix || pathname.startsWith(`${prefix}/`)
    )?.role ?? null
  );
}

export function canRoleAccessPath(
  role: UserRoleValue,
  pathname: string
): boolean {
  const requiredRole = getRequiredRole(pathname);

  return requiredRole === null || requiredRole === role;
}
