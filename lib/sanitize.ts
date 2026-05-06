/**
 * Sanitize text input to prevent XSS and injection attacks.
 * Removes HTML tags and control characters.
 */
export function sanitizeText(value: string, maxLength = 200): string {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value
    // Remove HTML tags and dangerous characters
    .replace(/<[^>]*>/g, "")
    // Remove HTML entities that could be used for XSS
    .replace(/&(?:[a-z]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi, "")
    // Remove control characters and null bytes
    .replace(/[\u0000-\u001F\u007F]/g, "")
    // Remove other potentially dangerous Unicode characters
    .replace(/[\u202E\u202D\u202C]/g, "")
    // Trim whitespace
    .trim()
    // Enforce max length
    .slice(0, maxLength);
}

/**
 * Sanitize HTML by removing all tags and entities.
 * Use for content that should never contain HTML.
 */
export function sanitizeHtml(value: string, maxLength = 200): string {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value
    // Remove all HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove HTML entities
    .replace(/&[^;]+;/g, "")
    // Remove control characters
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitize email addresses
 */
export function sanitizeEmail(value: string): string {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value
    .toLowerCase()
    .trim()
    // Remove whitespace
    .replace(/\s/g, "")
    .slice(0, 254); // RFC 5321 max email length
}

