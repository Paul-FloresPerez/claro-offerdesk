import type { ReactNode } from "react";
import { auth } from "@/auth";
import { AppShellFrame, type AppShellUser } from "@/components/layout/AppShellFrame";

export async function AppShell({ children }: { children: ReactNode }) {
  const session = await auth();
  const user: AppShellUser | null = session?.user
    ? {
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        isAdmin: session.user.isAdmin,
      }
    : null;

  return <AppShellFrame user={user}>{children}</AppShellFrame>;
}
