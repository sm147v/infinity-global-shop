import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log("Seed skipped: products already exist.");
    return;
  }

  await prisma.product.createMany({
    data: [
      {
        name: "Vitamina C 1000mg",
        description: "Suplemento diario para soporte inmune.",
        price: 45000,
        image:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
        stock: 25,
      },
      {
        name: "Serum Facial Hidratante",
        description: "Cuidado personal para hidratacion y brillo natural.",
        price: 68000,
        image:
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80",
        stock: 18,
      },
      {
        name: "Shampoo Reparador",
        description: "Cuidado del cabello con formula sin sulfatos.",
        price: 39000,
        image:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
        stock: 30,
      },
    ],
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
