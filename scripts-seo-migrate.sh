#!/bin/bash
# Corre después del bash principal para migrar la DB
set -e

echo "🔄 Generando migración de Prisma..."
npx prisma migrate dev --name add_slug_brand_sku

echo "📝 Llenando slugs de productos existentes..."
cat > /tmp/seed-slugs.mjs << 'NODE_EOF'
import { PrismaClient } from '@prisma/client';

function slugify(text) {
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

const prisma = new PrismaClient();

const products = await prisma.product.findMany({ where: { slug: null } });
console.log(`Productos sin slug: ${products.length}`);

for (const p of products) {
  const baseSlug = slugify(p.name);
  let slug = baseSlug;
  let counter = 2;

  // Asegurar unicidad
  while (await prisma.product.findFirst({ where: { slug, NOT: { id: p.id } } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  await prisma.product.update({
    where: { id: p.id },
    data: {
      slug,
      sku: `IGS-${p.id.toString().padStart(4, '0')}`,
      brand: p.name.split(' ')[0], // Toma la primera palabra como marca por defecto
    },
  });
  console.log(`✓ ${p.id}: ${slug}`);
}

await prisma.$disconnect();
console.log('✨ Slugs generados');
NODE_EOF

node /tmp/seed-slugs.mjs
rm /tmp/seed-slugs.mjs

echo "✅ Migración completa"
