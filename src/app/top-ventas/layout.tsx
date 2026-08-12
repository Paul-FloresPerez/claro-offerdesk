import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  isAuthorizationError,
  requireRankingAccess,
} from "@/lib/authorization";

export default async function TopSalesLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    await requireRankingAccess();
  } catch (error) {
    if (isAuthorizationError(error, "UNAUTHENTICATED")) {
      redirect("/login?callbackUrl=/top-ventas");
    }

    if (isAuthorizationError(error)) {
      redirect("/");
    }

    throw error;
  }

  return children;
}
