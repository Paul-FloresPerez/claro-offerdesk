import type { DefaultSession } from "next-auth";
import type { UserRoleValue } from "@/lib/roles";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      role: UserRoleValue;
      branchId: string | null;
      mustChangePassword: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    isAdmin: boolean;
    role: UserRoleValue;
    branchId: string | null;
    mustChangePassword: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isAdmin?: boolean;
    role?: UserRoleValue;
    branchId?: string | null;
    mustChangePassword?: boolean;
  }
}
