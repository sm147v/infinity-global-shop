import { prisma } from "@/lib/prisma";

const updates = [
  {
    id: 14, // Cranberry
    description: "Cranberry (arándano rojo) concentrado en cápsulas. Aporte de proantocianidinas y antioxidantes para apoyar la salud del tracto urinario. Importado USA · Envío 24h en Medellín.",
    longDescription: `El arándano rojo (cranberry) es una fruta conocida por su aporte de proantocianidinas (PACs) y antioxidantes. Este suplemento ofrece una dosis concentrada equivalente a varios vasos de jugo, sin el azúcar.

Suele tomarlo gente que quiere complementar el cuidado de su tracto urinario como parte de su rutina de bienestar, mujeres que buscan un aporte extra de antioxidantes, y quienes prefieren la versión concentrada en lugar del jugo.

Modo de uso: 1 cápsula al día con un vaso de agua. Para un aporte constante, tomar a diario. También aporta vitamina C.

Este producto es un suplemento dietario, no un medicamento, y no reemplaza la indicación de un profesional de salud. Ante molestias urinarias, consulta a tu médico.`,
  },
  {
    id: 53, // Dr Teal's
    description: "Dr Teal's Espuma de Baño con Lavanda y Sales de Epsom. Para un baño relajante tipo spa en casa. 1 litro · Envío 24h Medellín.",
    longDescription: `Espuma de baño de la marca americana Dr Teal's, pensada para convertir tu baño en un momento de relajación tipo spa a precio accesible.

Fórmula con aceite esencial de lavanda (aroma relajante), sales de Epsom (sulfato de magnesio), aceite de coco y aceite de almendras que ayudan a hidratar la piel mientras te bañas.

Suele usarlo gente que quiere relajarse después de un día intenso, personas activas que buscan un baño reconfortante tras el ejercicio, y quienes disfrutan de una rutina de autocuidado antes de dormir.

Modo de uso: llena la tina con agua tibia, agrega 1-2 tapas bajo el chorro y sumérgete 20-30 minutos. Ideal 1-2 horas antes de dormir. 1 litro rinde para 20-25 baños.

Producto de uso cosmético externo.`,
  },
  {
    id: 6, // Biotina 1000 Nature's Bounty
    description: "Biotina pura 1000 mcg en 110 gomitas veganas. Contribuye al mantenimiento normal del cabello, las uñas y al metabolismo energético. Original Nature's Bounty USA. Envío 24h en Medellín.",
    longDescription: `La biotina (vitamina B7) es una vitamina del complejo B que contribuye al mantenimiento normal del cabello y las uñas, y participa en el metabolismo energético normal. Esta presentación aporta 1,000 mcg en una gomita vegana sin azúcar añadida.

Suele tomarla gente que quiere apoyar su rutina de cuidado capilar con una dosis de mantenimiento, personas que prefieren gomitas veganas, y quienes empiezan a incorporar biotina a su día a día.

Modo de uso: 1 gomita al día. Sabor frutas tropicales, vegana, sin gluten ni lácteos. 110 gomitas rinden más de 3 meses.

Este producto es un suplemento dietario y no reemplaza una alimentación equilibrada ni la indicación de un profesional de salud.`,
  },
  {
    id: 5, // Nature's Bounty Hair Skin Nails gomitas
    description: "Gomitas con 2,500 mcg de Biotina más Vitamina C y E. Apoyan tu rutina de cuidado de cabello, piel y uñas. 80 gomitas sabor fresa. Original USA. Envío gratis +$150.000 en Medellín.",
    longDescription: `Fórmula de Nature's Bounty con 2,500 mcg de biotina por gomita, más vitamina C y vitamina E. La biotina contribuye al mantenimiento normal del cabello y las uñas, y las vitaminas C y E aportan su acción antioxidante.

Suele tomarla gente que quiere apoyar su rutina de belleza desde la alimentación, mujeres que buscan complementar el cuidado de su cabello, piel y uñas, y quienes prefieren una presentación en gomita sabor fresa.

Modo de uso: 2 gomitas al día, con o sin alimentos. 80 gomitas rinden 40 días. 100% original importado de Estados Unidos.

Este producto es un suplemento dietario, no un medicamento, y no reemplaza una alimentación equilibrada ni la indicación de un profesional de salud.`,
  },
  {
    id: 16, // Biotina 10000 gomitas
    description: "Biotina de alta concentración 10,000 mcg en 90 gomitas. Para quienes buscan un mayor aporte de biotina en su rutina de cuidado capilar. Importado USA · Envío 24h Medellín.",
    longDescription: `Presentación de alta concentración de biotina: 10,000 mcg por gomita. La biotina contribuye al mantenimiento normal del cabello y las uñas. La eligen quienes buscan un aporte más alto que las presentaciones estándar.

Suele tomarla gente que ya usa biotina y quiere una concentración mayor, personas que notan su cabello o uñas más frágiles y quieren reforzar su rutina de cuidado, y quienes pasan por etapas de mayor exigencia (estrés, cambios de estación).

La biotina es soluble en agua: lo que el cuerpo no usa se elimina de forma natural. Si te haces exámenes de tiroides, conviene suspenderla unos días antes, ya que puede alterar los resultados de laboratorio.

Modo de uso: 1 gomita al día. Spring Valley es la marca de Walmart en USA, con buena relación calidad-precio.

Este producto es un suplemento dietario y no reemplaza una alimentación equilibrada ni la indicación de un profesional de salud.`,
  },
  {
    id: 13, // Nature's Bounty 150 softgels
    description: "150 softgels con Biotina 3,000 mcg, colágeno y antioxidantes. Presentación rendidora para tu rutina de cuidado de cabello, piel y uñas. Original USA. Entrega 24h en Medellín.",
    longDescription: `La presentación más completa y rendidora de Nature's Bounty: 150 softgels con 3,000 mcg de biotina, vitamina A, C, E, zinc y un complejo de antioxidantes. La biotina contribuye al mantenimiento normal del cabello y las uñas.

Los softgels concentran más activos por dosis que las gomitas. Suele elegirla gente que busca una rutina de cuidado más completa y un frasco que rinda más tiempo.

Modo de uso: 2 softgels al día con un vaso de agua, preferiblemente con comida. Para valorar cómo te sienta, mantén la rutina de forma constante. El frasco rinde unos 75 días.

Este producto es un suplemento dietario y no reemplaza una alimentación equilibrada ni la indicación de un profesional de salud.`,
  },
  {
    id: 19, // Magnesio óxido 250
    description: "Magnesio Óxido 250mg en cápsulas. Contribuye a la función muscular y del sistema nervioso normales. Original Spring Valley USA · Envío gratis Medellín.",
    longDescription: `El magnesio es un mineral esencial que contribuye a la función muscular normal, al funcionamiento normal del sistema nervioso y al metabolismo energético. Es uno de los minerales que suele faltar en la dieta moderna.

Suele tomarlo gente activa y deportistas (el magnesio se pierde con el sudor), personas con mucho estrés que quieren apoyar su descanso, mayores de 50 años y quienes consumen café o alcohol con frecuencia.

El óxido de magnesio es una forma concentrada: 250 mg cubren una parte importante del aporte diario. Si buscas absorción más rápida, está la versión de glicinato de alta absorción.

Modo de uso: 1 cápsula al día con comida. Si lo tomas como apoyo al descanso, hazlo 1 hora antes de dormir.

Este producto es un suplemento dietario, no un medicamento, y no reemplaza la indicación de un profesional de salud.`,
  },
  {
    id: 17, // Biotina 10000 capsulas
    description: "Biotina de alta concentración 10,000 mcg en cápsulas vegetarianas, sin azúcar. Para quienes buscan un mayor aporte de biotina sin endulzantes. Original USA · Envío 24h Medellín.",
    longDescription: `Presentación de alta concentración: 10,000 mcg de biotina en cápsula vegetariana, sin azúcar ni saborizantes. La biotina contribuye al mantenimiento normal del cabello y las uñas. Ideal para quienes prefieren no consumir azúcar (útil si cuidas tu glucosa).

La eligen quienes ya usan biotina y quieren una concentración alta, personas que prefieren cápsula en vez de gomita, y quienes buscan una opción más rendidora por dosis.

La biotina es soluble en agua: lo que el cuerpo no usa se elimina. Si te haces exámenes de tiroides (TSH, T4), conviene suspenderla unos días antes, ya que puede alterar los resultados.

Modo de uso: 1 cápsula al día con un vaso de agua. Spring Valley es la marca de Walmart, con buena relación calidad-precio.

Este producto es un suplemento dietario y no reemplaza una alimentación equilibrada ni la indicación de un profesional de salud.`,
  },
  {
    id: 7, // Melatonina
    description: "Melatonina 10mg en 140 gomitas sabor fresa. Apoyo para tu rutina de descanso. Original Nature's Bounty USA. Envío 24h en Medellín.",
    longDescription: `La melatonina es una sustancia que el cuerpo produce de forma natural al oscurecer y que se asocia con el ciclo del sueño. Con las pantallas, los horarios irregulares y los viajes, ese ritmo se puede alterar.

Esta es una de las presentaciones más usadas en Estados Unidos: 10 mg por gomita. Suele usarla gente con horarios cambiantes, quienes viajan y cruzan husos horarios (jet lag), trabajadores de turnos nocturnos, y personas que quieren apoyar una rutina de descanso ordenada.

Modo de uso: tómala 30 a 60 minutos antes de dormir, idealmente sin pantallas y con la luz baja. Se recomienda empezar por la presentación más baja que te funcione. 140 gomitas rinden 4-5 meses. Sabor fresa, veganas, sin gluten.

Este producto es un suplemento dietario, no un medicamento, y no reemplaza la indicación de un profesional de salud. Si tienes dificultades persistentes para dormir, consulta a tu médico.`,
  },
  {
    id: 49, // Africa's Best aceite
    description: "Aceite capilar Africa's Best con Zanahoria y Árbol de Té. Para el cuidado del cuero cabelludo y el brillo del cabello. Importado USA · Envío 24h Medellín.",
    longDescription: `Aceite capilar que combina extracto de zanahoria (aporta vitamina A) y aceite de árbol de té, tradicionalmente usados en el cuidado del cuero cabelludo y el cabello.

Suele usarlo gente que quiere cuidar su cuero cabelludo, dar brillo y suavidad al cabello, sellar puntas resecas, y mantener una rutina de masaje capilar. El masaje al aplicarlo ayuda a una sensación relajante y a distribuir el producto.

Modo de uso: aplica 5-10 gotas en el cuero cabelludo, masajea en círculos por 3-5 minutos y deja actuar mínimo 30 minutos (o toda la noche) antes de lavar. Uso recomendado 2-3 veces por semana.

Producto cosmético de uso externo. Para temas específicos del cuero cabelludo, consulta a un dermatólogo.`,
  },
  {
    id: 21, // Magnesio glicinato 200
    description: "Magnesio 200mg de alta absorción (glicinato). Suave con el estómago, sin efecto laxante. Contribuye a la función muscular y nerviosa normales. Original USA · Envío 24h en Medellín.",
    longDescription: `El magnesio glicinato es la forma más biodisponible y tolerable de magnesio: se absorbe muy bien y es suave con el estómago, sin el efecto laxante del óxido. El magnesio contribuye a la función muscular normal, al sistema nervioso normal y a reducir el cansancio.

Suele elegirlo gente con estómago sensible, quienes prefieren tomar suplementos en ayunas, personas que buscan apoyar su descanso, y quienes priorizan calidad de absorción sobre cantidad.

Por su buena absorción, 200 mg rinden un efecto comparable a dosis más altas de óxido común.

Modo de uso: 1 cápsula al día, en ayunas o con comida.

Este producto es un suplemento dietario, no un medicamento, y no reemplaza la indicación de un profesional de salud.`,
  },
  {
    id: 24, // Selenio
    description: "Selenio 200mcg de Spring Valley. Mineral con acción antioxidante que contribuye a la función normal del sistema inmune y de la tiroides. Importado USA · Envío 24h Medellín.",
    longDescription: `El selenio es un mineral esencial que contribuye a la función normal del sistema inmune, al funcionamiento normal de la tiroides y a la protección de las células frente al daño oxidativo. Los suelos colombianos suelen ser pobres en selenio, por eso muchas personas buscan complementarlo.

Suele tomarlo gente que quiere apoyar su aporte de antioxidantes, personas con dietas restrictivas, y quienes buscan complementar minerales poco presentes en su alimentación.

Modo de uso: 1 tableta (200 mcg) al día con comida. No superar los 400 mcg diarios entre todas las fuentes.

Este producto es un suplemento dietario, no un medicamento, y no reemplaza la indicación de un profesional de salud. Si tienes una condición de tiroides, consúltalo con tu médico antes de usarlo.`,
  },
  {
    id: 25, // Hierro
    description: "Hierro Ferroso 65mg en tabletas. Contribuye a los niveles normales de energía y a la formación normal de glóbulos rojos. Importado de USA. Envío 24h en Medellín.",
    longDescription: `El hierro es un mineral esencial que contribuye a la formación normal de glóbulos rojos y hemoglobina, y al transporte normal de oxígeno en el cuerpo. También ayuda a reducir el cansancio y la fatiga. Las necesidades de hierro suelen ser mayores en mujeres en edad reproductiva.

Suele tomarlo gente que quiere complementar su aporte de hierro, mujeres con mayores requerimientos, personas con dietas vegetarianas, y quienes donan sangre con frecuencia.

Modo de uso: tómalo con vitamina C (por ejemplo, jugo de naranja) para favorecer la absorción. Evita tomarlo junto con café, té o lácteos. Tómalo con comida; es normal que las heces se oscurezcan.

Este producto es un suplemento dietario, no un medicamento. Si estás embarazada o tienes alguna condición de salud, consulta a tu médico antes de usarlo.`,
  },
  {
    id: 8, // Omega 3-6-9
    description: "Triple Omega 3-6-9 en 120 softgels. Aceite de pescado, linaza y borraja. Contribuye al funcionamiento normal del corazón y aporta ácidos grasos esenciales. Importado USA · Envío gratis +$150.000.",
    longDescription: `Fórmula que combina las tres familias de ácidos grasos en una sola cápsula. El Omega-3 (EPA y DHA del aceite de pescado) contribuye al funcionamiento normal del corazón. El Omega-6 (aceite de borraja) y el Omega-9 (aceite de linaza) aportan ácidos grasos que complementan la dieta.

Suele tomarlo gente que quiere cuidar su salud cardiovascular como parte de su rutina, personas con piel seca que buscan un aporte de grasas saludables, y quienes no consumen pescado con frecuencia.

Modo de uso: 1 softgel al día con comida. 120 softgels rinden 4 meses.

Este producto es un suplemento dietario, no un medicamento, y no reemplaza una alimentación equilibrada ni la indicación de un profesional de salud.`,
  },
  {
    id: 20, // Magnesio óxido 400
    description: "Magnesio Óxido 400mg en 250 tabletas. Aporte diario de magnesio que contribuye a la función muscular y nerviosa normales. Spring Valley original USA · Envío 24h Medellín.",
    longDescription: `Cada tableta aporta 400 mg de magnesio, cercano al aporte diario de referencia para adultos. El magnesio contribuye a la función muscular normal, al sistema nervioso normal, a la salud ósea y a reducir el cansancio.

Suele tomarlo gente activa y deportistas (el magnesio se pierde con el sudor), personas con estrés que quieren apoyar su descanso, y mayores de 50 años que buscan complementar este mineral.

Modo de uso: 1 tableta al día con comida, preferiblemente al almuerzo; si lo usas como apoyo al descanso, una hora antes de dormir. El óxido en dosis altas puede tener un efecto laxante leve los primeros días; si te molesta, divide la dosis. 250 tabletas rinden más de 8 meses.

Este producto es un suplemento dietario, no un medicamento. Si tienes problemas renales, consulta a tu médico antes de usarlo.`,
  },
];

async function main() {
  for (const u of updates) {
    await prisma.product.update({
      where: { id: u.id },
      data: { description: u.description, longDescription: u.longDescription },
    });
    console.log("Actualizado ID", u.id);
  }
  console.log("--- " + updates.length + " productos actualizados ---");
}
main().finally(() => process.exit(0));
