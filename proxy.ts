import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { isSameOriginRequest } from "@/lib/security";

function unauthorizedJson() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = hasAdminSession(request);

  // Admin page protection
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // API endpoint protection
  if (pathname === "/api/orders" && request.method === "GET" && !isAdmin) {
    return addSecurityHeaders(unauthorizedJson());
  }

  if (/^\/api\/orders\/\d+\/status$/.test(pathname) && !isAdmin) {
    return addSecurityHeaders(unauthorizedJson());
  }

  // Validate same origin for state-changing requests
  if (
    ["POST", "PATCH", "PUT", "DELETE"].includes(request.method) &&
    pathname.startsWith("/api/")
  ) {
    if (!isSameOriginRequest(request)) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid origin" }, { status: 403 })
      );
    }
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
