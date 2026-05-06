/**
 * Environment validation
 * Run once at application startup to ensure all required environment variables are set
 */

export function validateEnvironment(): void {
  const errors: string[] = [];

  // Check required variables
  const requiredVars = ["ADMIN_TOKEN"];
  const warningVars = ["DATABASE_URL", "NODE_ENV"];

  for (const varName of requiredVars) {
    const value = process.env[varName]?.trim();
    if (!value) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  }

  // Check ADMIN_TOKEN strength
  const adminToken = process.env.ADMIN_TOKEN?.trim();
  if (adminToken && adminToken.length < 16) {
    errors.push("ADMIN_TOKEN is too short. Use at least 16 characters (preferably 32+)");
  }

  // Warnings for optional but recommended
  for (const varName of warningVars) {
    const value = process.env[varName]?.trim();
    if (!value) {
      console.warn(`Warning: Optional environment variable not set: ${varName}`);
    }
  }

  // Production-specific checks
  if (process.env.NODE_ENV === "production") {
    if (!process.env.APP_URL) {
      errors.push("APP_URL must be set in production");
    }
    if (!process.env.DATABASE_URL) {
      errors.push("DATABASE_URL must be set in production");
    }
  }

  if (errors.length > 0) {
    console.error("Environment validation errors:");
    errors.forEach((error) => console.error(`  - ${error}`));
    throw new Error("Environment validation failed");
  }

  console.log("✓ Environment validation passed");
}

export function isSafeAdminToken(token: string): boolean {
  // Check for minimum length and complexity
  if (token.length < 16) return false;

  // Check for variety of characters
  const hasUppercase = /[A-Z]/.test(token);
  const hasLowercase = /[a-z]/.test(token);
  const hasNumbers = /[0-9]/.test(token);
  const hasSpecial = /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(token);

  // At least 3 of these should be true
  const strengthChecks = [hasUppercase, hasLowercase, hasNumbers, hasSpecial];
  return strengthChecks.filter(Boolean).length >= 3;
}
