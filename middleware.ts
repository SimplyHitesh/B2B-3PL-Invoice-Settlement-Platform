import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("vecto_access_token")?.value;
  const { pathname } = request.nextUrl;

  // Protected route prefixes
  const protectedRoutes = [
    "/dispatch",
    "/audit",
    "/accounts",
    "/driver",
    "/client-portal",
    "/admin",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // If unauthenticated user tries to access a protected route, redirect to /login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated user tries to access /login, redirect to /dispatch
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dispatch", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dispatch/:path*",
    "/audit/:path*",
    "/accounts/:path*",
    "/driver/:path*",
    "/client-portal/:path*",
    "/admin/:path*",
    "/login",
  ],
};
