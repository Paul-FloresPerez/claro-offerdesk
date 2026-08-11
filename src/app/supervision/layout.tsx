import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  isAuthorizationError,
  requireSupervisor,
} from "@/lib/authorization";

export default async function SupervisionLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    await requireSupervisor();
  } catch (error) {
    if (isAuthorizationError(error, "UNAUTHENTICATED")) {
      redirect("/login?callbackUrl=/supervision");
    }

    if (isAuthorizationError(error)) {
      redirect("/");
    }

    throw error;
  }

  return children;
}
