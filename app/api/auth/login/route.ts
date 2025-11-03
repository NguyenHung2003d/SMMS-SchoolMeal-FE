import { signToken } from "@/lib/jwt";
import { AuthResponse, User } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { phone, password } = await req.json();

  if (phone === "1234567890" && password === "password") {
    const token = signToken({ id: "user123", role: "parent" });
    const user: User = { id: "user123", role: "parent", name: "Nguyễn Văn A" };
    return buildAuthResponse(token, user);
  }

  if (phone === "01234567889" && password === "password") {
    const token = signToken({ id: "user456", role: "kitchenstaff" });
    const user: User = {
      id: "user456",
      role: "kitchenstaff",
      name: "Nguyễn Văn B",
    };
    return buildAuthResponse(token, user);
  }

  if (phone === "admin" && password === "password") {
    const token = signToken({ id: "admin1", role: "admin" });
    const user: User = { id: "admin1", role: "admin", name: "Quản trị viên" };
    return buildAuthResponse(token, user);
  }

  return NextResponse.json(
    { success: false, message: "Invalid phone or password" },
    { status: 401 }
  );
}

function buildAuthResponse(token: string, user: User) {
  const res = NextResponse.json<AuthResponse>({ token, user });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  return res;
}
