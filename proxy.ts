import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";

function unauthorizedJson() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = hasAdminSession(request);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/api/orders" && request.method === "GET" && !isAdmin) {
    return unauthorizedJson();
  }

  if (/^\/api\/orders\/\d+\/status$/.test(pathname) && !isAdmin) {
    return unauthorizedJson();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/orders", "/api/orders/:path*"],
};
