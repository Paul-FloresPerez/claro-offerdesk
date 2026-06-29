import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEBUG_USERNAME = "paul.flores";
const DEBUG_PASSWORD = "Claro2026*";

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: DEBUG_USERNAME,
      },
      select: {
        email: true,
        username: true,
        dni: true,
        isActive: true,
        passwordHash: true,
      },
    });

    const passwordHash = user?.passwordHash ?? "";
    const passwordMatches = user
      ? await bcrypt.compare(DEBUG_PASSWORD, passwordHash)
      : false;

    return jsonNoStore({
      ok: true,
      hasUser: Boolean(user),
      username: user?.username ?? null,
      email: user?.email ?? null,
      dni: user?.dni ?? null,
      isActive: user?.isActive ?? false,
      hashStartsWithBcrypt: /^\$2[aby]\$/.test(passwordHash),
      hashLength: passwordHash.length,
      passwordMatches,
      databaseUrlExists: Boolean(process.env.DATABASE_URL),
      directUrlExists: Boolean(process.env.DIRECT_URL),
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error) {
    const safeError =
      error instanceof Error
        ? {
            errorName: error.name,
            errorMessage: error.message,
          }
        : {
            errorName: "UnknownError",
            errorMessage: "Unknown error",
          };

    return jsonNoStore(
      {
        ok: false,
        ...safeError,
        databaseUrlExists: Boolean(process.env.DATABASE_URL),
        directUrlExists: Boolean(process.env.DIRECT_URL),
        nodeEnv: process.env.NODE_ENV,
      },
      200
    );
  }
}

function jsonNoStore(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
