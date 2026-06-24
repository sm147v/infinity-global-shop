import { prisma } from "@/lib/prisma";

const updates = [
  {
    id: 15, // Potasio - limpiar el description corto
    name: "Spring Valley Potasio Gluconato 99mg - Mineral Esencial",
    description: "Potasio Gluconato 99mg de Spring Valley. Contribuye a la función muscular y nerviosa normales. Importado USA · Envío gratis +$150.000 Medellín.",
  },
  {
    id: 40, // e.l.f. cejas - quitar "alopecia"
    description: "Lápiz de cejas e.l.f. Instant Lift de doble punta. Cremoso para definir + cepillo para peinar. 6 tonos disponibles. Importado USA · Envío 24h Medellín.",
    longDescription: `e.l.f. Cosmetics es una marca americana muy querida: calidad a precio accesible. Su lápiz Instant Lift es de los más populares por una razón: rellena, define y peina las cejas en segundos sin necesidad de pomadas o geles.

2 en 1 en un solo producto. Punta de lápiz: fórmula cremosa que rellena vacíos y define la forma, con pigmentación natural. Cepillo spoolie: peina y difumina para un acabado natural.

Ideal para cejas con pelo que necesitan orden o rellenado leve, principiantes en maquillaje de cejas, y uso diario rápido.

Aplicación: peina las cejas con el spoolie hacia arriba, haz trazos cortos con la punta siguiendo el sentido del pelo y difumina de nuevo con el spoolie. Larga duración de hasta 12 horas, resistente al agua. Vegana, libre de crueldad.

Producto cosmético.`,
  },
  {
    id: 33, // Earth Therapeutics balsamo pies
    description: "Bálsamo para pies con Aloe Vera, Árbol de Té y Manzanilla. Hidrata y suaviza pies secos. 118ml · Envío 24h Medellín.",
    longDescription: `Bálsamo hidratante para pies de Earth Therapeutics, ideal si caminas mucho, usas tacones o tienes los pies resecos.

Fórmula con aloe vera (hidrata), aceite de árbol de té, manzanilla (calma), manteca de karité (nutre), aceite de coco (suaviza) y vitamina E.

Suele usarlo gente con talones resecos, pies cansados por estar mucho de pie, y quienes quieren mantener sus pies suaves sin pedicure profesional.

Uso intensivo: aplica generosamente antes de dormir, masajea hasta absorber y ponte medias de algodón. Mantenimiento: cada noche después del baño. Fragancia mentolada suave. Vegano, sin parabenos. 118ml rinde unos 4 meses.

Producto cosmético de uso externo. Si tienes alguna condición en la piel de los pies, consulta a un profesional de salud.`,
  },
  {
    id: 35, // Secret antitranspirante
    description: "Antitranspirante Secret Powder Fresh para mujer. Protección de larga duración con pH balanceado. Original USA · Envío 24h Medellín.",
    longDescription: `Secret Powder Fresh es un clásico americano: la fragancia limpia y polveada que dura todo el día, con tecnología de pH balanceado pensada para la piel femenina.

Está formulado para la química de la piel femenina, ayuda a controlar el olor, es suave con la piel recién rasurada, no mancha la ropa clara ni oscura, y tiene una fragancia suave que no compite con tu perfume.

La fórmula Powder Fresh tiene aroma limpio, no agresivo ni dulzón. Ideal para uso diario, oficina y eventos.

Aplica 2-3 pasadas en cada axila limpia y seca, y espera 30 segundos antes de vestir. Para días de más actividad, puedes aplicar también la noche anterior.

Producto cosmético de uso externo.`,
  },
  {
    id: 39, // Irish Spring gel
    description: "Gel de ducha Irish Spring para hombres. Frescura 24h y aroma mentolado. Sin parabenos, biodegradable. Importado USA · Envío gratis Medellín.",
    longDescription: `Irish Spring es un clásico americano para hombres: el gel de ducha con sensación de limpio y fresco desde el primer minuto, con una fragancia que acompaña buena parte del día.

Fórmula 2026 mejorada: aroma fresco de larga duración, libre de parabenos y ftalatos, ingredientes biodegradables (más responsable con el ambiente), e hidrata mientras limpia sin resecar la piel.

Suele usarlo gente activa que busca sensación de frescura después del gym, quienes quieren un aroma que dure, y familias que prefieren un formato rendidor.

Uso: aplica sobre esponja o directo sobre la piel mojada, masajea todo el cuerpo y enjuaga bien. Aroma fresco mentolado que combina bien con desodorantes y colonias. Formato económico de larga duración.

Producto cosmético de uso externo.`,
  },
];

async function main() {
  for (const u of updates) {
    const data: any = { description: u.description };
    if (u.longDescription) data.longDescription = u.longDescription;
    if (u.name) data.name = u.name;
    await prisma.product.update({ where: { id: u.id }, data });
    console.log("Actualizado ID", u.id);
  }
  console.log("--- " + updates.length + " productos actualizados ---");
}
main().finally(() => process.exit(0));
