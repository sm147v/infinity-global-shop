/**
 * Constant-time string comparison to prevent timing attacks.
 * Uses Node.js crypto.timingSafeEqual for secure comparison.
 */
import { timingSafeEqual } from "crypto";

export function timingSafeStringCompare(a: string, b: string): boolean {
  try {
    // Both strings must be equal length for timingSafeEqual
    if (a.length !== b.length) {
      return false;
    }
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    // If comparison fails for any reason, return false
    return false;
  }
}
