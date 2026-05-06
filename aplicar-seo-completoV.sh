#!/bin/bash
# ============================================================
# Infinity Global Shop — Aplicar TODO el SEO a productos
# ============================================================
# Ejecuta:
#   1) Tanda 1 — 15 vitaminas top (script seo-tanda-1-vitaminas.sh)
#   2) Tandas 2-6 — 45 productos restantes (prisma/seo-tandas-2-a-6.ts)
#
# USO:
#   cd ~/Desktop/infinity-global-shop
#   bash aplicar-seo-completo.sh
#
# El script es idempotente: puedes correrlo varias veces sin
# duplicar datos. Solo actualiza los campos SEO de cada producto.
# ============================================================

set -eo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()   { echo -e "${GREEN}✓${NC} $1"; }
warn()  { echo -e "${YELLOW}⚠${NC} $1"; }
title() { echo -e "\n${BLUE}━━━ $1 ━━━${NC}\n"; }

if [ ! -f "package.json" ]; then
  echo -e "${RED}✗${NC} No estás en el directorio del proyecto. Haz: cd ~/Desktop/infinity-global-shop"
  exit 1
fi

# ─── Verifica que prisma está generado ───
title "Verificando entorno"
if [ ! -d "node_modules/@prisma/client" ]; then
  warn "Prisma client no generado. Generando..."
  npx prisma generate
fi
log "Entorno OK"

# ─── TANDA 1 ───
title "TANDA 1 · 15 Vitaminas Top"
if [ -f "seo-tanda-1-vitaminas.sh" ]; then
  bash seo-tanda-1-vitaminas.sh
  log "Tanda 1 aplicada"
else
  warn "seo-tanda-1-vitaminas.sh no existe — saltando"
fi

# ─── TANDAS 2-6 ───
title "TANDAS 2-6 · Resto del catálogo (45 productos)"
if [ -f "prisma/seo-tandas-2-a-6.ts" ]; then
  npx tsx prisma/seo-tandas-2-a-6.ts
  log "Tandas 2-6 aplicadas"
else
  warn "prisma/seo-tandas-2-a-6.ts no existe — saltando"
fi

# ─── GENERAR SLUGS para los productos ───
title "Generando slugs SEO-friendly"
cat > /tmp/igs-generate-slugs.mjs << 'NODE_EOF'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

const products = await prisma.product.findMany({
  select: { id: true, name: true, slug: true },
});

let updated = 0;
const seen = new Set();

for (const p of products) {
  let baseSlug = slugify(p.name);
  let finalSlug = baseSlug;
  let counter = 2;

  // Evita slugs duplicados
  while (seen.has(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  seen.add(finalSlug);

  if (p.slug !== finalSlug) {
    await prisma.product.update({
      where: { id: p.id },
      data: { slug: finalSlug },
    });
    updated++;
  }
}

console.log(`✨ ${updated} slugs generados/actualizados.`);
await prisma.$disconnect();
NODE_EOF

node /tmp/igs-generate-slugs.mjs
rm -f /tmp/igs-generate-slugs.mjs
log "Slugs OK"

# ─── RESUMEN FINAL ───
title "RESUMEN"
cat > /tmp/igs-summary.mjs << 'NODE_EOF'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const products = await prisma.product.findMany({
  select: { name: true, category: true, brand: true, longDescription: true, features: true, slug: true },
});

const total = products.length;
const withLong = products.filter(p => p.longDescription && p.longDescription.length > 200).length;
const withBrand = products.filter(p => p.brand).length;
const withFeats = products.filter(p => p.features && p.features.length > 0).length;
const withSlug = products.filter(p => p.slug).length;

console.log(`Total productos: ${total}`);
console.log(`Con longDescription SEO: ${withLong}/${total}  (${Math.round(withLong/total*100)}%)`);
console.log(`Con brand: ${withBrand}/${total}  (${Math.round(withBrand/total*100)}%)`);
console.log(`Con features: ${withFeats}/${total}  (${Math.round(withFeats/total*100)}%)`);
console.log(`Con slug SEO: ${withSlug}/${total}  (${Math.round(withSlug/total*100)}%)`);

const cats = {};
products.forEach(p => {
  const c = p.category || 'Sin categoría';
  cats[c] = (cats[c] || 0) + 1;
});
console.log(`\nDistribución por categoría:`);
Object.entries(cats).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));

await prisma.$disconnect();
NODE_EOF

node /tmp/igs-summary.mjs
rm -f /tmp/igs-summary.mjs

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ SEO completo aplicado a tu base de datos.${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "Próximos pasos recomendados:"
echo "  1) npm run build     — verifica que compila"
echo "  2) git add . && git commit -m 'feat: SEO completo + Merchant feed'"
echo "  3) git push          — Vercel deploya automáticamente"
echo ""
echo "Conectar Google Merchant Center:"
echo "  1) https://merchants.google.com → Crear cuenta"
echo "  2) Verificar dominio: www.infinityglobalshop.com"
echo "  3) Productos → Feeds → Crear feed primario"
echo "  4) URL del feed: https://www.infinityglobalshop.com/merchant-feed.xml"
echo "  5) Frecuencia: Diaria · Idioma: Español · País: Colombia"
echo ""
