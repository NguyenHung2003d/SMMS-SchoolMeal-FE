import { Role, User } from "@/types/auth";
import { NextRequest } from "next/server";

function decodeToken(token: string | undefined): User | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    return { id: payload.sub, role: payload.role as Role, name: payload.name };
  } catch {
    return null;
  }
}

export function requireRole(req: NextRequest, allowedRoles: Role[]): boolean {
  const token = req.cookies.get("access_token")?.value;
  const user = decodeToken(token);

  if (!user) return false;
  return allowedRoles.includes(user.role);
}
