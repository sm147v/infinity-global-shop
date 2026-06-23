import { prisma } from "@/lib/prisma";

// ============================================================
//  Lógica central de descuentos.
//  UN SOLO lugar calcula el precio final, para que la tarjeta,
//  el detalle, el checkout y el cobro usen el mismo número.
// ============================================================

export interface DiscountRule {
  id: string;
  scope: "all" | "category" | "products";
  category: string | null;
  productIds: number[];
  type: "percentage" | "fixed";
  value: number;
  label: string;
  expiresAt: string | null;
  active: boolean;
}

export interface PricedProduct {
  price: number;          // precio final (con descuento si aplica)
  originalPrice: number;  // precio original (tachado)
  hasDiscount: boolean;
  discountLabel: string | null;  // ej "-20%" o "OFERTA"
  discountPercent: number;       // 20 (para mostrar -20%)
}

// Trae las reglas activas y NO vencidas desde la base de datos
export async function getActiveDiscountRules(): Promise<DiscountRule[]> {
  try {
    const now = new Date();
    const rows = await prisma.discountRule.findMany({
      where: {
        active: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => ({
      id: r.id,
      scope: r.scope as DiscountRule["scope"],
      category: r.category,
      productIds: r.productIds,
      type: r.type as DiscountRule["type"],
      value: r.value,
      label: r.label,
      expiresAt: r.expiresAt ? r.expiresAt.toISOString() : null,
      active: r.active,
    }));
  } catch (e) {
    console.error("Error leyendo descuentos:", e);
    return [];
  }
}

// ¿Esta regla aplica a este producto?
function ruleApplies(
  rule: DiscountRule,
  product: { id: number; category: string | null }
): boolean {
  if (rule.scope === "all") return true;
  if (rule.scope === "category") return !!rule.category && product.category === rule.category;
  if (rule.scope === "products") return rule.productIds.includes(product.id);
  return false;
}

// Calcula el precio final de UN producto dadas las reglas.
// Si varias reglas aplican, usa la que da MAYOR descuento.
export function priceWithDiscount(
  product: { id: number; category: string | null; price: number },
  rules: DiscountRule[]
): PricedProduct {
  const original = product.price;
  let best = original;
  let bestLabel: string | null = null;

  for (const rule of rules) {
    if (!ruleApplies(rule, product)) continue;
    let candidate = original;
    if (rule.type === "percentage") {
      candidate = original * (1 - rule.value / 100);
    } else if (rule.type === "fixed") {
      candidate = original - rule.value;
    }
    candidate = Math.max(0, Math.round(candidate));
    if (candidate < best) {
      best = candidate;
      bestLabel = rule.label;
    }
  }

  const hasDiscount = best < original;
  const percent = hasDiscount ? Math.round((1 - best / original) * 100) : 0;

  return {
    price: best,
    originalPrice: original,
    hasDiscount,
    discountLabel: hasDiscount ? (bestLabel || "OFERTA") : null,
    discountPercent: percent,
  };
}

// Aplica descuentos a una lista de productos (para las páginas de catálogo)
export async function applyDiscountsToProducts<
  T extends { id: number; category: string | null; price: number }
>(products: T[]): Promise<(T & PricedProduct)[]> {
  const rules = await getActiveDiscountRules();
  return products.map((p) => ({ ...p, ...priceWithDiscount(p, rules) }));
}
