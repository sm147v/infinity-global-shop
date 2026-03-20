import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "igs_admin_session";

function getAdminToken(): string | null {
  const token = process.env.ADMIN_TOKEN?.trim();
  return token ? token : null;
}

export function hasAdminSession(request: NextRequest): boolean {
  const token = getAdminToken();
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return Boolean(token && session && session === token);
}
