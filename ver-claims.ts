import { prisma } from "@/lib/prisma";
const PROHIBIDAS = /herpes|alopecia|antifiebre|analg[eé]sico|hemorroid|reflujo|insomnio|ansiedad|depresi|presi[oó]n arterial|colesterol|diabet|replicaci[oó]n|infecci[oó]n urinaria|combate el|cura |trata el|previene (la|el|infec)/i;
async function main() {
  const ps = await prisma.product.findMany({ select: { id:true, name:true, description:true, longDescription:true } });
  for (const p of ps) {
    const texto = (p.description||"") + " | " + (p.longDescription||"");
    const m = texto.match(PROHIBIDAS);
    if (m) {
      const i = texto.toLowerCase().indexOf(m[0].toLowerCase());
      const frag = texto.substring(Math.max(0,i-40), i+60).replace(/\n/g," ");
      console.log("ID", p.id, "[", m[0], "] ...", frag, "...");
    }
  }
  console.log("--- fin ---");
}
main().finally(()=>process.exit(0));
