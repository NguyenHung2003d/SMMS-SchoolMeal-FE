import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const PROTECTED_ROOT = "/parent";
const HOME_PAGE = "/parent/register-meal";
const LOGIN_PAGE = "/login";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL(HOME_PAGE, req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith(PROTECTED_ROOT)) {
    if (!token) {
      const loginUrl = new URL(LOGIN_PAGE, req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/parent/:path*", "/login", "/register", "/forgot-password"],
};
