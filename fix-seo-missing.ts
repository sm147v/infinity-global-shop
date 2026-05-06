import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const fixes = [
  { old: "Biotin Extra Strength", new: "Extra Strength" },
  { old: "Magnesium Oxide 400",   new: "Magnesio Óxido 400" },
  { old: "Calcium 600",           new: "Calcio 600" },
  { old: "Selenium",              new: "Selenio" },
  { old: "One'n Only Aceite",     new: "One 'n Only Aceite" },
  { old: "Curl Cream",            new: "Crema Definidora Rizos" },
  { old: "Olive & Shea",          new: "Olive Karité" },
  { old: "Carrot",                new: "Zanahoria" },
  { old: "Klein Tools Impact",    new: "Destornillador de Impacto" },
  { old: "Crimper",               new: "Ponchadora" },
  { old: "Level",                 new: "Nivel Magnético" },
  { old: "Carbon Monoxide",       new: "Monóxido de Carbono" },
  { old: "Wine",                  new: "Vino" },
];

async function main() {
  for (const f of fixes) {
    const found = await prisma.product.findFirst({
      where: { name: { contains: f.new, mode: 'insensitive' } },
      select: { id: true, name: true }
    });
    if (found) {
      console.log(`✓ Encontrado: [${f.old}] → ${found.name}`);
    } else {
      console.log(`✗ No encontrado: ${f.new}`);
    }
  }
  await prisma.$disconnect();
}

main();
