import { prisma } from "@/lib/prisma";

const updates = [
  {
    id: 29,
    longDescription: `La L-lisina es un aminoácido esencial: tu cuerpo no lo produce, así que solo lo obtienes de la alimentación o de un suplemento. Participa en la producción de colágeno (componente de la piel y los cartílagos), en la absorción del calcio y en la formación de carnitina, que interviene en el metabolismo energético. También forma parte de los nutrientes asociados al mantenimiento normal del sistema inmune.

Suele tomarlo gente con dietas bajas en proteína animal o vegana, personas activas y deportistas que buscan apoyar su recuperación, y quienes quieren reforzar su aporte diario de aminoácidos.

Modo de uso: 1 tableta (1,000 mg) al día, preferiblemente con el estómago vacío (1 hora antes o 2 horas después de comer). No la tomes con leche.

Este producto no reemplaza una alimentación equilibrada ni la indicación de un profesional de salud.`,
  },
  {
    id: 15,
    longDescription: `El potasio es un mineral esencial y uno de los principales electrolitos del cuerpo. Contribuye al funcionamiento normal de los músculos y del sistema nervioso, y participa en el equilibrio de líquidos y electrolitos. Es un nutriente que se pierde con el sudor, por eso muchas personas activas y deportistas buscan reponerlo.

Cada tableta aporta 99 mg, la cantidad habitual en suplementos para buena tolerancia gastrointestinal; el resto del potasio diario proviene de tu alimentación (banano, espinaca, papa, frijoles).

Suele tomarlo gente con dietas bajas en frutas y verduras, personas activas, y adultos que quieren complementar su aporte de este mineral.

Modo de uso: 1 tableta al día con la comida. Sin gluten, sin lácteos.

Si tomas medicamentos o tienes alguna condición de salud (incluida la función renal), consulta a tu médico antes de usarlo. No reemplaza un tratamiento médico.`,
  },
  {
    id: 9,
    longDescription: `La glucosamina y la condroitina son componentes que se asocian de forma natural con el cartílago y la salud de las articulaciones. Este suplemento combina ambos para quienes quieren apoyar su salud articular y su movilidad.

Suele tomarlo gente mayor de 40 años, personas activas y deportistas que someten sus articulaciones a desgaste, trabajadores de oficina con rigidez por estar mucho tiempo sentados, y quienes quieren cuidar sus rodillas y caderas a largo plazo.

Actúa de forma gradual: es un complemento de uso constante, no de efecto inmediato. Lo habitual es tomarlo de forma continua durante al menos 90 días para valorar cómo te sienta.

Modo de uso: según la dosis indicada en el envase.

No reemplaza un tratamiento médico. Si tienes molestias articulares persistentes, consulta a un profesional de salud.`,
  },
];

async function main() {
  for (const u of updates) {
    await prisma.product.update({ where: { id: u.id }, data: { longDescription: u.longDescription } });
    console.log("Actualizado ID", u.id);
  }
  console.log("--- 3 productos actualizados ---");
}
main().finally(() => process.exit(0));
