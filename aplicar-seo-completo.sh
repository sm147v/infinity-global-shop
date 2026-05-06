#!/bin/bash
# ============================================================
# Infinity Global Shop — Aplicar TODO el SEO a productos
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

# ─── GENERAR SLUGS ───
title "Generando slugs SEO-friendly"

# Escribe el script DENTRO del proyecto para que npx tsx encuentre @prisma/client
cat > ./igs-generate-slugs.ts << 'NODE_EOF'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
  });

  let updated = 0;
  const seen = new Set<string>();

  for (const p of products) {
    let baseSlug = slugify(p.name);
    let finalSlug = baseSlug;
    let counter = 2;
    while (seen.has(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    seen.add(finalSlug);
    if (p.slug !== finalSlug) {
      await prisma.product.update({ where: { id: p.id }, data: { slug: finalSlug } });
      updated++;
    }
  }

  console.log(`✨ ${updated} slugs generados/actualizados.`);
  await prisma.$disconnect();
}

main();
NODE_EOF

npx tsx ./igs-generate-slugs.ts
rm -f ./igs-generate-slugs.ts
log "Slugs OK"

# ─── RESUMEN FINAL ───
title "RESUMEN"

cat > ./igs-summary.ts << 'NODE_EOF'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { name: true, category: true, brand: true, description: true, slug: true },
  });

  const total = products.length;
  const withDesc = products.filter(p => p.description && p.description.length > 100).length;
  const withBrand = products.filter(p => p.brand).length;
  const withSlug = products.filter(p => p.slug).length;

  console.log(`Total productos : ${total}`);
  console.log(`Con descripción : ${withDesc}/${total}  (${Math.round(withDesc/total*100)}%)`);
  console.log(`Con brand       : ${withBrand}/${total}  (${Math.round(withBrand/total*100)}%)`);
  console.log(`Con slug SEO    : ${withSlug}/${total}  (${Math.round(withSlug/total*100)}%)`);

  const cats: Record<string, number> = {};
  products.forEach(p => {
    const c = p.category || 'Sin categoría';
    cats[c] = (cats[c] || 0) + 1;
  });
  console.log(`\nDistribución por categoría:`);
  Object.entries(cats).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));

  await prisma.$disconnect();
}

main();
NODE_EOF

npx tsx ./igs-summary.ts
rm -f ./igs-summary.ts

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
echo "  4) URL del feed: https://www.infinityglobalshop.com/api/google-feed"
echo "  5) Frecuencia: Diaria · Idioma: Español · País: Colombia"
echo ""
