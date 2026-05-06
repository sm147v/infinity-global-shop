import type { NextRequest } from "next/server";
import { timingSafeStringCompare } from "@/lib/crypto-compare";

export const ADMIN_SESSION_COOKIE = "igs_admin_session";

function getAdminToken(): string | null {
  const token = process.env.ADMIN_TOKEN?.trim();
  if (!token) {
    console.warn("ADMIN_TOKEN environment variable is not configured");
    return null;
  }
  // Ensure minimum length for security
  if (token.length < 16) {
    console.warn("ADMIN_TOKEN is too short. Minimum 16 characters recommended.");
  }
  return token;
}

/**
 * Validate admin token using constant-time comparison to prevent timing attacks.
 */
export function validateAdminToken(token: string | null): boolean {
  const adminToken = getAdminToken();
  if (!adminToken || !token) {
    return false;
  }
  return timingSafeStringCompare(token, adminToken);
}

export function hasAdminSession(request: NextRequest): boolean {
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? null;
  return validateAdminToken(session);
}

/**
 * Get admin token from request headers (for API endpoints).
 * Supports 'x-admin-token' header.
 */
export function getAdminTokenFromHeaders(request: NextRequest): string | null {
  return request.headers.get("x-admin-token");
}
