import { prisma } from "@/lib/prisma";
async function main() {
  const ps = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });
  ps.forEach(p => console.log(p.slug, "|", p.name));
  console.log("TOTAL:", ps.length);
}
main().finally(() => process.exit(0));
