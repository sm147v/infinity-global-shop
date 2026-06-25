import { prisma } from "@/lib/prisma";
const IDS = [14, 16, 17, 49, 7, 53, 19, 20, 21, 8, 24, 5, 6, 13, 25];
async function main() {
  const ps = await prisma.product.findMany({ where: { id: { in: IDS } }, select: { id:true, name:true, description:true, longDescription:true } });
  for (const p of ps) {
    console.log("\n===== ID", p.id, "·", p.name, "=====");
    console.log("DESC:", p.description);
    console.log("LONG:", p.longDescription);
  }
}
main().finally(()=>process.exit(0));
