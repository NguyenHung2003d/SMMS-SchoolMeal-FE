import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  const authRoutes = ["/login", "/register", "/forgot-password"];

  if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/parent/register-meal", req.url));
  }
  if (pathname.startsWith("/parent") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/parent/:path*", "/login", "/register", "/forgot-password"],
};
