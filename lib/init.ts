/**
 * Application initialization
 * This module runs once when the Next.js server starts
 */

import { validateEnvironment } from "@/lib/env-validation";

// Run validation on module load
try {
  validateEnvironment();
} catch {
  console.error("Fatal: Application cannot start due to environment validation failure");
  process.exit(1);
}

export function initializeApp(): void {
  // Placeholder for future initialization logic
}
