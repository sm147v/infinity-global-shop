import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  
  for (const p of products) {
    const slug = toSlug(p.name);
    await prisma.product.update({
      where: { id: p.id },
      data: { slug }
    });
    console.log(`✓ ${p.id} | ${slug}`);
  }

  await prisma.$disconnect();
  console.log('\n✨ Slugs generados para todos los productos');
}

main();
