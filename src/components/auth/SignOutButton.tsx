"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="h-9 rounded-md border border-border bg-card px-3 text-sm font-semibold text-muted-foreground transition hover:border-border hover:bg-accent hover:text-foreground"
    >
      Salir
    </button>
  );
}
