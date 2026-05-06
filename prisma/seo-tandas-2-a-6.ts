/**
 * SEO Tandas 2 a 6 — Productos restantes después de Tanda 1 (15 vitaminas top).
 *
 * Cubre:
 *  - Tanda 2: Vitaminas restantes (12 productos)
 *  - Tanda 3: Belleza (12 productos)
 *  - Tanda 4: Cabello (8 productos)
 *  - Tanda 5: Hogar, Herramientas y Más (14 productos)
 *
 * USO:
 *   npx tsx prisma/seo-tandas-2-a-6.ts
 *
 * Busca por palabra clave en el nombre (case-insensitive). Si no encuentra,
 * loguea sin romper. Es idempotente: puedes correrlo varias veces.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ProductUpdate = {
  match: string;          // palabra/frase única que identifica el producto
  category: string;       // Vitaminas | Belleza | Cabello | Salud | Hogar | Herramientas | Más productos
  name: string;
  brand: string;
  description: string;    // meta description corta (<160 chars)
  longDescription: string;
  features: string[];
};

const updates: ProductUpdate[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TANDA 2 · VITAMINAS Y SALUD RESTANTES (12 productos)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    match: "Tylenol",
    category: "Salud",
    brand: "Tylenol",
    name: "Tylenol Artritis 8HR Acetaminofén 650mg - 290 Cápsulas Dolor Articular",
    description: "Tylenol Artritis 8 horas con Acetaminofén 650mg. Alivio prolongado del dolor articular leve y moderado. 290 cápsulas. Original USA · Envío 24h Medellín.",
    longDescription:
      "Tylenol Artritis 8HR es la fórmula de liberación extendida más usada en Estados Unidos para el dolor articular crónico. Cada cápsula contiene 650mg de Acetaminofén que actúa hasta 8 horas con una sola toma — ideal para no estar pendiente del reloj cuando el dolor te limita.\n\nA diferencia de los antiinflamatorios (NSAIDs como Ibuprofeno), el Acetaminofén es suave con el estómago y no afecta la presión arterial. Es la primera línea recomendada por médicos para personas mayores con osteoartritis, dolor de rodillas o caderas, y para quienes no toleran NSAIDs.\n\nAyuda a reducir el dolor matutino y la rigidez al despertar, dolor articular después de caminar o esfuerzo, dolores musculares moderados, dolor lumbar y lumbalgia leve, dolor de cabeza tensional persistente.\n\nIMPORTANTE: NO mezclar con alcohol (afecta el hígado). NO superar 4,000mg/día (6 cápsulas). Si tienes problemas hepáticos, consulta a tu médico antes.\n\n290 cápsulas = aproximadamente 100 días de uso a 2 cápsulas cada 8 horas. Marca recomendada por farmacéuticos en USA.",
    features: [
      "Acetaminofén 650mg liberación extendida",
      "Hasta 8 horas de alivio por toma",
      "290 cápsulas — rendidor",
      "Suave con el estómago (no es NSAID)",
      "Ideal para osteoartritis y dolor articular",
      "Recomendado para mayores 50+",
      "Original importado de USA",
    ],
  },
  {
    match: "Preparation H",
    category: "Salud",
    brand: "Preparation H",
    name: "Preparation H Ungüento Hemorroides - Alivio Rápido del Picor y Ardor",
    description: "Ungüento Preparation H para hemorroides. Alivia picor, ardor e inflamación interna y externa. Marca #1 en USA. Envío gratis +$150.000 Medellín.",
    longDescription:
      "Las hemorroides afectan a 1 de cada 2 adultos mayores de 50 años — pero pocos hablan de ello. Si sientes picor, ardor o ves sangrado leve al ir al baño, este ungüento es el alivio más rápido y discreto disponible sin receta.\n\nPreparation H es la marca #1 en Estados Unidos para hemorroides hace más de 80 años. Su fórmula combina activos que reducen la inflamación, encogen tejidos hinchados, alivian el picor en minutos, calman el ardor al evacuar y forman una barrera protectora.\n\nÚtil para hemorroides internas y externas, fisuras anales menores, irritación postparto, picazón anal nocturna, malestar en el área después de evacuaciones difíciles.\n\nMODO DE USO: Aplicar hasta 4 veces al día, especialmente después de evacuaciones y antes de dormir. Lavar el área con agua tibia, secar suavemente y aplicar una capa fina con el aplicador incluido.\n\nLa mayoría siente alivio en 30 minutos. Para casos crónicos, usar continuamente por 7-14 días. Si el sangrado persiste más de 7 días, consulta a un proctólogo.",
    features: [
      "Marca #1 en USA hace 80+ años",
      "Alivio en menos de 30 minutos",
      "Reduce inflamación y tejidos hinchados",
      "Calma picor y ardor al instante",
      "Para hemorroides internas y externas",
      "Aplicador incluido — uso higiénico",
      "Sin receta médica",
    ],
  },
  {
    match: "Devrom",
    category: "Salud",
    brand: "Devrom",
    name: "Devrom Desodorante Interno 200mg - 100 Tabletas Masticables Anti-Olor",
    description: "Devrom desodorante interno con Subgalato de Bismuto 200mg. Neutraliza olores corporales desde adentro. 100 tabletas masticables. Original USA · Envío 24h Medellín.",
    longDescription:
      "Devrom es el desodorante interno #1 recomendado para personas con ostomías (colostomía, ileostomía), incontinencia fecal o flatulencia excesiva. Su único ingrediente activo es Subgalato de Bismuto 200mg, un compuesto seguro que neutraliza los compuestos sulfurados responsables del mal olor antes de que salgan del cuerpo.\n\n¿Para quién es? Personas con ostomía o bolsa de colostomía, pacientes postquirúrgicos digestivos, personas con flatulencia frecuente y olor fuerte, mayores con incontinencia ocasional, pacientes con SIBO o malabsorción.\n\nDevrom no detiene los gases ni la digestión — solo elimina el olor. Es seguro de tomar a largo plazo porque el bismuto no se absorbe en cantidades significativas. Aprobado por la FDA y respaldado por la United Ostomy Association.\n\nMODO DE USO: Masticar 1-2 tabletas con cada comida (3-4 veces al día). Sabor a vainilla, fácil de tomar. Resultado notable en 24-48 horas.\n\nNOTA: Las heces pueden tornarse oscuras — es normal y no es sangrado. La lengua también puede oscurecerse temporalmente.",
    features: [
      "Subgalato de Bismuto 200mg",
      "Neutraliza olor desde adentro",
      "100 tabletas masticables sabor vainilla",
      "Para ostomías y postquirúrgicos",
      "Recomendado por United Ostomy Association",
      "Seguro a largo plazo · Aprobado FDA",
      "Resultado en 24-48 horas",
    ],
  },
  {
    match: "Potasio",
    category: "Vitaminas",
    brand: "Spring Valley",
    name: "Spring Valley Potasio Gluconato 99mg - Salud Cardiovascular y Muscular",
    description: "Potasio Gluconato 99mg de Spring Valley. Apoya la función cardíaca, presión arterial y equilibrio muscular. Importado USA · Envío gratis +$150.000 Medellín.",
    longDescription:
      "El potasio es el mineral más importante para la salud cardiovascular — pero también el más subestimado. Si tienes presión alta, calambres frecuentes, fatiga inexplicable o tomas diuréticos, probablemente tu cuerpo necesita más potasio del que recibe.\n\nBeneficios principales: regula la presión arterial (contrarresta el efecto del sodio), previene calambres musculares, apoya la función cardíaca rítmica, mejora la energía celular, protege contra accidentes cerebrovasculares.\n\nIdeal para personas con hipertensión arterial, atletas y deportistas (lo pierdes con el sudor), quienes toman diuréticos para la presión, mayores de 50 años, personas con dieta baja en frutas y verduras.\n\n99mg cubre alrededor del 2% de tu necesidad diaria — pero esa es exactamente la cantidad recomendada por la FDA en suplementos para evitar irritación gastrointestinal. El resto debe venir de la dieta (banano, espinaca, papa, frijoles).\n\nIMPORTANTE: Si tomas medicamentos para la presión (IECA, ARA II, espironolactona) o tienes problemas renales, consulta a tu médico antes — el exceso de potasio en estas condiciones puede ser peligroso.\n\n1 tableta al día con comida. Sin gluten, sin lácteos.",
    features: [
      "Potasio Gluconato 99mg",
      "Apoya función cardíaca y presión",
      "Reduce calambres musculares",
      "Ideal para deportistas",
      "Para mayores 50+ con hipertensión",
      "1 tableta al día con comida",
      "Spring Valley premium USA",
    ],
  },
  {
    match: "Extra Strength",
    category: "Vitaminas",
    brand: "Spring Valley",
    name: "Spring Valley Biotina 10,000mcg Extra Strength - Cápsulas Cabello y Uñas",
    description: "Biotina Extra Strength 10,000mcg de Spring Valley en cápsulas. Dosis máxima para caída del cabello y uñas débiles. Original USA · Envío 24h Medellín.",
    longDescription:
      "Si las gomitas de biotina te quedan cortas o prefieres no consumir azúcar, esta es tu solución. 10,000 mcg de biotina pura en una cápsula vegetariana, sin endulzantes ni saborizantes — solo el activo en su máxima concentración.\n\n¿Por qué cápsulas en vez de gomitas? Las cápsulas no tienen azúcar añadida (importante si eres diabética o cuidas tu glucosa), son más concentradas (1 cápsula reemplaza 2-3 gomitas), no tienen colorantes ni gelatina, son más rendidoras y económicas por dosis.\n\nDosis ideal cuando hay caída del cabello más severa, alopecia areata o postparto, uñas que se quiebran constantemente, después de un tratamiento médico que afectó el cabello (quimio, postoperatorio), cabello muy fino que no crece más allá de cierto largo.\n\nResultados típicos: Mes 1 menos caída visible al peinar y bañarte, Mes 2 cabello nuevo en la línea de nacimiento, Mes 3 uñas notablemente más duras y largas, cabello con más cuerpo.\n\nIMPORTANTE: Si te haces exámenes de tiroides (TSH, T4), suspende la biotina 3 días antes — puede alterar resultados.\n\n1 cápsula al día con un vaso de agua. Spring Valley es la marca de Walmart con relación calidad-precio imbatible.",
    features: [
      "Biotina pura 10,000mcg en cápsula",
      "Sin azúcar — apta para diabéticas",
      "Más concentrada que las gomitas",
      "Para caída severa y alopecia",
      "1 cápsula al día",
      "Vegetariana · sin colorantes",
      "Resultados en 4-12 semanas",
    ],
  },
  {
    match: "Kid",
    category: "Vitaminas",
    brand: "Spring Valley",
    name: "Spring Valley Kid's Multi - Multivitamínico para Niños en Gomitas",
    description: "Multivitamínico completo en gomitas para niños. 13 vitaminas y minerales esenciales. Sabor frutas naturales. Importado USA · Envío gratis Medellín.",
    longDescription:
      "Los niños no comen como deberían — eso lo sabemos todos. Si tu hijo es selectivo con la comida, no come suficientes vegetales, o quieres asegurar su crecimiento óptimo, este multivitamínico cubre lo que la dieta no alcanza.\n\nFórmula con 13 nutrientes esenciales para niños mayores de 4 años: Vitamina A (visión y piel), C (defensas), D3 (huesos y crecimiento), E (antioxidante), B6, B12 (energía y desarrollo cerebral), Ácido fólico, Biotina, Yodo (función tiroidea), Zinc (inmunidad), Niacina, Pantotenato, Riboflavina.\n\nLos pediatras recomiendan multivitamínicos para niños con apetito selectivo, dietas restringidas (vegetarianas, alergias), después de enfermedades, en etapas de crecimiento rápido, durante temporada escolar (más exposición a virus).\n\nSabor frutas naturales (cereza, naranja, fresa). 2 gomitas al día con comida. Sin gluten ni lácteos. Sin colorantes artificiales. Apto para niños desde los 4 años.\n\nIMPORTANTE: Mantener fuera del alcance de niños menores de 4 años — pueden confundirlas con dulces. No exceder la dosis. Si el niño toma otros suplementos, consulta a su pediatra.",
    features: [
      "13 vitaminas y minerales",
      "Sabor frutas naturales",
      "Para niños 4+ años",
      "2 gomitas al día con comida",
      "Sin colorantes artificiales",
      "Sin gluten ni lácteos",
      "Apoya crecimiento e inmunidad",
    ],
  },
  {
    match: "Magnesio Óxido 400",
    category: "Vitaminas",
    brand: "Spring Valley",
    name: "Spring Valley Magnesio Óxido 400mg - 250 Tabletas Dosis Completa",
    description: "Magnesio Óxido 400mg en 250 tabletas. Dosis diaria completa para músculos, sueño y corazón. Spring Valley original USA · Envío 24h Medellín.",
    longDescription:
      "400mg es la dosis diaria recomendada de magnesio para adultos — y muy pocos suplementos ofrecen esa cantidad en una sola tableta. Si quieres cubrir tu necesidad completa sin tomar varias pastillas al día, esta es la opción más eficiente.\n\nBeneficios respaldados por evidencia: relajación muscular profunda (calambres adiós), mejora calidad del sueño REM, reduce ansiedad e irritabilidad, baja la presión arterial, regula el ritmo cardíaco, apoya la salud ósea, mejora resistencia a la insulina.\n\nIdeal para atletas y deportistas (perdes 25% del magnesio con sudor intenso), personas con migraña menstrual, mujeres en menopausia (insomnio, cambios de humor), mayores de 50 años con presión alta, diabéticos tipo 2, personas con estrés crónico.\n\n250 tabletas = más de 8 meses de tratamiento. Una de las mejores relaciones precio-rendimiento del mercado.\n\nIMPORTANTE: El magnesio óxido en altas dosis puede causar efecto laxante leve los primeros días. Si te molesta, divide la dosis (1 al desayuno y 1 a la noche). Si tienes problemas renales, consulta antes.\n\n1 tableta al día con comida, preferiblemente al almuerzo. Si lo tomas para dormir, una hora antes.",
    features: [
      "Magnesio Óxido 400mg dosis completa",
      "250 tabletas — más de 8 meses",
      "Mejora sueño profundo",
      "Reduce calambres y ansiedad",
      "Baja presión arterial",
      "Para atletas y mayores 50+",
      "Mejor precio-rendimiento",
    ],
  },
  {
    match: "Calcio 600",
    category: "Vitaminas",
    brand: "Spring Valley",
    name: "Spring Valley Calcio 600mg + Vitamina D3 - Huesos Fuertes y Osteoporosis",
    description: "Calcio 600mg + Vitamina D3 en tabletas. Previene osteoporosis y fracturas en mujeres 35+. Spring Valley original USA · Envío gratis Medellín.",
    longDescription:
      "A partir de los 30 años, las mujeres comienzan a perder densidad ósea. A los 50, el riesgo de osteoporosis se dispara. Y a los 65, una de cada 3 mujeres ha tenido una fractura por fragilidad ósea. La buena noticia: con calcio + vitamina D3 diarios, este proceso se puede detener — y hasta revertir parcialmente.\n\nPor qué necesitas D3 con el calcio: la vitamina D3 es la \"llave\" que permite a tu cuerpo absorber el calcio. Sin ella, puedes tomar todo el calcio del mundo y no se queda en los huesos. Por eso esta fórmula los combina en la dosis exacta que tu cuerpo necesita.\n\n600mg de calcio = 50% de la necesidad diaria. Si tu dieta tiene lácteos, esto cubre lo que falta. Si no consumes lácteos (intolerancia o vegana), considera tomar 2 tabletas al día.\n\nIdeal para mujeres 35+ años (prevención temprana), premenopausia y menopausia (riesgo aumentado), veganas e intolerantes a lactosa, después de fracturas o cirugías óseas, durante embarazo y lactancia (consultar dosis con obstetra).\n\n1 tableta al día con la comida principal. El calcio se absorbe mejor con grasas y peor con café/té (espera 1 hora).\n\nLa osteoporosis no avisa hasta que ocurre la fractura. La prevención empieza HOY.",
    features: [
      "Calcio 600mg + Vitamina D3",
      "Previene osteoporosis y fracturas",
      "Para mujeres 35+ y menopausia",
      "D3 mejora absorción del calcio",
      "Apta veganas e intolerantes lactosa",
      "1 tableta al día con comida",
      "Spring Valley premium USA",
    ],
  },
  {
    match: "Selenio",
    category: "Vitaminas",
    brand: "Spring Valley",
    name: "Spring Valley Selenio 200mcg - Tiroides y Antioxidante Premium",
    description: "Selenio 200mcg de Spring Valley. Apoya función tiroidea, sistema inmune y protección antioxidante. Importado USA · Envío 24h Medellín.",
    longDescription:
      "El selenio es el mineral más subestimado para la salud — y uno de los más deficientes en suelos modernos. Si tienes problemas de tiroides, fatiga crónica, infecciones recurrentes o cabello que se cae sin razón, una deficiencia de selenio puede ser parte del problema.\n\nFunciones críticas: convierte la T4 (tiroides inactiva) en T3 (activa), antioxidante celular más potente del cuerpo, fortalece sistema inmune (esencial para defensas), apoya producción de esperma de calidad, protege contra envejecimiento celular, reduce riesgo de algunos cánceres (próstata, colon).\n\nIdeal para personas con hipotiroidismo o Hashimoto, fatiga inexplicable, sistema inmune débil, hombres con problemas de fertilidad, fumadores y bebedores (mayor estrés oxidativo), personas con dieta vegetariana estricta.\n\nDOSIS: 200mcg al día es la dosis terapéutica más estudiada. NO superar 400mcg/día — el selenio en exceso es tóxico (selenosis). Con 1 tableta diaria estás cubierta.\n\n1 tableta al día con comida. Resultados en función tiroidea suelen verse en exámenes de sangre tras 8-12 semanas de uso continuo.\n\nDato curioso: Brasil tiene los suelos más ricos en selenio del mundo. Pero los suelos colombianos son pobres en este mineral, por eso es tan común la deficiencia aquí.",
    features: [
      "Selenio 200mcg dosis terapéutica",
      "Apoya función tiroidea",
      "Antioxidante celular potente",
      "Refuerza sistema inmune",
      "Para hipotiroidismo y Hashimoto",
      "1 tableta al día con comida",
      "Mejora fertilidad masculina",
    ],
  },
  {
    match: "Zinc 50mg Masticable",
    category: "Vitaminas",
    brand: "Spring Valley",
    name: "Spring Valley Zinc 50mg Masticable Sabor Frutas - Sistema Inmune",
    description: "Zinc 50mg en tabletas masticables sabor frutas. Refuerza inmunidad sin tragar pastillas. 150 tabletas Spring Valley · Envío gratis Medellín.",
    longDescription:
      "Si te cuesta tragar cápsulas, esta es tu solución. 50mg de zinc en una tableta masticable con sabor frutal natural — la misma efectividad que las cápsulas pero más fácil y agradable de tomar.\n\n¿Por qué tomar zinc? Es el mineral más importante para tu sistema inmune. Si te enfermas con frecuencia, tienes acné persistente, las heridas tardan en sanar, perdiste el sentido del gusto u olfato (post-Covid común), o tu cabello cae sin razón, una deficiencia de zinc puede ser la causa.\n\nBeneficios: refuerza defensas (menos resfriados y gripes), acelera cicatrización de heridas, mejora acné y piel grasa, apoya salud reproductiva masculina (próstata, fertilidad), restaura gusto y olfato, mejora función cognitiva, reduce duración de resfriados si se toma en las primeras 24h.\n\nIdeal para resfriados frecuentes, acné adulto, hombres (próstata), mayores de 60 años, atletas, después de cirugías, post-Covid con pérdida de gusto/olfato, vegetarianos.\n\nMASTICAR 1 tableta al día CON comida. Sin masticar con el estómago vacío puede causar náusea. NO tomar más de 8 semanas seguidas a 50mg sin descanso (el zinc en exceso baja el cobre).\n\nSabor mezcla de cereza, naranja y fresa. Sin gluten, sin lácteos.",
    features: [
      "Zinc 50mg masticable sabor frutas",
      "Sin necesidad de tragar pastillas",
      "150 tabletas — 5 meses",
      "Refuerza sistema inmune",
      "Reduce duración de resfriados",
      "Mejora acné y cicatrización",
      "Para mayores y post-Covid",
    ],
  },
  {
    match: "Pepcid",
    category: "Salud",
    brand: "Pepcid",
    name: "Pepcid Complete Dual Action - 100 Tabletas Antiácido Reflujo Inmediato",
    description: "Pepcid Complete antiácido doble acción con Famotidina y Calcio. Alivio inmediato de acidez y reflujo. 100 tabletas masticables sabor berry. Original USA.",
    longDescription:
      "Pepcid Complete es el único antiácido en USA con doble acción: alivia el reflujo en menos de 60 segundos Y previene que vuelva por hasta 9 horas. Si sufres de acidez recurrente, gastritis o reflujo después de comer, esta es la solución más completa sin receta.\n\nDOBLE ACCIÓN explicada:\n  1) Carbonato de Calcio + Hidróxido de Magnesio: neutralizan el ácido que ya está en tu estómago — alivio instantáneo del ardor.\n  2) Famotidina 10mg: bloquea la producción de NUEVO ácido por hasta 9 horas — previene que regrese.\n\nMedicamentos comunes solo hacen una de las dos cosas. Por eso este es superior — actúa rápido y dura toda la noche.\n\nIdeal para reflujo gastroesofágico (GERD) leve a moderado, acidez después de comidas pesadas, ardor estomacal nocturno, indigestión recurrente, gastritis crónica, embarazadas con acidez (consultar obstetra antes), comilonas o cenas tarde.\n\nMASTICAR 1 tableta al primer signo de acidez. Puedes tomar hasta 2 al día. NO tomar más de 14 días seguidos sin consultar médico — el reflujo persistente puede indicar otra condición.\n\n100 tabletas masticables sabor berry. Sin azúcar.",
    features: [
      "Doble acción: alivio + prevención",
      "Famotidina 10mg + antiácidos",
      "Alivio en menos de 60 segundos",
      "Hasta 9 horas de protección",
      "100 tabletas masticables",
      "Sabor berry sin azúcar",
      "Para GERD y gastritis leve",
    ],
  },
  {
    match: "Advil",
    category: "Salud",
    brand: "Advil",
    name: "Advil Ibuprofeno 200mg - Analgésico y Antifiebre USA Original",
    description: "Advil Ibuprofeno 200mg en cápsulas. Alivia dolor de cabeza, muscular, menstrual y fiebre. La marca #1 de NSAID en USA · Envío 24h Medellín.",
    longDescription:
      "Advil es el ibuprofeno original — la marca de Pfizer que estableció el estándar mundial para el alivio del dolor sin receta. Cada cápsula tiene 200mg de Ibuprofeno (NSAID), un potente analgésico, antiinflamatorio y antifebril.\n\n¿Para qué sirve? Dolor de cabeza tensional y migraña, dolor menstrual y cólicos, dolor muscular y articular, dolor dental y postoperatorio menor, fiebre alta, dolor lumbar y de espalda, esguinces e inflamaciones leves.\n\nDIFERENCIA vs Acetaminofén (Tylenol): el ibuprofeno también REDUCE inflamación, no solo el dolor. Por eso es mejor para dolores con componente inflamatorio (artritis, lesiones, cólicos menstruales). Acetaminofén es mejor para dolor solo.\n\nDOSIS: 1-2 cápsulas cada 4-6 horas. Máximo 6 cápsulas al día. SIEMPRE tomar con comida o leche para proteger el estómago.\n\nPRECAUCIONES IMPORTANTES: NO tomar con el estómago vacío (puede causar gastritis). NO mezclar con otros NSAIDs. NO usar más de 10 días seguidos sin consultar médico. Evitar si tienes úlcera, problemas renales o tomas anticoagulantes. Embarazadas: NO en último trimestre.\n\nCápsulas recubiertas — más fáciles de tragar y más rápidas que las tabletas tradicionales.",
    features: [
      "Ibuprofeno 200mg cápsulas líquidas",
      "Alivio rápido en 15-30 min",
      "Analgésico + antiinflamatorio",
      "Para dolor menstrual y cólicos",
      "Reduce fiebre rápidamente",
      "TOMAR CON COMIDA",
      "Marca #1 mundial",
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TANDA 3 · BELLEZA Y CUIDADO PERSONAL (12 productos)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    match: "Bubble Slam Dunk",
    category: "Belleza",
    brand: "Bubble",
    name: "Bubble Slam Dunk - Crema Hidratante Facial Vegana 50ml Skincare Coreano",
    description: "Crema hidratante facial Bubble Slam Dunk 50ml. Vegana, sin parabenos, ideal para piel grasa y mixta. Estilo skincare coreano. Original USA · Envío Medellín.",
    longDescription:
      "Bubble es la marca de skincare más viral entre Gen Z y millennials en Estados Unidos — accesible, vegana, libre de crueldad y diseñada para piel adolescente y adulta joven. Su hidratante Slam Dunk se volvió best-seller por una razón: hidrata sin sentirse pesada, no tapa poros y deja la piel con efecto \"glass skin\".\n\nIngredientes activos clave: ácido hialurónico (hidratación profunda), niacinamida (controla brillo y poros), ceramidas (refuerzan barrera cutánea), aceite de jojoba (no comedogénico), antioxidantes vegetales.\n\nIdeal para piel grasa o mixta, pieles jóvenes 14-30 años, quienes prefieren cosmética vegana, después de exfoliantes o ácidos (calma), antes del maquillaje (deja base perfecta).\n\nUSO: Aplicar mañana y noche sobre rostro y cuello limpio. Esperar 1 minuto antes de maquillaje. Para máxima hidratación, aplicar sobre piel ligeramente húmeda.\n\n100% vegana, libre de crueldad animal, sin parabenos, sin sulfatos, sin fragancias agresivas, dermatológicamente probado, hipoalergénica.\n\n50ml = aproximadamente 3 meses de uso diario.",
    features: [
      "Hidratante facial vegana 50ml",
      "Ácido hialurónico + niacinamida",
      "Para piel grasa y mixta",
      "Efecto glass skin coreano",
      "Sin parabenos ni sulfatos",
      "Libre de crueldad animal",
      "Mañana y noche · 3 meses",
    ],
  },
  {
    match: "AMBI",
    category: "Belleza",
    brand: "AMBI",
    name: "AMBI Jabón Aclarante Facial y Corporal - Pack 2 Barras 99g Manchas",
    description: "Jabón AMBI aclarante para manchas, paño y melasma. Pack x2 barras 3.5oz. Para todo tipo de piel. Importado USA · Envío gratis +$150.000 Medellín.",
    longDescription:
      "AMBI es la marca histórica en USA para el cuidado de la piel con tendencia a la hiperpigmentación. Su jabón aclarante facial y corporal ayuda a unificar el tono, atenuar manchas oscuras, paño hormonal (melasma), y marcas de acné en piel media a oscura.\n\nIngredientes activos: ácido salicílico (exfolia células muertas), aloe vera (calma irritación), vitamina E (antioxidante).\n\nIdeal para manchas de sol y envejecimiento, melasma o paño durante el embarazo, marcas oscuras post-acné (PIH), codos y rodillas oscurecidas, axilas e ingles con hiperpigmentación, piel mestiza y morena con manchas dispersas.\n\nUSO: Lavar la zona 1-2 veces al día con masaje suave. Dejar actuar 30 segundos. Enjuagar con agua tibia. Aplicar SIEMPRE protector solar SPF 50+ durante el día (esto es crítico — sin protector, las manchas vuelven).\n\nResultados visibles entre 4-8 semanas de uso continuo. Para manchas profundas, combinar con tratamiento de hidroquinona dirigido por dermatólogo.\n\nPack de 2 barras de 3.5oz cada una. 100% original importado.\n\nIMPORTANTE: No usar en piel rota o irritada. Si hay ardor, suspender. Aumenta sensibilidad al sol — protector obligatorio.",
    features: [
      "Aclarante para manchas y paño",
      "Pack x2 barras 99g cada una",
      "Para piel mestiza y morena",
      "Ácido salicílico + aloe + vit E",
      "Resultados en 4-8 semanas",
      "Cara y cuerpo",
      "Marca histórica en USA",
    ],
  },
  {
    match: "Earth Therapeutics",
    category: "Belleza",
    brand: "Earth Therapeutics",
    name: "Earth Therapeutics Bálsamo Pies Aloe Té Manzanilla 118ml Reparador",
    description: "Bálsamo terapéutico para pies con Aloe Vera, Árbol de Té y Manzanilla. Repara pies secos y agrietados. 118ml · Envío 24h Medellín.",
    longDescription:
      "Si caminas mucho, usas tacones, sufres de pies resecos o agrietados en talones, este bálsamo de Earth Therapeutics es la cura más efectiva sin necesidad de pedicure profesional.\n\nFórmula 100% terapéutica con: aloe vera (hidrata profundo), aceite de árbol de té (antibacteriano y antifúngico — previene hongos), manzanilla (calma irritación), manteca de karité (reconstruye piel), aceite de coco (suaviza), vitamina E (regenera).\n\nIdeal para talones agrietados con grietas profundas, pies resecos por uso de chancla y zapato cerrado, callosidades en planta del pie, hongos leves entre dedos (uso continuo previene), diabéticos con piel sensible (con aprobación médica), embarazadas con cambios circulatorios.\n\nUSO INTENSIVO: Aplicar generosamente antes de dormir, masajear hasta absorber, ponerse medias de algodón. Resultados notorios en 5-7 noches.\n\nUSO MANTENIMIENTO: Aplicar cada noche después del baño. Suficiente con una cantidad pequeña.\n\nFragancia mentolada suave que también desinflama pies cansados. Vegano, libre de crueldad, sin parabenos.\n\n118ml = aproximadamente 4 meses de uso diario.",
    features: [
      "Aloe + Árbol de Té + Manzanilla",
      "Repara talones agrietados",
      "Antifúngico natural",
      "Calma pies cansados",
      "Para diabéticos y embarazadas",
      "118ml · 4 meses de uso",
      "Vegano sin parabenos",
    ],
  },
  {
    match: "Dove Men",
    category: "Belleza",
    brand: "Dove Men+Care",
    name: "Dove Men+Care Extra Fresh - Antitranspirante 72h Pack 2 Barras Hombre",
    description: "Antitranspirante Dove Men+Care Extra Fresh con protección 72 horas. Pack x2 barras. Cuida piel masculina · Envío gratis +$150.000 Medellín.",
    longDescription:
      "Dove Men+Care Extra Fresh es el antitranspirante más recomendado por dermatólogos para hombres con piel sensible — protección de 72 horas sin causar irritación, picazón ni manchas en la ropa.\n\nA diferencia de antitranspirantes baratos que cierran los poros con químicos agresivos, Dove Men+Care contiene 1/4 de crema hidratante para cuidar la piel mientras protege contra el sudor y el olor.\n\nFórmula con sales de aluminio en concentración óptima (efectiva pero suave), aroma fresco mentolado masculino, no deja manchas blancas en camisetas oscuras, no decolora las telas claras (óxido amarillo).\n\nIdeal para hombres con piel sensible o irritación con otros desodorantes, personas que sudan mucho (hiperhidrosis leve), uso diario de oficina y deporte ligero, después de afeitar las axilas (no irrita).\n\nAPLICAR sobre axilas limpias y secas. 2-3 pasadas por axila son suficientes. Esperar 30 segundos antes de vestirse.\n\nPack de 2 barras de 76g cada una = 4-5 meses de uso para 1 persona. Importado original de USA.",
    features: [
      "Protección 72 horas",
      "Pack x2 barras 76g",
      "Cuida la piel masculina",
      "Sin manchas amarillas o blancas",
      "Aroma fresco mentolado",
      "Para piel sensible",
      "Original USA · 4 meses uso",
    ],
  },
  {
    match: "Secret Powder",
    category: "Belleza",
    brand: "Secret",
    name: "Secret Powder Fresh - Antitranspirante Mujer pH Balanceado Larga Duración",
    description: "Antitranspirante Secret Powder Fresh para mujer. Protección larga duración con pH balanceado. Original USA · Envío 24h Medellín.",
    longDescription:
      "Secret Powder Fresh es el clásico americano que todas las mujeres usan en USA — la fragancia limpia y polveada que dice \"acabo de salir de la ducha\" todo el día. Con tecnología de pH balanceado especial para piel femenina.\n\n¿Por qué Secret? Está formulado para la química única de la piel femenina (más sensible que la masculina), tiene partículas que atacan los olores antes de aparecer, no irrita la piel rasurada, no mancha ropa oscura ni clara, fragancia suave que no compite con tu perfume.\n\nLa fórmula Powder Fresh tiene aroma a limpio y bebé — no agresivo ni dulzón. Ideal para uso diario, oficina, eventos profesionales.\n\nIdeal para mujeres adolescentes y adultas, después de rasurarse axilas (no arde), piel sensible que reacciona a otros desodorantes, sudoración normal a moderada, uso diario y eventos sociales.\n\nAPLICAR 2-3 pasadas en cada axila limpia y seca. Esperar 30 segundos antes de vestir. Para días de mucho sudor, aplicar también la noche anterior (la protección ya estará activa por la mañana).\n\nIMPORTANTE: Si tienes hiperhidrosis (sudoración excesiva), considera un Clinical Strength más fuerte. Para uso normal, esto es suficiente.",
    features: [
      "Aroma fresco y limpio",
      "pH balanceado para mujer",
      "No mancha ropa",
      "No irrita piel rasurada",
      "Larga duración diaria",
      "Marca clásica USA",
      "Para uso diario y oficina",
    ],
  },
  {
    match: "Secret Spring Breeze",
    category: "Belleza",
    brand: "Secret",
    name: "Secret Spring Breeze - Antitranspirante Mujer Aroma Floral Fresco",
    description: "Antitranspirante Secret Spring Breeze. Fragancia floral fresca de larga duración. Original USA · Envío gratis +$150.000 Medellín.",
    longDescription:
      "Secret Spring Breeze es la versión floral del clásico Secret — aroma a flores blancas y brisa fresca que evoca un día de primavera. Si te gustan las fragancias femeninas que duran horas sin ser empalagosas, esta es tu opción.\n\nFormulación idéntica al Powder Fresh (mismo pH balanceado, misma protección), solo cambia la fragancia. Sales de aluminio efectivas pero suaves con la piel femenina.\n\nIdeal para mujeres que prefieren aromas florales sobre los polveados, eventos sociales y citas (deja una estela suave), después de rasurarse axilas, uso diario de oficina, días de mucho movimiento.\n\nAPLICAR 2-3 pasadas en cada axila limpia y seca. Esperar 30 segundos antes de vestirse. La fragancia se intensifica con el calor corporal — perfecta para clima cálido.\n\nNo mancha ropa, no decolora telas oscuras, no causa irritación post-rasurado. Apto para piel sensible.\n\nImportado original de Estados Unidos. La fórmula está hecha específicamente para la química femenina y NO debe ser usada por hombres (no proporciona la misma protección).",
    features: [
      "Aroma floral fresco primavera",
      "Larga duración con calor",
      "Sin manchas en ropa",
      "Apto piel sensible y rasurada",
      "pH balanceado mujer",
      "Para citas y eventos",
      "Importado original USA",
    ],
  },
  {
    match: "Degree Men",
    category: "Belleza",
    brand: "Degree",
    name: "Degree Men Tamaño Viaje - Antitranspirante 48h Activado por Movimiento",
    description: "Degree Men antitranspirante tamaño viaje. Tecnología activada por movimiento, 48 horas de protección. Cabe en cualquier maleta · Envío 24h Medellín.",
    longDescription:
      "Degree Men es el único antitranspirante con tecnología MotionSense — micro-cápsulas que liberan más fragancia y protección cuando MÁS te mueves. Mientras más sudas, más activa la protección.\n\nEste tamaño viaje es perfecto para llevar al gym, viajes de fin de semana, oficina (cabina de respaldo en el escritorio), maleta de mano (cumple regulaciones aéreas), uso esporádico.\n\nProtección 48 horas garantizada — incluso después de bañarte no pierdes la cobertura. Aroma fresco masculino que no compite con perfumes ni colonias.\n\nIdeal para hombres activos, deportistas, viajeros frecuentes, profesionales de oficina, adolescentes en etapa de descubrimiento de hábitos de higiene, uso diario.\n\nAPLICAR 2-3 pasadas en cada axila limpia y seca antes de vestirse o de actividad física. Para deporte intenso, aplicar también después de bañarse al volver.\n\nFormato compacto perfecto para acompañar tu kit de viaje. Una compra ideal para tener una de respaldo.",
    features: [
      "Tecnología MotionSense",
      "Protección 48 horas",
      "Tamaño viaje compacto",
      "Cumple regulaciones aéreas",
      "Aroma fresco masculino",
      "Para deportistas activos",
      "Ideal kit de viaje",
    ],
  },
  {
    match: "Fixodent",
    category: "Salud",
    brand: "Fixodent",
    name: "Fixodent Original Complete - Pack 3 Adhesivos Dentaduras Postizas",
    description: "Adhesivo dental Fixodent Original. Sujeción firme todo el día para dentaduras postizas. Pack x3 tubos. Original USA · Envío 24h Medellín.",
    longDescription:
      "Fixodent es la marca #1 mundial en adhesivos para dentaduras postizas — recomendado por más dentistas que cualquier otra marca. Si usas placa parcial o completa, este adhesivo te garantiza sujeción firme durante todo el día sin preocupaciones.\n\n¿Por qué Fixodent? Sujeción comprobada de 12+ horas, sella la dentadura para evitar que comida se filtre debajo, sabor neutro (no afecta el de la comida), elegible para HSA y FSA en USA, fórmula clínicamente probada por dentistas.\n\nIdeal para usuarios de dentadura postiza completa o parcial, recién operados con prótesis nuevas (mientras se acostumbran), personas mayores con encías cambiantes, casos de retención difícil donde la dentadura no queda bien ajustada.\n\nMODO DE USO: Aplicar 4-5 puntos pequeños sobre la base seca de la dentadura. Humedecer ligeramente con agua. Colocar sobre las encías y presionar 30 segundos. Esperar 5 minutos antes de comer o tomar líquidos calientes.\n\nPack de 3 tubos de 2.4oz (68g) cada uno = aproximadamente 9-12 meses de uso diario.\n\nIMPORTANTE: Lavar la dentadura todos los días para evitar acumulación. Si usas más de 4-5 puntos por aplicación, probablemente la dentadura necesita ajuste por el dentista.",
    features: [
      "Marca #1 recomendada por dentistas",
      "Sujeción 12+ horas comprobada",
      "Pack x3 tubos 68g",
      "9-12 meses de uso",
      "Sabor neutro",
      "Para dentadura completa o parcial",
      "Original USA · Pfizer",
    ],
  },
  {
    match: "Irish Spring",
    category: "Belleza",
    brand: "Irish Spring",
    name: "Irish Spring Gel de Ducha Hombre - Frescura 24h Tecnología Anti-Olor",
    description: "Gel de ducha Irish Spring para hombres. Frescura 24h con tecnología neutralizadora. Sin parabenos, biodegradable. Importado USA · Envío gratis Medellín.",
    longDescription:
      "Irish Spring es el clásico americano para hombres — el gel de ducha que dice \"limpio y fresco\" desde el primer minuto. Con tecnología anti-olor que va más allá del simple aroma: neutraliza bacterias responsables del olor corporal por hasta 24 horas después del baño.\n\nFórmula 2026 mejorada: 24 horas de frescura comprobada, tecnología neutralizadora de olores (no solo perfuma — elimina), libre de parabenos y ftalatos, ingredientes biodegradables (responsable con el ambiente), hidrata mientras limpia, no reseca la piel masculina.\n\nIdeal para hombres con sudoración fuerte después del gym, profesionales que necesitan frescura todo el día sin reaplicar, adolescentes en etapa de cambio corporal, uso diario en familia (apto para hombres jóvenes y mayores), después de actividad física intensa.\n\nUSO: Aplicar sobre esponja o directo sobre la piel mojada. Masajear todo el cuerpo (especialmente axilas, ingle y pies). Enjuagar bien.\n\nAroma fresco mentolado masculino que combina perfectamente con desodorantes y colonias. No es excesivamente fuerte — mantiene su frescura sin saturar.\n\nFormato económico para uso familiar o personal de larga duración.",
    features: [
      "24 horas de frescura",
      "Tecnología anti-olor real",
      "Sin parabenos ni ftalatos",
      "Biodegradable",
      "Hidrata sin resecar",
      "Aroma masculino mentolado",
      "Importado USA original",
    ],
  },
  {
    match: "Lápiz",
    category: "Belleza",
    brand: "e.l.f.",
    name: "e.l.f. Cosmetics Instant Lift Lápiz Cejas Doble Punta - Definidor Cejas",
    description: "Lápiz de cejas e.l.f. Instant Lift de doble punta. Cremoso para definir + cepillo para peinar. 6 tonos disponibles. Importado USA · Envío 24h Medellín.",
    longDescription:
      "e.l.f. Cosmetics es la marca cult-favorite americana — calidad de marca premium a precio accesible. Su lápiz Instant Lift es el más vendido en TikTok y YouTube por una razón: rellena, define y peina las cejas en 30 segundos sin necesidad de pomadas o gels.\n\n2 EN 1 EN UN SOLO PRODUCTO:\n• Punta de lápiz: fórmula cremosa que rellena vacíos y define la forma. Pigmentación natural — no se ve dibujado ni falso.\n• Cepillo spoolie: peina y difumina para un acabado natural \"plumado\".\n\nIdeal para cejas desordenadas pero con pelo, cejas finas que necesitan rellenado leve, principiantes en maquillaje de cejas (es muy fácil de aplicar), uso diario rápido, completar cejas en zonas vacías por depilación pasada o alopecia.\n\nNO ideal para cejas muy escasas o sin pelo (mejor microblading o pomada espesa).\n\nAPLICACIÓN: 1) Peinar cejas con el spoolie hacia arriba. 2) Con la punta del lápiz, hacer trazos cortos siguiendo el sentido del pelo. 3) Difuminar de nuevo con el spoolie para natural.\n\nLarga duración de hasta 12 horas. Resistente al agua y al sudor leve. Vegana, libre de crueldad.",
    features: [
      "Doble punta: lápiz + cepillo",
      "Cremoso pigmentación natural",
      "Hasta 12 horas duración",
      "Resistente agua/sudor",
      "Para cejas finas o irregulares",
      "Vegana sin crueldad",
      "Best-seller TikTok/YouTube",
    ],
  },
  {
    match: "Multi-Stick",
    category: "Belleza",
    brand: "e.l.f.",
    name: "e.l.f. Monochromatic Multi-Stick Rosa Mauve - Mejillas Labios Ojos 3 en 1",
    description: "Stick multiusos e.l.f. Monochromatic en rosa mauve. Para mejillas, labios y ojos. Look monocromático en segundos. Importado USA · Envío Medellín.",
    longDescription:
      "El Monochromatic Multi-Stick de e.l.f. es la herramienta de maquillaje más versátil que vas a comprar este año. Un solo stick reemplaza rubor, lipstick y sombra de ojos — ideal para crear looks monocromáticos rápidos al estilo \"that girl\" de Instagram.\n\nUSOS:\n• Mejillas: rubor cremoso de larga duración, se difumina con los dedos para acabado natural.\n• Labios: tinte de labios cremoso, se siente como un bálsamo pero da color visible.\n• Ojos: sombra cremosa, base perfecta para sombras en polvo o uso solo.\n\nFórmula vegana con vitamina E (cuida la piel mientras das color), ácido hialurónico (hidrata sin resecar). Sin parabenos, sin ftalatos.\n\nTONO ROSA MAUVE: el color universal que favorece todos los tonos de piel — desde muy clara hasta muy oscura. No es ni muy frío ni muy cálido. Perfecto para ese \"natural blush\" que se ve en todas las influencers.\n\nIdeal para principiantes en maquillaje (un solo producto = look completo), maquillaje de viaje (1 stick reemplaza 3 productos), look casual diario, fotos rápidas, mujeres que prefieren rapidez sobre complejidad.\n\nDURACIÓN: 6-8 horas con primer y polvo. Sin primer, 4-5 horas.",
    features: [
      "3 en 1: mejillas, labios, ojos",
      "Tono rosa mauve universal",
      "Cremoso · vit E + ácido hialurónico",
      "Look monocromático rápido",
      "Vegano · sin parabenos",
      "Ideal viajes y principiantes",
      "Best-seller e.l.f. USA",
    ],
  },
  {
    match: "Kit Cuidado Facial",
    category: "Belleza",
    brand: "Infinity Global Shop",
    name: "Kit Cuidado Facial Completo - Rutina Diaria Limpieza Hidratación SPF",
    description: "Kit cuidado facial completo curado con productos USA. Limpieza, hidratación y protección solar. Para todo tipo de piel. Envío gratis +$150.000 Medellín.",
    longDescription:
      "Kit completo seleccionado por nuestro equipo para personas que apenas empiezan en skincare o quieren una rutina simple pero efectiva. Productos importados originales de USA, todos con activos comprobados y libres de ingredientes irritantes.\n\nUNA RUTINA DE SKINCARE NO TIENE QUE SER COMPLICADA. La regla de oro es: limpieza + hidratación + protección solar. Eso es el 80% del resultado en cualquier piel. El resto (sérums, ácidos, mascarillas) es opcional.\n\nIdeal para principiantes en skincare 16-30 años, regalo para alguien especial (madre, hermana, novia), simplificar tu rutina actual demasiado cargada, viajes (todo lo esencial en un kit), pieles normales a mixtas.\n\nORDEN DE USO MAÑANA: 1) Limpiador 2) Hidratante 3) Protector solar SPF (obligatorio).\n\nORDEN DE USO NOCHE: 1) Limpiador 2) Hidratante.\n\nNo recomendado para piel con condiciones específicas (rosácea severa, dermatitis activa, acné severo) — esos casos requieren productos dirigidos por dermatólogo.\n\nProductos seleccionados de marcas como Bubble, Cetaphil, Neutrogena (varían según disponibilidad). Si quieres saber qué viene exactamente en este lote, escríbenos por WhatsApp antes de comprar.",
    features: [
      "Kit completo skincare USA",
      "Limpieza + hidratación + SPF",
      "Para principiantes 16-30",
      "Regalo perfecto",
      "Productos originales seleccionados",
      "Sin ingredientes irritantes",
      "Pregúntanos contenido por WhatsApp",
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TANDA 4 · CABELLO Y CUIDADO CAPILAR (8 productos)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    match: "One 'n Only Aceite",
    category: "Cabello",
    brand: "One 'n Only",
    name: "One 'n Only Aceite de Argán Tratamiento Capilar - Brillo y Anti-Frizz",
    description: "Aceite de Argán One 'n Only puro. Nutre, controla frizz y aporta brillo intenso. Para todo tipo de cabello. Importado USA · Envío 24h Medellín.",
    longDescription:
      "El aceite de argán es \"el oro líquido de Marruecos\" — y One 'n Only te lo trae en su forma más pura y biodisponible. Si tienes cabello seco, frizz constante, puntas abiertas o quieres ese brillo de salón sin gastar fortunas, este es tu nuevo aliado.\n\nBeneficios principales: nutrición intensa con vitamina E y ácidos grasos esenciales, controla el frizz por hasta 24 horas, sella las puntas dañadas (reduce la apariencia de \"orquetas\"), aporta brillo natural sin grasa, protege del calor de planchas y secadores hasta 230°C, repara cutícula del cabello químicamente tratado.\n\nIdeal para cabello rizado, ondulado o liso con frizz, cabello tinturado o con químicos (aclaraciones, alisados), después de planchar o secar (sella el calor), puntas resecas o abiertas, cabello fino que necesita brillo sin peso, cuero cabelludo seco con caspa leve.\n\nMODO DE USO: 2-4 gotas en las palmas, frotar y aplicar de medios a puntas en cabello húmedo o seco. Para tratamiento intensivo: aplicar en raíces a puntas, dejar 30 minutos, lavar normal.\n\nIMPORTANTE: No aplicar en raíces si tu cabello es graso (puede engrasarlo). Si es seco, sí en cuero cabelludo.\n\nFórmula ligera no grasa. Aroma argán natural suave.",
    features: [
      "Aceite Argán puro premium",
      "Controla frizz 24 horas",
      "Brillo de salón en casa",
      "Protege del calor 230°C",
      "Sella puntas abiertas",
      "Cabello tinturado y dañado",
      "Importado USA original",
    ],
  },
  {
    match: "Kids Shea Butter Detangling",
    category: "Cabello",
    brand: "Africa's Best",
    name: "Africa's Best Kids Manteca Karité Desenredante - Cabello Niñas Rizado",
    description: "Acondicionador desenredante Africa's Best Kids con Manteca de Karité. Para niñas con cabello rizado o trenzas. Importado USA · Envío gratis Medellín.",
    longDescription:
      "Si tu hija tiene cabello rizado, afro u ondulado y peinarlo es una pelea diaria, este producto te va a salvar. Africa's Best Kids está específicamente formulado para cabello infantil texturizado — desenreda sin causar dolor ni rotura.\n\nFórmula con: manteca de karité (hidrata profundamente sin grasa), aloe vera (calma cuero cabelludo), aceites naturales suaves (no irritan ojos), proteínas vegetales (fortalecen).\n\nNO contiene parabenos, sulfatos agresivos, alcoholes que resequen, fragancias fuertes, ingredientes irritantes para piel infantil.\n\nIdeal para niñas 3-12 años con cabello rizado o afro, después de quitar trenzas (para desenredar sin trauma), uso diario antes de peinar, cabello texturizado con tendencia a enredos, antes de actividades acuáticas (protege del cloro).\n\nMODO DE USO: 1) Sobre cabello mojado o seco. 2) Aplicar generosamente de medios a puntas. 3) Desenredar con peine de dientes anchos empezando por las puntas. 4) Trenzar, peinar o estilizar.\n\nProducto sin enjuague — se queda en el cabello. Resultado: cabello suave, brillante y manejable. Olor frutal suave (no agresivo para niños).\n\n237ml = aproximadamente 2-3 meses de uso diario en una niña.",
    features: [
      "Para cabello rizado niñas",
      "Manteca karité + aloe vera",
      "Desenreda sin dolor",
      "Sin sulfatos ni parabenos",
      "Apto piel infantil sensible",
      "Sin enjuague — fácil de usar",
      "Aroma frutal suave",
    ],
  },
  {
    match: "Burt's Bees Baby",
    category: "Cabello",
    brand: "Burt's Bees Baby",
    name: "Burt's Bees Baby Shampoo Calmante Lavanda - 99% Natural Sin Lágrimas 372ml",
    description: "Shampoo y gel de baño 2 en 1 Burt's Bees Baby con Lavanda. 99% natural, hipoalergénico, sin lágrimas. Importado USA · Envío 24h Medellín.",
    longDescription:
      "Burt's Bees Baby es la marca pediátrica natural #1 en USA — pediátricamente probada, hipoalergénica y con 99.9% de ingredientes naturales. Si quieres lo MEJOR para la piel y cabello de tu bebé sin químicos agresivos, esta es la opción que pediatras recomiendan.\n\nFórmula 2 en 1 (shampoo + gel de baño) con: extracto de lavanda (calma y prepara para dormir), aceite de soja (hidrata sin tapar poros), proteínas de leche (suaviza piel sensible).\n\nLIBRE DE: parabenos, sulfatos (SLS, SLES), ftalatos, fragancias artificiales, colorantes, alcoholes resecantes, productos derivados del petróleo.\n\nIdeal para bebés recién nacidos hasta 3 años (con autorización pediátrica desde recién nacido), bebés con piel sensible o tendencia a dermatitis, uso antes de dormir (la lavanda relaja), pieles propensas a costra láctea o eczema leve, primer baño después de salir de la clínica.\n\nMODO DE USO: 1) Mojar al bebé con agua tibia. 2) Aplicar pequeña cantidad en las palmas. 3) Masajear suavemente cabello y cuerpo. 4) Enjuagar bien. 5) Secar con toalla suave.\n\nFórmula \"sin lágrimas\" — si entra accidentalmente en los ojitos, no arde.\n\n372ml = aproximadamente 4-6 meses de uso diario en un bebé.",
    features: [
      "99% ingredientes naturales",
      "Sin lágrimas — apto ojitos",
      "Lavanda calmante para dormir",
      "Sin parabenos ni sulfatos",
      "Hipoalergénico pediátrico",
      "Para piel sensible y eczema",
      "372ml · 4-6 meses uso",
    ],
  },
  {
    match: "Crema Definidora Rizos",
    category: "Cabello",
    brand: "One 'n Only",
    name: "One 'n Only Argán + Colágeno Crema Definidora Rizos 340g - Anti-Frizz",
    description: "Crema definidora rizos One 'n Only con Argán y Colágeno. Define rizos sin encrespar. 340g. Importado USA · Envío gratis +$150.000 Medellín.",
    longDescription:
      "Si tienes cabello rizado y luchas con el frizz, los rizos sin definir o el cabello que se \"esponja\" después de unas horas, esta crema es la solución que la comunidad rizada ha estado buscando.\n\nFórmula combinada con argán + colágeno de acacia + glicerina vegetal. El argán nutre y sella la cutícula. El colágeno rellena las cutículas porosas. La glicerina retiene la hidratación. Resultado: rizos definidos, brillantes, suaves y CON MOVIMIENTO (no estáticos como con geles).\n\nIdeal para cabello rizado tipo 2C-4A (ondulado a rizo cerrado), después de método rizado o curly girl method, uso diario sin lavar (refrescar al tercer día), aplicación en cabello recién lavado, cabello seco que pierde definición rápido, primera vez probando productos para rizos.\n\nMODO DE USO (cabello rizado húmedo):\n1) Lavar y acondicionar normalmente.\n2) Sin secar con toalla, aplicar la crema en mechones desde medios a puntas.\n3) Scrunching: apretar mechones hacia el cuero cabelludo para activar el rizo.\n4) Secar al aire o con difusor de baja temperatura.\n5) Romper el \"casco\" del gel con las manos al final.\n\n340g rinde 3-4 meses con uso semanal o 2 meses con uso interdiario.\n\nNO contiene siliconas (Curly Girl Method approved), parabenos, sulfatos.",
    features: [
      "Argán + Colágeno definidor",
      "Para rizos 2C-4A",
      "340g · 3-4 meses",
      "Sin frizz · brillo natural",
      "Curly Girl Method approved",
      "Sin siliconas ni parabenos",
      "Importado USA premium",
    ],
  },
  {
    match: "ORS Olive",
    category: "Cabello",
    brand: "ORS",
    name: "ORS Olive Oil Acondicionador Sin Enjuague Hidratación + Crecimiento 475ml",
    description: "Acondicionador sin enjuague ORS Olive Oil. Aceite oliva, agua de arroz y electrolitos. Hidrata y estimula crecimiento. 475ml · Envío 24h Medellín.",
    longDescription:
      "ORS Olive Oil es el #1 en USA para cabello afro, rizado y dañado. Su acondicionador sin enjuague combina ingredientes ancestrales (oliva, agua de arroz) con tecnología moderna (electrolitos) para nutrir desde adentro y estimular crecimiento.\n\nFórmula con: aceite de oliva extra virgen (penetra y nutre la fibra capilar), agua de arroz fermentada (favorece crecimiento — usado por mujeres asiáticas hace siglos), electrolitos (rebalancean cabello dañado), aceite de coco (sella humedad), proteína de seda (fortalece).\n\nIdeal para cabello rizado o afro tipo 3B-4C, cabello químicamente tratado (alisados, tintes), después de trenzas o extensiones largas, cabello que no crece más allá de cierto largo, puntas resecas y quebradizas, cuero cabelludo con tendencia a la caspa.\n\nMODO DE USO: 1) Aplicar sobre cabello recién lavado y húmedo. 2) Distribuir desde medios a puntas con peine de dientes anchos. 3) Sin enjuagar. 4) Estilizar normalmente o dejar suelto.\n\nUso diario o cada 2-3 días. No engrasa la raíz si se aplica solo de medios a puntas.\n\nResultados: cabello más hidratado en 1 lavada, más suave en 1 semana, crecimiento notable en 2-3 meses con uso constante.\n\n475ml = aproximadamente 4-5 meses de uso interdiario.",
    features: [
      "Oliva + agua de arroz",
      "Estimula crecimiento capilar",
      "Para cabello afro/rizado 3B-4C",
      "Repara químicos y trenzas",
      "Sin enjuague",
      "475ml · 4-5 meses",
      "Marca #1 USA en afro",
    ],
  },
  {
    match: "Olive Karité",
    category: "Cabello",
    brand: "Africa's Best",
    name: "Africa's Best Olive Karité Mascarilla Reparación Profunda 524g",
    description: "Mascarilla reparadora profunda Africa's Best con Oliva y Manteca Karité. Para cabello seco y dañado. 524g · Envío gratis +$150.000 Medellín.",
    longDescription:
      "Si tu cabello está dañado por tintes, alisados, planchas, o simplemente reseco por la sequedad de Medellín, esta mascarilla es tratamiento intensivo de salón a precio de farmacia.\n\nFórmula reparadora profunda con: aceite de oliva (penetra hasta la corteza capilar), manteca de karité pura (sella humedad y nutre), proteínas hidrolizadas (rellenan zonas dañadas), keratina (refuerza estructura), pantenol (B5 — repara y da brillo).\n\nIdeal para cabello químicamente dañado (alisado japonés, brasileño, tinte rubio), puntas abiertas y quebradizas, cabello con quemadura del sol o agua de mar, después de extensiones (deja el cabello propio reparado), cabello afro o rizado seco, antes de un alisado o tinte (preparar el cabello).\n\nMODO DE USO INTENSIVO: 1) Lavar con shampoo. 2) Aplicar generosamente en cabello húmedo de medios a puntas. 3) Cubrir con gorro de baño. 4) Aplicar calor con secador o gorro térmico durante 20-30 minutos. 5) Enjuagar con agua tibia.\n\nUSO MANTENIMIENTO: 1 vez por semana sin calor, dejar 10 minutos.\n\nResultados después de la primera aplicación: cabello visiblemente más suave, manejable y brillante. A las 4 semanas de uso constante: reducción notable de quiebre y puntas abiertas.\n\n524g = aproximadamente 12-15 aplicaciones intensivas o 25-30 mantenimientos.",
    features: [
      "Reparación profunda con calor",
      "Oliva + Karité + Keratina",
      "Para cabello químicamente dañado",
      "524g · 25+ aplicaciones",
      "Tratamiento de salón en casa",
      "1 vez por semana",
      "Africa's Best USA",
    ],
  },
  {
    match: "Zanahoria",
    category: "Cabello",
    brand: "Africa's Best",
    name: "Africa's Best Aceite Zanahoria Árbol de Té - Crecimiento Cuero Cabelludo",
    description: "Aceite capilar Africa's Best con Zanahoria y Árbol de Té. Estimula crecimiento, combate caspa. Importado USA · Envío 24h Medellín.",
    longDescription:
      "Si quieres que tu cabello crezca más rápido y fuerte, debes empezar por el cuero cabelludo — ahí están los folículos que producen cada cabello nuevo. Este aceite combina dos activos legendarios: zanahoria (vitamina A para crecimiento) y árbol de té (antibacteriano para cuero cabelludo sano).\n\nBeneficios: estimula folículos para mayor crecimiento, combate caspa y cuero cabelludo graso, fortalece cabello desde la raíz, reduce caída por debilidad, antibacteriano y antifúngico natural, sella puntas resecas, da brillo natural sin grasa visible.\n\nIdeal para cabello con crecimiento lento o estancado, caída del cabello por estrés o postparto, cuero cabelludo con caspa o picazón, después de tratamientos químicos (recuperar fuerza), cabello fino que necesita densidad, hombres con calvicie incipiente (uso preventivo).\n\nMODO DE USO COMO TRATAMIENTO: 1) Aplicar 5-10 gotas en el cuero cabelludo. 2) Masajear circularmente por 3-5 minutos (importante — el masaje activa la circulación). 3) Dejar mínimo 30 minutos antes de lavar (toda la noche es mejor). 4) Lavar con shampoo normal.\n\nUso recomendado: 2-3 veces por semana. Los resultados (más densidad y crecimiento) se ven entre 8-12 semanas.\n\nIMPORTANTE: si tienes alopecia areata o caída severa, consulta dermatólogo. Este aceite es complementario, no reemplaza tratamiento médico.",
    features: [
      "Zanahoria + Árbol de Té",
      "Estimula crecimiento capilar",
      "Combate caspa naturalmente",
      "2-3 veces por semana",
      "Resultados en 8-12 semanas",
      "Antibacteriano y antifúngico",
      "Para caída postparto",
    ],
  },
  {
    match: "Ricola",
    category: "Salud",
    brand: "Ricola",
    name: "Ricola Caramelos Suizos 13 Hierbas Alpinas Sin Azúcar - Garganta",
    description: "Caramelos Ricola sin azúcar con 13 hierbas alpinas suizas. Alivian dolor de garganta y tos. Importado USA · Envío gratis +$150.000 Medellín.",
    longDescription:
      "Ricola es la marca suiza centenaria que perfeccionó la fórmula original con 13 hierbas alpinas — el remedio natural más amado en el mundo para dolor de garganta, tos seca y voz ronca. Esta versión sin azúcar te da el mismo alivio sin afectar tu glucosa o caries.\n\nLas 13 hierbas: hisopo, melisa, malva, manzanilla, hierba luisa, milenrama, salvia, menta piperita, primavera, malva real, eucalipto, saúco, tomillo. Cada una con propiedades antiinflamatorias, antibacterianas y calmantes.\n\nIdeal para dolor de garganta por gripe o resfriado, tos seca persistente, voz ronca por uso excesivo (cantantes, profesores, vendedores), aliento fresco después del café o cigarrillo, mientras estudias o trabajas (concentración), después de hablar por teléfono mucho tiempo, refrescar la boca sin azúcar (apto diabéticos).\n\nUSO: chupar 1 caramelo despacio cuando sientas molestia. Puedes consumir varios al día. No mastiques — el efecto está en la disolución lenta.\n\nVENTAJAS \"sin azúcar\": apto para diabéticos, no daña los dientes, no aporta calorías, sabor más herbal y menos dulzón.\n\nUna bolsa rinde mucho — perfecta para dejar en el escritorio, cartera o cajón. Sabor herbal suizo único — al principio es fuerte, luego adictivo.",
    features: [
      "13 hierbas alpinas suizas",
      "Sin azúcar — apto diabéticos",
      "Alivia tos y garganta",
      "Para profesores y cantantes",
      "Sabor herbal único",
      "No daña dientes",
      "Marca centenaria Suiza",
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TANDA 5 · HOGAR, HERRAMIENTAS, MÁS PRODUCTOS (14)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    match: "Iowa Pine",
    category: "Hogar",
    brand: "Mrs. Meyer's",
    name: "Mrs. Meyer's Iowa Pine Limpiador Multiusos Aroma Bosque 473ml",
    description: "Limpiador multiusos Mrs. Meyer's edición Iowa Pine. Origen vegetal, aroma a bosque de pino. Cocina y baño. Importado USA · Envío 24h Medellín.",
    longDescription:
      "Mrs. Meyer's Clean Day es la marca premium americana de limpieza con conciencia — productos efectivos hechos con ingredientes de origen vegetal y aromas naturales que transforman las tareas del hogar en una experiencia agradable.\n\nLa edición limitada Iowa Pine es la favorita de fin de año — aroma fresco a bosque de pinos americanos. Si te encanta el olor a Navidad y bosque, este limpiador convierte tu cocina en un refugio aromático.\n\nFórmula multiusos efectiva en: encimeras de cocina (granito, mármol, fórmica), superficies del baño (sin estropear esmaltes), mesas de comedor, pisos laminados o cerámicos, electrodomésticos (refrigerador, microondas), juguetes plásticos (no tóxico).\n\nIngredientes: aceites esenciales naturales (no fragancia sintética), tensoactivos de origen vegetal, sin amoniaco, sin lejía, sin parabenos, biodegradable.\n\nLA DIFERENCIA con limpiadores convencionales: deja un olor naturalmente delicioso (no químico), no te marea ni te irrita los ojos, seguro alrededor de niños y mascotas, no daña superficies delicadas, fórmula concentrada (rinde más).\n\nMODO DE USO: rociar directamente sobre la superficie. Limpiar con paño húmedo. No requiere enjuague en superficies no porosas.\n\nFormato spray de 473ml. Edición limitada — cuando se acaba, se acaba.",
    features: [
      "Edición limitada aroma pino",
      "Origen vegetal biodegradable",
      "Sin amoniaco ni lejía",
      "Seguro niños y mascotas",
      "473ml multiusos",
      "Aceites esenciales naturales",
      "Marca premium USA",
    ],
  },
  {
    match: "Fall Leaves",
    category: "Hogar",
    brand: "Mrs. Meyer's",
    name: "Mrs. Meyer's Fall Leaves Limpiador Multiusos Aroma Otoñal 473ml",
    description: "Limpiador multiusos Mrs. Meyer's edición Fall Leaves. Aroma otoñal cálido. Origen vegetal. Importado USA · Envío gratis +$150.000 Medellín.",
    longDescription:
      "La edición Fall Leaves es la versión otoñal de Mrs. Meyer's — aroma cálido y acogedor que combina notas de manzana, canela, clavo y hojas secas. Si te encantan los olores a chocolate caliente y galletas recién horneadas, este es tu limpiador.\n\nIdeal para amantes de la decoración seasonal, ambientar la casa en eventos especiales, regalo para personas que aman lo fall y cozy, sustituir velas perfumadas con un producto útil, fanáticos de Mrs. Meyer's coleccionistas de ediciones.\n\nMisma fórmula efectiva multiusos que la edición regular: cocina, baño, mesas, pisos, electrodomésticos, juguetes. Origen vegetal, biodegradable, sin amoniaco ni lejía.\n\nLOS LIMPIADORES SON EL NUEVO PERFUME DEL HOGAR. Mrs. Meyer's lleva años entendiendo eso. Su comunidad colecciona aromas estacionales y rota según la época del año:\n• Primavera: Lavender, Lemon Verbena.\n• Verano: Basil, Geranium.\n• Otoño: Apple Cider, Fall Leaves.\n• Invierno: Iowa Pine, Peppermint.\n\nEsta edición Fall Leaves es perfecta para octubre-diciembre. Después se vuelve casi imposible de conseguir.\n\nMODO DE USO: rociar sobre la superficie, limpiar con paño húmedo. Sin enjuague necesario.",
    features: [
      "Aroma otoñal canela manzana",
      "Edición limitada coleccionable",
      "Origen vegetal biodegradable",
      "Multiusos: cocina y baño",
      "Sin amoniaco",
      "Seguro niños y mascotas",
      "473ml premium USA",
    ],
  },
  {
    match: "Dr Teal's",
    category: "Hogar",
    brand: "Dr Teal's",
    name: "Dr Teal's Espuma de Baño Lavanda Sales de Epsom 1 Litro - Sueño Profundo",
    description: "Dr Teal's Foaming Bath con Lavanda y Sales de Epsom. Relaja músculos y prepara para dormir profundo. 1 litro · Envío 24h Medellín.",
    longDescription:
      "Si tienes problemas para conciliar el sueño, sufres de ansiedad o quieres convertir tu baño en un spa una vez a la semana, Dr Teal's es la marca americana favorita para el self-care a precio accesible.\n\nFórmula con: aceite esencial de lavanda pura (relaja sistema nervioso), sales de Epsom (sulfato de magnesio que se absorbe por la piel), aceite de coco (hidrata mientras te bañas), aceite de almendras (suaviza la piel).\n\nLAS SALES DE EPSOM ABSORBIDAS POR LA PIEL: alivian dolor muscular después de ejercicio, reducen tensión y estrés, mejoran la circulación, complementan el magnesio que tomas oralmente, ayudan a dormir más profundo, suavizan piel reseca.\n\nIdeal para personas con insomnio o sueño superficial, atletas con dolor muscular post-entreno, niños con sobreestimulación o hiperactividad antes de dormir, mujeres con cólicos menstruales (dolor abdominal), después de un día estresante de trabajo, mujeres en menopausia con cambios de humor.\n\nMODO DE USO: llenar la tina con agua tibia. Agregar 1-2 tapas del producto bajo el chorro. Sumergirse 20-30 minutos. Aspirar el aroma profundamente. Después del baño, no enjuagarse — dejar que las sales sigan absorbiéndose.\n\nIDEAL: tomar el baño 1-2 horas antes de dormir para máximo efecto sueño.\n\n1 litro = aproximadamente 20-25 baños relajantes.",
    features: [
      "Lavanda + Sales Epsom",
      "Magnesio absorbido por piel",
      "Sueño profundo natural",
      "Alivia dolor muscular",
      "1 litro · 20-25 baños",
      "Para insomnio y estrés",
      "Spa en casa",
    ],
  },
  {
    match: "Destornillador de Impacto",
    category: "Herramientas",
    brand: "Klein Tools",
    name: "Klein Tools Destornillador de Impacto Profesional Múltiples Puntas",
    description: "Destornillador de impacto Klein Tools con puntas intercambiables. Ergonómico, antideslizante. Para electricistas. Importado USA · Envío Medellín.",
    longDescription:
      "Klein Tools es la marca americana #1 entre electricistas profesionales — fundada en 1857, con más de 165 años de historia haciendo herramientas de máxima calidad. Si necesitas un destornillador serio que resista trabajo pesado diario, esta es la mejor inversión.\n\nCaracterísticas profesionales: cuerpo de acero al cromo-vanadio (resistente a torsión), múltiples puntas intercambiables (Phillips, plana, Torx, Robertson), agarre ergonómico Cushion-Grip de doble densidad (no se resbala con sudor o aceite), tip magnético (sostiene tornillos pequeños sin caída), capacidad de impacto (resiste golpes con martillo cuando un tornillo está atascado).\n\nIdeal para electricistas profesionales, trabajadores de construcción, técnicos de mantenimiento, instaladores de redes, mecánicos, talleres de carpintería avanzada, hobbyistas serios de DIY.\n\nLOS DESTORNILLADORES BARATOS SE DOBLAN cuando aplicas torque real, los Klein no. Si has tenido que tirar destornilladores chinos al mes de comprarlos, Klein es la inversión que dura toda la vida laboral.\n\nIncluye: mango ergonómico principal, set de puntas estándar, organizador interno para puntas extras, garantía limitada de por vida (Klein responde si falla por defecto de fábrica).\n\nUSO: insertar la punta deseada en el adaptador. Usar como destornillador normal. Para tornillos atascados, golpear suavemente la parte trasera con martillo (capacidad de impacto).",
    features: [
      "Acero cromo-vanadio premium",
      "Puntas intercambiables magnéticas",
      "Cushion-Grip antideslizante",
      "Resistente a impactos",
      "Para electricistas profesionales",
      "Garantía limitada de por vida",
      "Marca #1 USA desde 1857",
    ],
  },
  {
    match: "Ponchadora",
    category: "Herramientas",
    brand: "Klein Tools",
    name: "Klein Tools Pass-Thru Ponchadora Modular RJ45 RJ11 - Redes y Cable UTP",
    description: "Ponchadora Klein Tools Pass-Thru para conectores RJ45 y RJ11. Profesional para redes UTP. Importado USA · Envío 24h Medellín.",
    longDescription:
      "Si trabajas instalando redes, cámaras IP, telefonía o sistemas de seguridad, esta ponchadora Pass-Thru de Klein es la herramienta que va a cambiarte el negocio. La tecnología Pass-Thru permite que los cables pasen completamente a través del conector antes del crimpado — eliminando errores y reduciendo el tiempo de cada terminación a la mitad.\n\nFunciones: crimpa conectores RJ45 (red Ethernet) y RJ11 (telefonía), corta y pela cables UTP/STP, tecnología Pass-Thru única (los cables pasan completos), cuchilla integrada para cortar excesos limpiamente, mecanismo de trinquete para ponchado uniforme, mango ergonómico Cushion-Grip antifatiga.\n\nIdeal para instaladores de redes (cableado estructurado), técnicos de cámaras IP, instaladores de cámaras de seguridad, técnicos de telefonía, mantenimiento de oficinas y data centers, servicios de soporte IT, hobbyistas de redes domésticas.\n\nVENTAJA PASS-THRU vs ponchadoras convencionales: ahorra 50% del tiempo por terminación, reduce conectores defectuosos por mal corte, permite ver visualmente que los hilos están en posición correcta antes de crimpar, mecanismo de trinquete garantiza presión uniforme cada vez.\n\nCompatible con: conectores Pass-Thru estándar (Klein, Platinum Tools, EZ-RJ45), cables Cat5e, Cat6, Cat6a, blindados y no blindados.\n\nIMPORTANTE: usar siempre conectores Pass-Thru genuinos. Conectores tradicionales NO funcionan con esta herramienta.",
    features: [
      "Tecnología Pass-Thru única",
      "RJ45 + RJ11 ponchado",
      "Corta, pela y crimpa",
      "50% menos tiempo por cable",
      "Mecanismo trinquete uniforme",
      "Para Cat5e, Cat6, Cat6a",
      "Marca profesional USA",
    ],
  },
  {
    match: "Nivel Magnético",
    category: "Herramientas",
    brand: "Klein Tools",
    name: "Klein Tools Nivel Magnético 4 Ampollas 6 Pulgadas Accu-Bend Profesional",
    description: "Nivel magnético Klein Tools de 4 ampollas, 6 pulgadas. Riel magnético patentado. Precisión profesional. Importado USA · Envío gratis Medellín.",
    longDescription:
      "Para trabajos de precisión donde necesitas tener las dos manos libres, este nivel magnético compacto de Klein Tools es la diferencia entre un trabajo profesional y uno chambón. Con 4 ampollas (vials) puedes verificar nivel horizontal, vertical, 45° y plomada — todo con una sola herramienta.\n\nCaracterísticas profesionales: 4 ampollas precisas con burbujas verde fluorescente (visibles en poca luz), riel magnético patentado (se fija solo en superficies metálicas), cuerpo de aluminio anodizado anti-óxido, formato compacto de 6 pulgadas (cabe en cualquier bolsillo de cinturón portaherramientas), bordes biselados para colocación precisa.\n\nIdeal para electricistas instalando paneles eléctricos, instaladores de aires acondicionados, técnicos de paneles solares, mecánicos verificando ejes, instaladores de TVs y monitores, carpinteros de mueblería, trabajos de plomería con tubería metálica.\n\nLA VENTAJA MAGNÉTICA: en superficies metálicas (paneles, gabinetes, tubería), pegas el nivel y queda fijo. Tienes ambas manos libres para ajustar lo que estás instalando. Esto cambia el flujo de trabajo solitario completamente.\n\nDIMENSIÓN: 6 pulgadas (15cm). Suficiente para la mayoría de trabajos de precisión donde un nivel grande es estorboso. Para trabajos largos (paredes, marcos), combinarlo con un nivel de 24 pulgadas.\n\nGarantía limitada de por vida — Klein responde si falla por defecto de fábrica.",
    features: [
      "4 ampollas: H, V, 45°, plomada",
      "Riel magnético patentado",
      "Aluminio anodizado",
      "6 pulgadas compacto",
      "Burbujas verde fluorescente",
      "Manos libres trabajo solitario",
      "Garantía de por vida",
    ],
  },
  {
    match: "Monóxido de Carbono",
    category: "Hogar",
    brand: "First Alert",
    name: "First Alert Detector de Monóxido de Carbono Plug-In con Batería de Respaldo",
    description: "Detector First Alert de monóxido de carbono. Alarma sonora, plug-in con batería respaldo. Salva vidas en hogar. Importado USA · Envío 24h Medellín.",
    longDescription:
      "El monóxido de carbono (CO) es un gas inodoro, incoloro e insípido que mata silenciosamente a personas en sus propias casas — más de 400 muertes al año solo en USA. La única forma de detectarlo es con un sensor especializado. Esta es la inversión más importante de seguridad que puedes hacer para tu familia.\n\n¿De dónde viene el CO? Calentadores de gas con combustión incompleta, estufas de gas con problemas, hornos defectuosos, vehículos en garages cerrados, chimeneas obstruidas, generadores eléctricos a gasolina, secadores de gas mal ventilados.\n\nFirst Alert es la marca #1 mundial en detectores de seguridad — la que recomiendan bomberos en USA. Características: alarma sonora 85dB (audible en toda la casa), plug-in directo (no necesita instalación), batería de respaldo de 9V (sigue funcionando si se va la luz), sensor electroquímico de 7+ años de duración, indicador LED visual del estado, botón test/silence para verificación.\n\nDÓNDE INSTALAR: dormitorios o cerca de ellos, cada nivel de la casa, cocinas con estufa de gas, garage interno (entrada a la casa), salas con chimenea, lavanderías con secador de gas. NO instalar cerca de la cocina directamente (puede dar falsas alarmas con vapor) ni en baños (humedad afecta sensor).\n\nIDEAL: cada hogar debe tener mínimo 1 detector por nivel. Reemplazar el detector cada 7-10 años (la vida útil del sensor).",
    features: [
      "Salva vidas en hogar",
      "Alarma sonora 85dB",
      "Plug-in con batería respaldo",
      "Sensor 7+ años duración",
      "Marca #1 mundial",
      "Recomendado por bomberos",
      "Para gas, estufas, chimeneas",
    ],
  },
  {
    match: "CamelBak",
    category: "Más productos",
    brand: "CamelBak",
    name: "CamelBak Reservorio Hidratación Manos Libres - Ciclismo Senderismo",
    description: "Reservorio CamelBak para hidratación manos libres. Boquilla y tubo. Ciclismo, trekking, deportes outdoor. Importado USA · Envío 24h Medellín.",
    longDescription:
      "CamelBak inventó el sistema de hidratación con reservorio en 1989 — desde entonces es el estándar mundial para deportes outdoor. Si haces ciclismo, trekking, running largo o cualquier deporte donde detenerse a tomar agua sea inconveniente, este reservorio cambia tu rendimiento.\n\nCómo funciona: el reservorio (bladder) va dentro de tu mochila o chaleco específico para hidratación. Un tubo flexible sale por el hombro y termina en una boquilla que muerdes para activar el flujo. Bebes sin parar, sin manos, sin perder ritmo.\n\nVentajas vs botellas: bebes 50% más agua durante el ejercicio (la facilidad genera el hábito), no pierdes ritmo deportivo (especialmente en ciclismo y running), distribuye el peso uniformemente en la espalda, capacidades grandes (hasta 3 litros) sin estorbar.\n\nIdeal para ciclistas de ruta o montaña (largas distancias), corredores trail running de 10K+, hikers y trekkers, deportistas de obstáculos (Spartan Race), militares, motociclistas en viajes largos, festivales de música outdoor.\n\nCONSEJO: en ejercicios largos, agrega electrolitos al agua (no bebida azucarada que crea biofilm en el tubo). Después de cada uso, lavar reservorio con agua tibia y un poco de bicarbonato. Secar al aire boca abajo.\n\nEl tubo y boquilla son universales — compatibles con la mayoría de mochilas hidratación de otras marcas.",
    features: [
      "Hidratación manos libres",
      "Bebes 50% más agua",
      "Para ciclismo y trekking",
      "Boquilla con válvula",
      "Compatible con mochilas",
      "Inventores del sistema 1989",
      "Importado USA original",
    ],
  },
  {
    match: "Fiskars",
    category: "Más productos",
    brand: "Fiskars",
    name: "Fiskars Tijeras Antiadherentes Micro-Tip - Manualidades y Cintas Adhesivas",
    description: "Tijeras Fiskars antiadherentes Micro-Tip. Cortan materiales pegajosos sin que se adhieran. Compactas y profesionales. Importado USA · Envío Medellín.",
    longDescription:
      "Fiskars es la marca finlandesa con 374 años de historia haciendo herramientas de corte — la marca de las tijeras naranjas que toda crafter o artesana reconoce al instante. Las Micro-Tip son su modelo más vendido para trabajos de precisión.\n\nCaracterísticas Micro-Tip: hojas cortas y muy precisas (tip micro = punta micro), recubrimiento antiadherente (NO se adhieren cintas, pegamento, etiquetas), aceto inoxidable de alta calidad japonesa, mango ergonómico Softgrip, mecanismo de seguridad para cerrar (no se abren accidentalmente en cajón).\n\n¿POR QUÉ ANTIADHERENTES? Si has cortado cinta de empaque, etiquetas adhesivas, papel contact, vinil, o cintas de regalo, sabes el dolor: las hojas se llenan de pegamento y dejan de cortar. Estas tienen un recubrimiento que rechaza adhesivos. Cortas 1000 cintas y siguen cortando como nuevas.\n\nIdeal para: empaques (online sellers, manualidades), oficina (etiquetas, cinta), scrapbooking y crafts, papelería profesional (impresoras), trabajos con vinil adhesivo, regalos navideños (cintas), niños en colegio (uso seguro).\n\nNo apto para tela gruesa, cartón muy grueso, alambres metálicos.\n\nCalidad de salón: Fiskars garantiza durabilidad de décadas. Estas tijeras pueden durar más que tu computadora.",
    features: [
      "Antiadherentes anti-pegamento",
      "Micro-Tip ultra preciso",
      "Acero inoxidable japonés",
      "Mango Softgrip ergonómico",
      "Cierre de seguridad",
      "Marca 374 años Finlandia",
      "Duran décadas",
    ],
  },
  {
    match: "LEGO",
    category: "Más productos",
    brand: "LEGO",
    name: "LEGO Chain Reactions x Klutz - Kit Educativo STEM Niños 8+ Reacciones",
    description: "LEGO Klutz Chain Reactions. Kit educativo STEM para niños 8+. Construye máquinas con reacciones en cadena. Original USA · Envío gratis Medellín.",
    longDescription:
      "LEGO + Klutz es la combinación perfecta para regalo educativo — el clásico LEGO con la guía didáctica de Klutz (editorial Scholastic especializada en libros interactivos para niños). Este kit enseña principios de física, ingeniería y pensamiento causal mientras los niños se divierten.\n\nQué incluye: 33 piezas LEGO esenciales (poleas, ruedas, ejes, palancas, plataformas), libro espiralado con 10 máquinas paso a paso, planos detallados con gráficos coloridos, página de referencia de partes, ideas para diseñar máquinas propias.\n\nLO QUE APRENDEN LOS NIÑOS: causa y efecto (acción en A → consecuencia en B), física básica (gravedad, momento, fuerza), ingeniería (cómo combinar piezas para que funcionen), resolución de problemas (cuando una máquina no sale, hay que ajustar), creatividad y diseño (después de las 10 máquinas guiadas, inventan las propias), perseverancia (las máquinas en cadena requieren paciencia).\n\nIdeal para niños 8-14 años (algunos adultos también disfrutan), regalo de cumpleaños o navidad, niños interesados en STEM (ciencia, tecnología, ingeniería, matemáticas), reemplazo saludable de tablets y videojuegos, actividad familiar de fin de semana, niños con TDAH (canaliza energía constructivamente).\n\nIDIOMA del libro: inglés (puedes traducir las instrucciones si tu hijo aún no lee inglés — los gráficos son universales).\n\nCalificación: aprobado para uso educativo en colegios STEM en USA.",
    features: [
      "33 piezas LEGO + libro guía",
      "10 máquinas en cadena paso a paso",
      "Para niños 8-14 años STEM",
      "Aprenden física e ingeniería",
      "Reemplaza pantallas",
      "Regalo educativo",
      "LEGO + Klutz Scholastic",
    ],
  },
  {
    match: "Grinch",
    category: "Más productos",
    brand: "Outright Games",
    name: "The Grinch Christmas Adventures Nintendo Switch - Videojuego Navideño",
    description: "Videojuego The Grinch Christmas Adventures para Nintendo Switch. Aventura navideña familiar. Clasificación E. Importado USA · Envío 24h Medellín.",
    longDescription:
      "Si tienes Nintendo Switch y eres fan de El Grinch (la película de Jim Carrey o el clásico de Dr. Seuss), este videojuego es la experiencia navideña perfecta para jugar en familia durante diciembre. Aventura cómica donde controlas al Grinch en su misión de \"robar la Navidad\" en el pueblo de Whoville.\n\nQué hay en el juego: 10+ niveles de plataformas y aventura, personajes icónicos (Grinch, Max el perro, Cindy Lou Who, alcalde Whoville), mecánicas de sigilo (escondiéndose de los Whos), minijuegos navideños (decorar árboles, robar regalos), arte estilo cartoon clásico, banda sonora navideña original, difícultad adaptada para todas las edades, modo multijugador local (2 jugadores).\n\nIdeal para fans de El Grinch (película 2018 o clásica), niños 6-14 años en temporada navideña, regalos de navidad para gamers familiares, actividad familiar diciembre (alternativa a TV pasiva), familias con Nintendo Switch (todos los modelos: regular, Lite, OLED), coleccionistas de juegos navideños.\n\nCLASIFICACIÓN E (Everyone): apto para toda la familia, sin contenido violento ni inapropiado, valores positivos (al final el Grinch aprende sobre amistad y comunidad).\n\nDuración aproximada: 8-12 horas de gameplay completo. Suficiente para todas las vacaciones de diciembre.\n\nIDIOMAS: inglés audio, subtítulos en varios idiomas (español incluido en la mayoría de regiones).",
    features: [
      "Para Nintendo Switch (todas)",
      "Clasificación E familiar",
      "8-12 horas de juego",
      "Multijugador local 2P",
      "Subtítulos en español",
      "Regalo navideño perfecto",
      "Niños 6-14 años",
    ],
  },
  {
    match: "Mr. Bubble",
    category: "Más productos",
    brand: "Mr. Bubble",
    name: "Mr. Bubble Extra Suave Espuma de Baño Bebé Sin Lágrimas Hipoalergénica 473ml",
    description: "Mr. Bubble espuma de baño extra suave para bebés. Sin fragancia, hipoalergénica, libre de lágrimas. 473ml. Importado USA · Envío gratis Medellín.",
    longDescription:
      "Mr. Bubble es la marca clásica americana de espuma de baño para niños — fundada en 1961 y todavía la favorita de generaciones de familias. Esta versión Extra Gentle está formulada para los pies más sensibles: bebés, niños con eczema, dermatitis o alergias.\n\nFórmula sin: fragancia (apto para olfato sensible de bebés), parabenos, ftalatos, sulfatos agresivos, colorantes artificiales, gluten, alcohol resecante.\n\nFórmula con: ingredientes hipoalergénicos pediátricos, glicerina (hidrata mientras limpia), aloe vera (calma), pH balanceado para piel infantil.\n\nLA MAGIA DE LA ESPUMA: Mr. Bubble crea espuma abundante con poco producto — los niños AMAN bañarse con espuma. Si tu hijo se resiste al baño, este producto convierte la rutina en juego. La hora del baño deja de ser pelea y se vuelve momento esperado.\n\nIdeal para bebés desde los 6 meses (con autorización pediátrica), niños 1-10 años, niños con eczema, dermatitis atópica o psoriasis, baños relajantes antes de dormir, niños hipersensibles al olor (autismo, sensibilidad sensorial), tener algo natural para el baño en casa.\n\nMODO DE USO: llenar la tina con agua tibia. Agregar 1-2 tapas bajo el chorro fuerte (genera más espuma). Dejar al niño jugar 10-15 minutos máximo (más tiempo en agua puede resecar piel). Enjuagar bien al salir.\n\nFRAGANCIA: aroma muy suave, casi imperceptible. Apto para nariz sensible.\n\n473ml = aproximadamente 2-3 meses de uso semanal en un niño.",
    features: [
      "Sin fragancia ni colorantes",
      "Hipoalergénico pediátrico",
      "Sin lágrimas — apto ojitos",
      "Para eczema y dermatitis",
      "Aloe vera + glicerina",
      "Marca clásica USA 1961",
      "473ml · 2-3 meses",
    ],
  },
  {
    match: "Vino",
    category: "Más productos",
    brand: "Sommelier Tools",
    name: "Embudo Decantador Vino Acero Inox + Filtro Sedimentos - Aireador Vino",
    description: "Embudo decantador para vino en acero inox con filtro de sedimentos. Mejora aireación y sabor. Regalo amantes vino · Envío 24h Medellín.",
    longDescription:
      "Si te tomas el vino en serio, este embudo decantador es la herramienta que convierte cualquier botella mediocre en una experiencia digna de sommelier. Funciona como decanter rápido y filtro al mismo tiempo.\n\nLA CIENCIA DETRÁS: el vino tinto, especialmente reservas y crianzas, mejora dramáticamente al exponerse al oxígeno (decantación). Este embudo aerea el vino mientras lo viertes, ahorrándote 30-60 minutos de espera. Además, su filtro retiene sedimentos naturales (taninos, levaduras) que pueden amargar el último trago.\n\nEspecificaciones: cuerpo de acero inoxidable de calidad alimentaria, malla filtro fina (retiene sedimentos sin afectar sabor), curva de aireación patentada (genera microburbujas para oxigenación rápida), diseño compacto que cabe en cualquier botella estándar de 750ml, lavable a mano (no apto lavavajillas).\n\nIdeal para amantes del vino tinto reserva, regalos para gourmets y sommeliers aficionados, eventos sociales y cenas (impresiona invitados), restaurantes pequeños y bares de tapas, dueños de viñedos privados que producen vino con sedimentos.\n\nMODO DE USO: 1) Colocar el embudo en la botella receptora (decanter) o copa. 2) Verter el vino lentamente desde la botella original. 3) El vino se aerea automáticamente al pasar por la curva. 4) Servir.\n\nLAVADO: enjuagar inmediatamente después de uso con agua tibia. Si quedaron sedimentos, lavar con agua + bicarbonato suave. Secar boca abajo.",
    features: [
      "Acero inoxidable calidad alimentaria",
      "Aireador rápido en segundos",
      "Filtro de sedimentos integrado",
      "Para vino tinto reserva",
      "Regalo gourmet perfecto",
      "Compatible 750ml estándar",
      "Lavable a mano",
    ],
  },
  {
    match: "Scosche",
    category: "Más productos",
    brand: "Scosche",
    name: "Scosche MagicMount Pro Qi - Soporte Carro Magnético Carga Inalámbrica",
    description: "Soporte de carro Scosche MagicMount Pro con carga inalámbrica Qi. Magnético, ajustable. Para iPhone, Samsung y todos compatibles Qi. Importado USA.",
    longDescription:
      "Si pasas mucho tiempo conduciendo con Waze/Maps abierto, Spotify reproduciendo, o atendiendo llamadas, este soporte cambia tu experiencia. Combina dos conveniencias en una: montaje magnético seguro + carga inalámbrica Qi sin enchufes ni cables.\n\nCaracterísticas premium: tecnología de carga inalámbrica Qi (estándar de iPhone, Samsung, Pixel y casi todos los smartphones modernos), montaje magnético patentado (PowerHold™) que sostiene incluso teléfonos pesados, instalación en parabrisas, dashboard o salida de aire (incluye 3 bases), brazo ajustable 360° para orientación perfecta, indicador LED de carga (sabes cuándo está cargando).\n\nPotencia de carga: 10W rápido para Samsung/Android, 7.5W para iPhone (la velocidad oficial de Apple), compatible con casos finos (hasta 3mm de grosor incluyendo MagSafe).\n\nIdeal para Uber/InDrive drivers (uso intensivo todo el día), profesionales que viajan en carro a meetings, viajes largos con navegación constante, personas que olvidan cargar el teléfono en casa, regalos prácticos para conductores, adolescentes con su primer carro.\n\nCOMPATIBILIDAD: iPhone 8, X, 11, 12, 13, 14, 15 (todos sus modelos Pro/Plus); Samsung Galaxy S10+ en adelante; Google Pixel 3 en adelante; cualquier smartphone con Qi wireless charging.\n\nNECESITAS: cable USB-C de tu carro a la base (incluido cable de buena calidad), o un puerto USB de 12V con suficiente potencia (mínimo 2A recomendado).",
    features: [
      "Carga inalámbrica Qi 10W",
      "Magnético PowerHold™ seguro",
      "3 bases: parabrisas/dash/aire",
      "Compatible iPhone y Samsung",
      "Soporta casos hasta 3mm",
      "Para Uber e InDrive",
      "Importado USA",
    ],
  },
];

async function main() {
  console.log(`\n🚀 Aplicando SEO a ${updates.length} productos...\n`);

  let success = 0;
  let notFound = 0;
  let failed = 0;

  for (const u of updates) {
    try {
      const product = await prisma.product.findFirst({
        where: {
          name: { contains: u.match, mode: "insensitive" },
        },
      });

      if (!product) {
        console.warn(`⚠ NO ENCONTRADO: "${u.match}" — verifica el nombre en tu DB.`);
        notFound++;
        continue;
      }

      await prisma.product.update({
        where: { id: product.id },
        data: {
          name: u.name,
          brand: u.brand,
          category: u.category,
          description: u.description,
          longDescription: u.longDescription,
          features: u.features,
        },
      });

      console.log(`✓ [${u.category}] ${u.name.substring(0, 70)}...`);
      success++;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`✗ ERROR en "${u.match}": ${msg}`);
      failed++;
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✨ Resumen: ${success} actualizados · ${notFound} no encontrados · ${failed} con error`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
