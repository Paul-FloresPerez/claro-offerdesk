import type { ReactNode } from "react";
import { AppShellFrame, type AppShellUser } from "@/components/layout/AppShellFrame";
import { AuthorizationError, requireUser } from "@/lib/authorization";

export async function AppShell({ children }: { children: ReactNode }) {
  let user: AppShellUser | null = null;

  try {
    const authorizedUser = await requireUser();
    user = {
      name: authorizedUser.fullName,
      email: authorizedUser.email,
      image: authorizedUser.photoUrl,
      isAdmin: authorizedUser.role === "ADMIN",
      role: authorizedUser.role,
      branchId: authorizedUser.branchId,
      branchName: authorizedUser.branch?.name ?? null,
      mustChangePassword: authorizedUser.mustChangePassword,
    };
  } catch (error) {
    if (
      !(error instanceof AuthorizationError) ||
      (error.code !== "UNAUTHENTICATED" && error.code !== "INACTIVE_USER")
    ) {
      throw error;
    }
  }

  return <AppShellFrame user={user}>{children}</AppShellFrame>;
}
