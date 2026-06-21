#!/usr/bin/env bash
set -e
cd "$(git rev-parse --show-toplevel)"
git checkout -b fix/resenas-compliance 2>/dev/null || git checkout fix/resenas-compliance

cat > lib/reviews.ts << 'EOF'
// Neutralizado: reseñas reales se leen desde la DB via /api/reviews y <ProductReviews>.
export interface Review { name: string; location: string; text: string; stars: number; }
export function getProductReviews(_productId: number): { rating: number; count: number; reviews: Review[] } {
  return { rating: 0, count: 0, reviews: [] };
}
EOF

F=components/product-detail-client.tsx
perl -0pi -e 's/^import \{ getProductReviews \} from "\@\/lib\/reviews";\n//m' "$F"
perl -0pi -e 's/^\s*const reviewsPreview = getProductReviews\(product\.id\);\n//m' "$F"
perl -0pi -e 's{<a href="#reviews".*?</a>}{<a href="#reviews" style=\{\{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.25rem", textDecoration: "none", fontSize: "0.85rem", color: "#4A5D3A", fontWeight: 600 \}\}>Ver opiniones de clientes \x{2193}</a>}s' "$F"

echo "=== Cambios hechos. Verificando tipos... ==="
npx tsc --noEmit && echo "=== OK, sin errores. Listo. ==="
