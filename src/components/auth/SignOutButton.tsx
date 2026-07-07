"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="h-9 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      Salir
    </button>
  );
}
