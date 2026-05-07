import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const low = await prisma.product.findMany({
    where: { stock: { lte: 2 } },
    select: { id: true, name: true, stock: true }
  });
  low.forEach(p => console.log(`${p.stock === 0 ? '🚨' : '⚠️'} ID ${p.id} | stock: ${p.stock} | ${p.name}`));
  console.log(`\nTotal con stock ≤ 2: ${low.length}`);
  await prisma.$disconnect();
}
main();
