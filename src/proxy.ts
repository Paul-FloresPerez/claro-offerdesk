import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { missingAuthSecret } from "@/lib/auth-secret";
import { resolveUserRole } from "@/lib/roles";
import { canRoleAccessPath } from "@/lib/route-access";

const passwordChangePath = "/cambiar-contrasena";
const publicFilePrefixes = [
  "/capacitacion/",
  "/login/",
  "/ofertas/",
  "/logos/",
  "/usuarios/",
];

export async function proxy(request: NextRequest) {
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

  if (token.mustChangePassword === true) {
    if (request.nextUrl.pathname !== passwordChangePath) {
      return NextResponse.redirect(new URL(passwordChangePath, request.url));
    }

    return NextResponse.next();
  }

  if (request.nextUrl.pathname === passwordChangePath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const legacyRedirect = getLegacyRouteRedirect(request);

  if (legacyRedirect) {
    return legacyRedirect;
  }

  const role = resolveUserRole(token.role, token.isAdmin === true);

  if (!canRoleAccessPath(role, request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/cambiar-contrasena",
    "/ofertas/:path*",
    "/promociones/:path*",
    "/guion/:path*",
    "/objeciones/:path*",
    "/top-ventas/:path*",
    "/mis-ventas/:path*",
    "/capacitacion/:path*",
    "/entrenamiento/:path*",
    "/recomendador/:path*",
    "/validaciones/:path*",
    "/admin/:path*",
    "/supervision/:path*",
  ],
};

function isPublicFile(pathname: string) {
  return (
    publicFilePrefixes.some((prefix) => pathname.startsWith(prefix)) &&
    /\.[a-z0-9]+$/i.test(pathname)
  );
}

function getLegacyRouteRedirect(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/ofertas") {
    return redirectKeepingSearch(request, "/promociones", search);
  }

  if (pathname === "/validaciones" || pathname.startsWith("/validaciones/")) {
    return redirectKeepingSearch(request, "/objeciones", search);
  }

  return null;
}

function redirectKeepingSearch(
  request: NextRequest,
  pathname: string,
  search: string
) {
  const url = new URL(pathname, request.url);
  url.search = search;

  return NextResponse.redirect(url);
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
