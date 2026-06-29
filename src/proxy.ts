import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { missingAuthSecret } from "@/lib/auth-secret";

const canonicalHost = "claro-offerdesk.vercel.app";
const canonicalOrigin = `https://${canonicalHost}`;
const adminRoutePrefixes = ["/admin", "/db-test"];
const publicFilePrefixes = [
  "/capacitacion/",
  "/login/",
  "/ofertas/",
  "/logos/",
  "/usuarios/",
];

export async function proxy(request: NextRequest) {
  const canonicalRedirect = getCanonicalRedirect(request);

  if (canonicalRedirect) {
    return canonicalRedirect;
  }

  if (isPublicFile(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  const token = await getSessionToken(request);

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "callbackUrl",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );

    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute(request.nextUrl.pathname) && token.isAdmin !== true) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/ofertas/:path*",
    "/promociones/:path*",
    "/guion/:path*",
    "/objeciones/:path*",
    "/top-ventas/:path*",
    "/capacitacion/:path*",
    "/entrenamiento/:path*",
    "/recomendador/:path*",
    "/validaciones/:path*",
    "/admin/:path*",
    "/db-test/:path*",
  ],
};

function isAdminRoute(pathname: string) {
  return adminRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isPublicFile(pathname: string) {
  return (
    publicFilePrefixes.some((prefix) => pathname.startsWith(prefix)) &&
    /\.[a-z0-9]+$/i.test(pathname)
  );
}

function getCanonicalRedirect(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const host = request.headers.get("host")?.toLowerCase();

  if (!host || host === canonicalHost || isLocalhost(host)) {
    return null;
  }

  const url = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    canonicalOrigin
  );

  return NextResponse.redirect(url, 308);
}

function isLocalhost(host: string) {
  return (
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]")
  );
}

async function getSessionToken(request: NextRequest) {
  const secret =
    process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? missingAuthSecret();

  return (
    (await getToken({
      req: request,
      secret,
      secureCookie: true,
    })) ??
    (await getToken({
      req: request,
      secret,
      secureCookie: false,
    }))
  );
}
