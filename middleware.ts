import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const PROTECTED_PARENT = "/parent";
const PROTECTED_MANAGER = "/manager";
const PROTECTED_WARDEN = "/warden";
const LOGIN_PAGE = "/login";

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
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
        return NextResponse.redirect(new URL("/parent", req.url));
      } else if (user?.role === "Teacher") {
        return NextResponse.redirect(new URL("/warden/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const user = token ? parseJwt(token) : null;
  const userRole = user?.role; 

  if (pathname.startsWith(PROTECTED_MANAGER)) {
    if (!token) {
      const loginUrl = new URL(LOGIN_PAGE, req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== "Manager" && userRole !== "Admin") {
      return NextResponse.redirect(new URL("/403", req.url)); 
    }
  }

  if (pathname.startsWith(PROTECTED_PARENT)) {
    if (!token) {
      const loginUrl = new URL(LOGIN_PAGE, req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== "Parent") {
      if (userRole === "Teacher") return NextResponse.redirect(new URL("/warden/dashboard", req.url));
      if (userRole === "Manager") return NextResponse.redirect(new URL("/manager/dashboard", req.url));
      
      return NextResponse.redirect(new URL("/403", req.url));
    }
  }

  if (pathname.startsWith(PROTECTED_WARDEN)) {
    if (!token) {
      const loginUrl = new URL(LOGIN_PAGE, req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== "Teacher") {
      return NextResponse.redirect(new URL("/403", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/parent/:path*",
    "/manager/:path*",
    "/warden/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};