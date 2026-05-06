/**
 * Genera un slug SEO-friendly desde un string.
 * "Nature's Bounty Hair, Skin & Nails 80 gomitas"
 *   → "natures-bounty-hair-skin-nails-80-gomitas"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-z0-9\s-]/g, "")    // solo letras, números, espacios, guiones
    .trim()
    .replace(/\s+/g, "-")             // espacios → guiones
    .replace(/-+/g, "-")              // múltiples guiones → uno
    .substring(0, 80);                // máximo 80 chars
}

/**
 * Detecta si un string parece ser un ID numérico viejo
 * (para hacer redirect 301 a la URL nueva con slug)
 */
export function isLegacyId(value: string): boolean {
  return /^\d+$/.test(value);
}
