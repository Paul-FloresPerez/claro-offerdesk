import "server-only";

import bcrypt from "bcryptjs";
import { getServerSession, type NextAuthOptions, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { missingAuthSecret } from "@/lib/auth-secret";
import { prisma } from "@/lib/prisma";
import { resolveUserRole, type UserRoleValue } from "@/lib/roles";

type ClaroAuthUser = User & {
  isAdmin: boolean;
  role: UserRoleValue;
  branchId: string | null;
  mustChangePassword: boolean;
};

const SESSION_MAX_AGE = 30 * 60;
const SESSION_UPDATE_AGE = 5 * 60;

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? missingAuthSecret(),
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
    updateAge: SESSION_UPDATE_AGE,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        identifier: {
          label: "Usuario o DNI",
          type: "text",
        },
        password: {
          label: "Contraseña",
          type: "password",
        },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier?.trim().toLowerCase();
        const password = credentials?.password;

        if (!identifier || !password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              {
                username: identifier,
              },
              {
                dni: identifier,
              },
            ],
          },
          select: {
            id: true,
            email: true,
            passwordHash: true,
            fullName: true,
            photoUrl: true,
            isAdmin: true,
            role: true,
            branchId: true,
            isActive: true,
            mustChangePassword: true,
          },
        });

        if (!user?.isActive) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        const role = resolveUserRole(user.role, user.isAdmin);

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.photoUrl,
          isAdmin: role === "ADMIN",
          role,
          branchId: user.branchId,
          mustChangePassword: user.mustChangePassword,
        } satisfies ClaroAuthUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const claroUser = user as ClaroAuthUser;
        token.id = claroUser.id;
        token.isAdmin = claroUser.isAdmin;
        token.role = claroUser.role;
        token.branchId = claroUser.branchId;
        token.mustChangePassword = claroUser.mustChangePassword;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role = resolveUserRole(token.role, Boolean(token.isAdmin));
        session.user.isAdmin = session.user.role === "ADMIN";
        session.user.branchId =
          typeof token.branchId === "string" ? token.branchId : null;
        session.user.mustChangePassword = Boolean(token.mustChangePassword);
      }

      return session;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}
