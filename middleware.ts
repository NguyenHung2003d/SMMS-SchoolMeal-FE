import { NextRequest, NextResponse } from "next/server";
import { PATHS, ROLES } from "./constants/auth";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;
  const user = token ? parseJwt(token) : null;

  const role = user?.role;

  if (
    token &&
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forgot-password")
  ) {
    let redirectUrl = PATHS.PARENT_DASHBOARD;
    if (role === ROLES.ADMIN) redirectUrl = PATHS.ADMIN_DASHBOARD;
    else if (role === ROLES.MANAGER) redirectUrl = PATHS.MANAGER_DASHBOARD;
    else if (role === ROLES.TEACHER) redirectUrl = PATHS.WARDEN_DASHBOARD;
    else if (role === ROLES.KITCHEN_STAFF)
      redirectUrl = PATHS.KITCHEN_DASHBOARD;

    const url = req.nextUrl.clone();
    url.pathname = redirectUrl;
    return NextResponse.redirect(url);
  }

  const protectedPaths = [
    "/manager",
    "/warden",
    "/kitchen-staff",
    "/parent",
    "/admin",
  ];

  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/manager") && role !== ROLES.MANAGER)
      return NextResponse.redirect(new URL("/unauthorized", req.url));

    if (pathname.startsWith("/warden") && role !== ROLES.TEACHER)
      return NextResponse.redirect(new URL("/unauthorized", req.url));

    if (pathname.startsWith("/kitchen-staff") && role !== ROLES.KITCHEN_STAFF)
      return NextResponse.redirect(new URL("/unauthorized", req.url));

    if (
      pathname.startsWith("/parent") &&
      role !== "Parent" &&
      role !== "PARENT"
    )
      return NextResponse.redirect(new URL("/unauthorized", req.url));

    if (pathname.startsWith("/admin") && role !== ROLES.ADMIN)
      return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/parent/:path*",
    "/manager/:path*",
    "/warden/:path*",
    "/kitchen-staff/:path*",
    "/admin/:path*",
  ],
};
