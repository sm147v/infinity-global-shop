import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const p = await prisma.product.findMany({ 
    select: { id: true, name: true }, 
    orderBy: { id: 'asc' } 
  });
  p.forEach(x => console.log(x.id, '|', x.name));
  await prisma.$disconnect();
}

main();
