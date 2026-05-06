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
  // Primero limpia todos los slugs para evitar conflictos
  await prisma.product.updateMany({ data: { slug: null } });

  const products = await prisma.product.findMany({
    select: { id: true, name: true },
    orderBy: { id: 'asc' }
  });

  const seen = new Set<string>();
  let updated = 0;

  for (const p of products) {
    let base = slugify(p.name);
    let slug = base;
    let i = 2;
    while (seen.has(slug)) { slug = `${base}-${i}`; i++; }
    seen.add(slug);
    await prisma.product.update({ where: { id: p.id }, data: { slug } });
    updated++;
    console.log(`✓ ${p.id} | ${slug}`);
  }

  console.log(`\n✨ ${updated} slugs generados sin conflictos`);
  await prisma.$disconnect();
}

main();
