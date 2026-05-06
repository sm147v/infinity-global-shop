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
