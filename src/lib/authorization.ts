import "server-only";

import { cache } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { resolveUserRole, type UserRoleValue } from "@/lib/roles";

export type AccessScope =
  | { kind: "GLOBAL" }
  | { kind: "BRANCH"; branchId: string }
  | { kind: "SELF"; userId: string };

export type AuthorizedUser = {
  id: string;
  fullName: string;
  email: string;
  photoUrl: string | null;
  role: UserRoleValue;
  branchId: string | null;
  branch: {
    id: string;
    name: string;
    city: string;
    isActive: boolean;
  } | null;
  mustChangePassword: boolean;
};

export type AuthorizationErrorCode =
  | "UNAUTHENTICATED"
  | "INACTIVE_USER"
  | "FORBIDDEN"
  | "BRANCH_REQUIRED"
  | "BRANCH_INACTIVE"
  | "BRANCH_FORBIDDEN";

export class AuthorizationError extends Error {
  constructor(
    public readonly code: AuthorizationErrorCode,
    message: string
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export const requireUser = cache(async (): Promise<AuthorizedUser> => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new AuthorizationError("UNAUTHENTICATED", "No autenticado.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      photoUrl: true,
      role: true,
      isAdmin: true,
      isActive: true,
      mustChangePassword: true,
      branchId: true,
      branch: {
        select: {
          id: true,
          name: true,
          city: true,
          isActive: true,
        },
      },
    },
  });

  if (!user?.isActive) {
    throw new AuthorizationError("INACTIVE_USER", "Usuario inactivo.");
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    photoUrl: user.photoUrl,
    role: resolveUserRole(user.role, user.isAdmin),
    branchId: user.branchId,
    branch: user.branch,
    mustChangePassword: user.mustChangePassword,
  };
});

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    throw new AuthorizationError("FORBIDDEN", "Se requiere rol administrador.");
  }

  return {
    user,
    scope: { kind: "GLOBAL" } as const,
  };
}

export async function requireSupervisor() {
  const user = await requireUser();

  if (user.role !== "SUPERVISOR") {
    throw new AuthorizationError("FORBIDDEN", "Se requiere rol supervisor.");
  }

  assertActiveBranch(user);

  return {
    user,
    scope: { kind: "BRANCH", branchId: user.branchId } as const,
  };
}

export async function requireAdvisor() {
  const user = await requireUser();

  if (user.role !== "ADVISOR") {
    throw new AuthorizationError("FORBIDDEN", "Se requiere rol asesor.");
  }

  assertActiveBranch(user);

  return {
    user,
    scope: { kind: "SELF", userId: user.id } as const,
  };
}

export async function requireRankingAccess() {
  const user = await requireUser();

  if (user.role === "ADMIN") {
    return {
      user,
      scope: { kind: "GLOBAL" } as const,
    };
  }

  assertActiveBranch(user);

  return {
    user,
    scope: { kind: "BRANCH", branchId: user.branchId } as const,
  };
}

export async function requireBranchAccess(requestedBranchId?: string | null) {
  const user = await requireUser();

  if (user.role === "ADMIN") {
    return {
      user,
      scope: { kind: "GLOBAL" } as AccessScope,
    };
  }

  if (user.role === "SUPERVISOR") {
    assertActiveBranch(user);

    if (requestedBranchId && requestedBranchId !== user.branchId) {
      throw new AuthorizationError(
        "BRANCH_FORBIDDEN",
        "No puedes operar sobre otra sede."
      );
    }

    return {
      user,
      scope: { kind: "BRANCH", branchId: user.branchId } as AccessScope,
    };
  }

  assertActiveBranch(user);

  return {
    user,
    scope: { kind: "SELF", userId: user.id } as AccessScope,
  };
}

export function isAuthorizationError(
  error: unknown,
  code?: AuthorizationErrorCode
): error is AuthorizationError {
  return (
    error instanceof AuthorizationError && (!code || error.code === code)
  );
}

function assertActiveBranch(
  user: AuthorizedUser
): asserts user is AuthorizedUser & {
  branchId: string;
  branch: NonNullable<AuthorizedUser["branch"]>;
} {
  if (!user.branchId || !user.branch) {
    throw new AuthorizationError(
      "BRANCH_REQUIRED",
      "El usuario no tiene una sede asignada."
    );
  }

  if (!user.branch.isActive) {
    throw new AuthorizationError(
      "BRANCH_INACTIVE",
      "La sede asignada esta inactiva."
    );
  }
}
