import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const adminRoutePrefixes = ["/admin", "/db-test"];

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });

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
    "/ofertas/:path*",
    "/promociones/:path*",
    "/guion/:path*",
    "/objeciones/:path*",
    "/top-ventas/:path*",
    "/capacitacion/:path*",
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
