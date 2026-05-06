import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const products = await prisma.product.findMany({
  orderBy: { id: 'asc' },
  select: {
    id: true,
    name: true,
    category: true,
    brand: true,
    longDescription: true,
    features: true,
    slug: true,
    description: true,
  }
});

const total = products.length;
const withLongDesc = products.filter(p => p.longDescription && p.longDescription.length > 100).length;
const withBrand = products.filter(p => p.brand).length;
const withFeatures = products.filter(p => p.features && p.features.length > 0).length;
const withSlug = products.filter(p => p.slug).length;

console.log(`\n=== ESTADO DE PRODUCTOS ===`);
console.log(`Total productos: ${total}`);
console.log(`Con longDescription: ${withLongDesc}/${total}`);
console.log(`Con brand: ${withBrand}/${total}`);
console.log(`Con features: ${withFeatures}/${total}`);
console.log(`Con slug: ${withSlug}/${total}`);

// Categorías
const cats = {};
products.forEach(p => {
  const c = p.category || 'Sin categoría';
  cats[c] = (cats[c] || 0) + 1;
});
console.log(`\n=== CATEGORÍAS ===`);
Object.entries(cats).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));

console.log(`\n=== PRODUCTOS SIN OPTIMIZAR (sin longDescription) ===`);
products.filter(p => !p.longDescription || p.longDescription.length < 100).forEach(p => {
  console.log(`  [${p.id}] ${p.category || '?'} | ${p.name}`);
});

await prisma.$disconnect();
