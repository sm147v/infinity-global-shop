import { prisma } from "@/lib/prisma";
const IDS = [15, 40, 33, 35, 39];
async function main() {
  const ps = await prisma.product.findMany({ where: { id: { in: IDS } }, select: { id:true, name:true, description:true, longDescription:true } });
  for (const p of ps) {
    console.log("\n===== ID", p.id, "·", p.name, "=====");
    console.log("DESC:", p.description);
    console.log("LONG:", p.longDescription);
  }
}
main().finally(()=>process.exit(0));
