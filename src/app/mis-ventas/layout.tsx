import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  isAuthorizationError,
  requireAdvisor,
} from "@/lib/authorization";

export default async function MySalesLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    await requireAdvisor();
  } catch (error) {
    if (isAuthorizationError(error, "UNAUTHENTICATED")) {
      redirect("/login?callbackUrl=/mis-ventas");
    }

    if (isAuthorizationError(error)) {
      redirect("/");
    }

    throw error;
  }

  return children;
}
