export const USER_ROLE_VALUES = ["ADMIN", "SUPERVISOR", "ADVISOR"] as const;

export type UserRoleValue = (typeof USER_ROLE_VALUES)[number];

export const USER_ROLE_LABELS: Record<UserRoleValue, string> = {
  ADMIN: "Administrador",
  SUPERVISOR: "Supervisor",
  ADVISOR: "Asesor",
};

export function isUserRole(value: unknown): value is UserRoleValue {
  return (
    typeof value === "string" &&
    USER_ROLE_VALUES.includes(value as UserRoleValue)
  );
}

export function resolveUserRole(
  role: UserRoleValue | null | undefined,
  isAdmin: boolean
): UserRoleValue {
  return role ?? (isAdmin ? "ADMIN" : "ADVISOR");
}

export function roleToIsAdmin(role: UserRoleValue) {
  return role === "ADMIN";
}
