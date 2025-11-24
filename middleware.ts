import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const PROTECTED_PARENT = "/parent";
const PROTECTED_MANAGER = "/manager"; 
const LOGIN_PAGE = "/login";

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token) {
      const user = parseJwt(token);
      
      if (user?.role === "Manager") {
        return NextResponse.redirect(new URL("/manager/dashboard", req.url)); 
      } else if (user?.role === "Parent") {
        return NextResponse.redirect(new URL("/parent/register-meal", req.url));
      }
      
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith(PROTECTED_PARENT)) {
    if (!token) {
      const loginUrl = new URL(LOGIN_PAGE, req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith(PROTECTED_MANAGER)) {
     if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
     }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/parent/:path*", "/manager/:path*", "/login", "/register", "/forgot-password"],
};