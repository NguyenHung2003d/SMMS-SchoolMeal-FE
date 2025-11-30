import { NextRequest, NextResponse } from "next/server";
import { PATHS, ROLES } from "./constants/auth";

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
  const user = token ? parseJwt(token) : null;
  const userRole = user?.role;

  if (["/login", "/register"].some((r) => pathname.startsWith(r)) && token) {
    if (userRole === ROLES.MANAGER)
      return NextResponse.redirect(new URL(PATHS.MANAGER_DASHBOARD, req.url));
    if (userRole === ROLES.TEACHER)
      return NextResponse.redirect(new URL(PATHS.WARDEN_DASHBOARD, req.url));
    if (userRole === ROLES.PARENT)
      return NextResponse.redirect(new URL(PATHS.PARENT_DASHBOARD, req.url));
    if (userRole === ROLES.KITCHEN_STAFF)
      return NextResponse.redirect(new URL(PATHS.KITCHEN_DASHBOARD, req.url));
    if (userRole === ROLES.ADMIN)
      return NextResponse.redirect(new URL(PATHS.ADMIN_DASHBOARD, req.url));
    if (userRole === ROLES.KITCHEN_STAFF)
      return NextResponse.redirect(new URL(PATHS.KITCHEN_DASHBOARD, req.url));
  }

  if (pathname.startsWith("/manager")) {
    if (!token) return NextResponse.redirect(new URL(PATHS.LOGIN, req.url));
    if (userRole !== ROLES.MANAGER && userRole !== ROLES.ADMIN) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  if (pathname.startsWith("/warden")) {
    if (!token) return NextResponse.redirect(new URL(PATHS.LOGIN, req.url));
    if (userRole !== ROLES.TEACHER) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  if (pathname.startsWith("/kitchen-staff")) {
    if (!token) return NextResponse.redirect(new URL(PATHS.LOGIN, req.url));
    if (userRole !== ROLES.KITCHEN_STAFF) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  if (pathname.startsWith("/parent")) {
    if (!token) return NextResponse.redirect(new URL(PATHS.LOGIN, req.url));
    if (userRole !== ROLES.PARENT) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL(PATHS.LOGIN, req.url));
    if (userRole !== ROLES.ADMIN) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
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
    "/kitchen-staff/:path*",
    "/admin/:path*",
  ],
};
