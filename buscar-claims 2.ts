import { prisma } from "@/lib/prisma";
const PROHIBIDAS = /herpes|virus|viral|llaga|alopecia|enfermedad|cura|trata|combate|síntoma|dolor|ansiedad|depresi|insomnio|infecci|inflamaci|presión arterial|colesterol|diabet/i;
async function main() {
  const ps = await prisma.product.findMany({ select: { id:true, name:true, description:true, longDescription:true } });
  for (const p of ps) {
    const texto = (p.description||"") + " " + (p.longDescription||"");
    if (PROHIBIDAS.test(texto)) console.log("⚠️ ", p.id, p.name);
  }
  console.log("--- revision terminada ---");
}
main().finally(()=>process.exit(0));
