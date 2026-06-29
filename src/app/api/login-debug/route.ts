import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEBUG_USERNAME = "paul.flores";
const DEBUG_PASSWORD = "Claro2026*";

export async function GET() {
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

  return NextResponse.json(
    {
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
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
