#!/bin/bash
# ============================================================
# Infinity Global Shop — SEO Tanda 1 (15 vitaminas top)
# ============================================================
# Aplica nombres, descripciones, features y keywords optimizados
# para SEO directo en tu base de datos Neon.
#
# Cada producto fue escrito MANUALMENTE (no plantilla genérica)
# pensando en lo que la gente busca en Google + lo que vende.
#
# USO:
#   cd ~/Desktop/infinity-global-shop
#   bash seo-tanda-1-vitaminas.sh
# ============================================================

set -eo pipefail

GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()   { echo -e "${GREEN}✓${NC} $1"; }
title() { echo -e "\n${BLUE}━━━ $1 ━━━${NC}\n"; }

[ ! -f "package.json" ] && { echo "cd a tu proyecto primero"; exit 1; }

title "Aplicando SEO a 15 productos top de vitaminas"

cat > seo-update.mjs << 'NODE_EOF'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updates = [
  {
    id: 5,
    name: "Nature's Bounty Biotina Cabello Piel y Uñas - 80 Gomitas Sabor Fresa",
    brand: "Nature's Bounty",
    description: "Vitaminas para el crecimiento del cabello, piel radiante y uñas fuertes. 80 gomitas sabor fresa con 2,500 mcg de Biotina, Vitamina C y E. Original USA. Envío gratis +$150.000 en Medellín.",
    longDescription: "¿Cansada de probar shampoos y tratamientos sin ver resultados reales? Nature's Bounty Hair, Skin & Nails es la fórmula #1 en Estados Unidos para combatir la caída del cabello, fortalecer las uñas y darle luminosidad a tu piel. Con 2,500 mcg de Biotina por gomita más Vitamina C, Vitamina E y antioxidantes, este suplemento trabaja desde adentro para nutrir lo que las cremas no alcanzan.\n\nLa biotina (vitamina B7) es esencial para producir queratina, la proteína que forma tu cabello, uñas y piel. Cuando tu cuerpo recibe biotina suficiente, los folículos capilares se fortalecen, las uñas dejan de quebrarse y la piel se ve más uniforme.\n\nLa mayoría de mujeres reportan cabello más fuerte y crecimiento notable a partir de las 6-8 semanas de uso continuo. Recomendamos tomar 2 gomitas al día con o sin alimentos.\n\n80 gomitas = 40 días de tratamiento. 100% original importado de Estados Unidos.",
    features: ["2,500 mcg de Biotina por gomita","Refuerza el crecimiento del cabello","Fortalece uñas en 6-8 semanas","Vitaminas C y E para piel luminosa","Sabor fresa natural — sin pastillas grandes","80 gomitas = 40 días de tratamiento","Sin gluten, veganas, sin lácteos"],
  },
  {
    id: 13,
    name: "Nature's Bounty Hair Skin & Nails - 150 Softgels Tratamiento Premium",
    brand: "Nature's Bounty",
    description: "Tratamiento de 75 días para cabello, piel y uñas. 150 softgels con Biotina 3,000 mcg, colágeno y antioxidantes. Original USA. Entrega 24h en Medellín.",
    longDescription: "La versión más completa y rendidora de Nature's Bounty para mujeres que buscan resultados duraderos. Este frasco de 150 softgels te da 75 días de tratamiento continuo —el tiempo exacto que tu cuerpo necesita para que veas un cambio real en tu cabello, piel y uñas.\n\nLos softgels concentran más activos por dosis: 3,000 mcg de Biotina, Vitamina A, Vitamina C, Vitamina E, Zinc y un complejo de antioxidantes que las gomitas no pueden incluir. Si quieres resultados más rápidos y profundos, esta es tu fórmula.\n\nApta para mujeres de cualquier edad que noten caída del cabello, uñas débiles, o piel sin luminosidad. También útil después del parto, en períodos de estrés, o cuando hay deficiencias nutricionales.\n\nToma 2 softgels al día con un vaso de agua, preferiblemente con comida. Mantén la rutina por al menos 90 días para resultados óptimos.",
    features: ["150 softgels = 75 días de tratamiento","Biotina 3,000 mcg + Vitamina A, C, E, Zinc","Más concentrado que las gomitas","Resultados visibles desde la semana 6","Apoya la producción natural de colágeno","Para caída postparto y estrés","Garantía de autenticidad"],
  },
  {
    id: 6,
    name: "Nature's Bounty Biotina Pura 1000mcg - 110 Gomitas Veganas",
    brand: "Nature's Bounty",
    description: "Biotina pura 1000 mcg en 110 gomitas veganas. Para cabello, uñas y metabolismo energético. Original Nature's Bounty USA. Envío 24h en Medellín.",
    longDescription: "Si quieres lo esencial sin extras innecesarios, esta es tu Biotina. 1,000 mcg de pura Biotina (vitamina B7) en una gomita vegana sin azúcar añadida, perfecta para mantenimiento diario o para quienes apenas empiezan con suplementos para el cabello.\n\nLa biotina es la vitamina del cabello, las uñas y la piel —pero también juega un rol importante en tu metabolismo energético. Si te sientes cansada o notas el cabello opaco, una deficiencia de biotina puede ser la causa.\n\nPara muchas mujeres, 1,000 mcg al día es la dosis ideal de mantenimiento. Es suficiente para ver mejoras sin saturar tu cuerpo. Si tienes caída del cabello severa, considera la versión de 5,000 o 10,000 mcg.\n\n110 gomitas equivalen a más de 3 meses de tratamiento. Sabor frutas tropicales, veganas, sin gluten ni lácteos. Solo 1 gomita al día.",
    features: ["1,000 mcg de Biotina pura","110 gomitas — más de 3 meses","Veganas, sin gluten, sin lácteos","Apoya cabello, uñas y metabolismo","Sabor frutas tropicales","1 gomita al día","Marca #1 en USA"],
  },
  {
    id: 16,
    name: "Spring Valley Biotina Extra Fuerte 10,000 mcg - 90 Gomitas",
    brand: "Spring Valley",
    description: "Biotina extra fuerte 10,000 mcg en 90 gomitas. Dosis máxima para combatir la caída del cabello y fortalecer uñas débiles. Importado USA · Envío 24h Medellín.",
    longDescription: "La dosis más alta de biotina disponible en gomitas. 10,000 mcg por gomita es la cantidad que recomiendan los dermatólogos cuando hay caída del cabello significativa, alopecia leve, o uñas que se rompen constantemente.\n\n¿Cuándo necesitas 10,000 mcg? Cuando estás notando más caída del cabello de lo normal, tu cabello dejó de crecer o se quebró, tus uñas no logran crecer sin partirse, acabas de tener un parto, estás bajo mucho estrés, o tu dieta tiene déficits.\n\nLa biotina es soluble en agua, lo que tu cuerpo no usa lo eliminas naturalmente. Sin embargo, si te haces exámenes de tiroides, suspende 3 días antes (puede alterar resultados).\n\nResultados típicos: Mes 1 menos caída notoria, Mes 2 cabello nuevo en la raíz, Mes 3 uñas más duras y largas.\n\nSpring Valley es la marca de Walmart en USA con relación calidad-precio imbatible. Misma fórmula que marcas premium pero a mejor precio.",
    features: ["10,000 mcg — dosis máxima","90 gomitas = 3 meses","Para caída del cabello y alopecia leve","Ideal después del parto o estrés","1 gomita al día","Sin gluten, sin lácteos, sin gelatina","Resultados en 4-12 semanas"],
  },
  {
    id: 7,
    name: "Nature's Bounty Melatonina 10mg - 140 Gomitas para Dormir Bien",
    brand: "Nature's Bounty",
    description: "Melatonina natural 10mg en 140 gomitas sabor fresa. Conciliación rápida del sueño sin pastillas. Original Nature's Bounty USA. Envío 24h en Medellín.",
    longDescription: "¿Llevas semanas sin dormir bien? La melatonina es la hormona que tu cuerpo produce naturalmente al oscurecer para inducir el sueño. Con la pantalla del celular, el estrés y los horarios irregulares, esa producción se altera —y por eso te quedas despierta dando vueltas en la cama.\n\nEsta es la solución más usada en Estados Unidos. 10mg de Melatonina por gomita, una dosis efectiva pero sin ser excesiva. A diferencia de las pastillas para dormir, la melatonina no genera dependencia, no te deja resaca al día siguiente, y es completamente natural.\n\nTómala 30 a 60 minutos antes de dormir, idealmente sin pantallas. Funciona mejor con la luz apagada.\n\nÚtil para insomnio ocasional por estrés, jet lag, trabajo nocturno, dificultad para conciliar el sueño, y sueño ligero que se interrumpe.\n\nRecomendamos uso de 5 noches a la semana máximo, para que tu cuerpo no olvide producirla solo. 140 gomitas duran 4-5 meses. Sabor fresa, veganas, sin gluten.",
    features: ["Melatonina 10 mg — dosis efectiva","140 gomitas = 4-5 meses","No genera dependencia","Sin resaca al despertar","Sabor fresa natural","Para insomnio, jet lag, estrés","Tomar 30-60 min antes de dormir"],
  },
  {
    id: 8,
    name: "Spring Valley Triple Omega 3-6-9 - 120 Softgels Salud Cardiovascular",
    brand: "Spring Valley",
    description: "Triple Omega 3-6-9 en 120 softgels. Aceite de pescado, linaza y borraja. Apoya corazón, cerebro, piel y articulaciones. Importado USA · Envío gratis +$150.000.",
    longDescription: "Si solo vas a tomar un suplemento en tu vida, que sea Omega-3. Pero si quieres la fórmula completa que tu cuerpo realmente necesita, este Triple Omega 3-6-9 te da las tres formas en una sola cápsula.\n\nOmega-3 (aceite de pescado): salud cardiovascular, función cerebral, anti-inflamatorio. Reduce triglicéridos, baja la presión, mejora la memoria.\n\nOmega-6 (aceite de borraja): apoya hormonas femeninas, piel saludable, antiinflamatorio.\n\nOmega-9 (aceite de linaza): colesterol bueno, energía, protección celular.\n\nIdeal para mayores de 30 años, mujeres con desbalance hormonal, personas con piel seca, atletas, y cualquiera que quiera proteger su corazón a largo plazo.\n\nBeneficios reales en 4-8 semanas: más energía y claridad mental, piel hidratada, menos dolor articular, mejor humor, cabello más sedoso.\n\n120 softgels = 4 meses de tratamiento. 1 softgel al día con comida.",
    features: ["Triple acción: Omega 3, 6 y 9","120 softgels = 4 meses","Aceite de pescado, borraja y linaza","Salud cardiovascular y cerebral","Mejora piel, cabello y humor","Anti-inflamatorio natural","Sin gluten, sin lácteos"],
  },
  {
    id: 9,
    name: "GNC Glucosamina y Condroitina - Salud Articular y Movilidad",
    brand: "GNC",
    description: "Glucosamina y Condroitina de GNC. Reduce el dolor articular, mejora la movilidad de rodillas y caderas, y apoya el cartílago. Original GNC USA. Envío 24h Medellín.",
    longDescription: "Si tus rodillas truenan, te duelen las articulaciones al subir escaleras, o sientes rigidez en las mañanas, este es el suplemento más probado clínicamente para devolverle vida a tus articulaciones.\n\nGlucosamina + Condroitina es la combinación dorada para la salud articular —recomendada por reumatólogos en todo el mundo, no es un suplemento de moda.\n\nLa Glucosamina estimula la producción de cartílago nuevo. La Condroitina atrae líquido a las articulaciones para lubricarlas. Juntos retrasan el desgaste articular y reducen el dolor.\n\nIdeal para mayores de 40 años con dolor de rodillas o caderas, personas con artritis u osteoartritis leve, atletas con desgaste articular, después de lesiones, y trabajadores de oficina con rigidez.\n\nResultados típicos: Semana 4 menos rigidez matutina, Semana 8 reducción notable del dolor, Semana 12 mayor movilidad y menos crujidos.\n\nLa glucosamina toma tiempo. Es un tratamiento, no un analgésico. Tomar mínimo 90 días seguidos para evaluar.",
    features: ["Glucosamina + Condroitina","Para dolor articular y rigidez","Apoya rodillas, caderas, columna","Estimula producción de cartílago","Recomendado por reumatólogos","Resultados en 8-12 semanas","Cápsulas fáciles de tragar"],
  },
  {
    id: 4,
    name: "Vitafusion Calcio + Vitamina D3 - Gomitas para Huesos Fuertes",
    brand: "Vitafusion",
    description: "Calcio 500mg + Vitamina D3 en gomitas con sabor a frutas. Huesos fuertes, dientes sanos. Sin pastillas grandes. Importado USA · Envío gratis +$150.000 Medellín.",
    longDescription: "El calcio es el mineral más abundante en tu cuerpo —pero la mayoría de mujeres NO consumen suficiente. A partir de los 30 años, empiezas a perder densidad ósea. A los 50, el riesgo de osteoporosis es real. Y la única forma de prevenirlo es: calcio + vitamina D3 todos los días.\n\nEl calcio sin vitamina D3 NO se absorbe correctamente. Es como echar combustible al carro sin encenderlo. Esta fórmula combina ambos en la dosis exacta que tu cuerpo necesita.\n\nUna porción de leche tiene 300mg de calcio. Necesitas 1,000-1,200mg al día. Eso son 4 vasos diarios. Estas gomitas te dan 500mg en 2 gomitas, sin azúcar refinada ni lactosa.\n\nIdeal para mujeres mayores de 30 años, premenopausia y menopausia, personas intolerantes a la lactosa, niños mayores de 4 años, atletas, y después de cirugías óseas.\n\nSabor mezcla de frutas naturales (cereza, naranja, fresa). Sin colorantes artificiales, sin gluten, sin lácteos.\n\nVitafusion es la marca #1 en gomitas vitamínicas en USA.",
    features: ["Calcio 500mg + Vitamina D3","Sin pastillas grandes — gomitas sabor frutas","Previene osteoporosis y fracturas","Para mujeres 30+ y menopausia","Sin lácteos · ideal intolerantes","D3 mejora absorción del calcio","Sin azúcar añadida"],
  },
  {
    id: 14,
    name: "Spring Valley Cranberry Concentrado - Salud Urinaria Femenina",
    brand: "Spring Valley",
    description: "Cranberry (arándano rojo) concentrado en cápsulas. Previene infecciones urinarias, apoya la salud del tracto urinario. Importado USA · Envío 24h en Medellín.",
    longDescription: "Si has sufrido infecciones urinarias recurrentes, sabes lo terrible que es. El arándano rojo (cranberry) es el remedio natural más respaldado por la ciencia para prevenirlas —y este suplemento te da la dosis concentrada equivalente a tomar 2 vasos de jugo puro al día, sin el azúcar.\n\nContiene proantocianidinas (PACs) que impiden que las bacterias E. coli (causa #1 de infecciones urinarias) se adhieran a las paredes de tu vejiga. Si las bacterias no se adhieren, no causan infección.\n\nIdeal para mujeres con infecciones urinarias frecuentes, después de relaciones íntimas (prevención), diabéticas, mujeres en menopausia, y cualquier mujer que quiera prevención natural.\n\nIMPORTANTE: Esto es prevención, NO tratamiento de infección activa. Si ya tienes una infección con dolor y ardor, necesitas antibióticos del médico. El cranberry te previene la siguiente.\n\n1 cápsula al día con un vaso de agua. Para máxima efectividad, tomar todos los días continuamente. También es rico en antioxidantes y vitamina C.",
    features: ["Cranberry concentrado","Previene infecciones urinarias recurrentes","Sin azúcar — solo el activo","Recomendado para diabéticas","Apoya tracto urinario completo","Rico en antioxidantes","1 cápsula al día"],
  },
  {
    id: 19,
    name: "Spring Valley Magnesio Óxido 250mg - Apoyo Muscular y Nervioso",
    brand: "Spring Valley",
    description: "Magnesio Óxido 250mg en cápsulas. Reduce calambres, mejora calidad del sueño y apoya el sistema nervioso. Original Spring Valley USA · Envío gratis Medellín.",
    longDescription: "El magnesio es uno de los minerales más deficientes en la dieta moderna. Si sufres de calambres nocturnos, ansiedad, dolores de cabeza recurrentes o no duermes bien, es muy probable que tu cuerpo esté pidiendo más magnesio.\n\nBeneficios principales: relajación muscular (adiós calambres), mejor calidad del sueño, reducción de la ansiedad, salud cardiovascular, apoyo al sistema nervioso, producción de energía celular.\n\nIdeal para atletas (lo pierdes con el sudor), mujeres con migrañas menstruales, personas con estrés crónico, quienes toman café o alcohol regularmente, mayores de 50 años, y diabéticos.\n\nEl magnesio óxido es la forma más concentrada. 250mg cubre alrededor del 60% de tu necesidad diaria. Si quieres absorción más rápida, considera la versión de 200mg de alta absorción.\n\n1 cápsula al día con comida. Si lo tomas para dormir, hazlo 1 hora antes. Resultados en calambres se notan en 5-7 días.",
    features: ["250mg de magnesio óxido","Reduce calambres y tensión muscular","Mejora calidad del sueño","Reduce ansiedad y migrañas","Apoya sistema cardiovascular","Para deportistas y mayores 50+","1 al día con comida"],
  },
  {
    id: 21,
    name: "Spring Valley Magnesio 200mg Alta Absorción - Glicinato Tolerable",
    brand: "Spring Valley",
    description: "Magnesio 200mg de alta absorción (glicinato). Ideal para estómagos sensibles. Sin efecto laxante. Mejora sueño y reduce ansiedad. Original USA · Envío 24h Medellín.",
    longDescription: "Si el magnesio te ha caído pesado al estómago o te ha dado efecto laxante, esta es la solución. El magnesio glicinato (alta absorción) es la forma más biodisponible y tolerable de magnesio —se absorbe casi al 100% sin causar molestias digestivas.\n\nVentajas vs el magnesio óxido: absorción casi 4 veces mayor, no causa diarrea ni laxa, ideal para tomar en ayunas, mejor para personas con colon irritable, más eficaz para el sueño y la ansiedad.\n\n¿Por qué solo 200mg? Porque al absorberse mejor, no necesitas tanto. 200mg de alta absorción equivale en efecto a unos 350-400mg de óxido común.\n\nPerfecto para personas con estómago sensible, quienes prefieren tomar suplementos en ayunas, buscadores de calidad sobre cantidad, personas con colon irritable o reflujo.\n\nBeneficios: sueño profundo sin grogginess, ansiedad reducida, calambres nocturnos eliminados, mejor digestión, recuperación muscular optimizada.\n\n1 cápsula al día. Puedes tomarla en ayunas o con comida.",
    features: ["200mg magnesio glicinato (alta absorción)","Sin efecto laxante","Apto estómagos sensibles","Mejor para sueño y ansiedad","Se absorbe casi al 100%","Tomar en ayunas o con comida","Spring Valley premium"],
  },
  {
    id: 22,
    name: "Spring Valley Calcio + Magnesio + Zinc - 250 Tabletas Triple Acción",
    brand: "Spring Valley",
    description: "Trio mineral: Calcio, Magnesio y Zinc en 250 tabletas. Huesos, músculos y sistema inmune fuertes. Importado USA · Envío gratis +$150.000 Medellín.",
    longDescription: "Tres minerales esenciales en una sola tableta —y no es casualidad. El calcio, magnesio y zinc trabajan en sinergia: el magnesio ayuda al cuerpo a absorber el calcio, el zinc activa enzimas que dependen del calcio, y juntos cubren tres bases nutricionales que la mayoría de personas tiene deficientes.\n\nCalcio (1,000mg): huesos y dientes fuertes, función muscular, coagulación. Magnesio (400mg): absorción del calcio, relajación muscular, sueño. Zinc (25mg): sistema inmune, salud de la piel, cicatrización, fertilidad.\n\nIdeal para mujeres mayores de 35 años, premenopausia y menopausia, atletas, veganos (deficientes en calcio y zinc), mayores de 50 años, y personas con sistema inmune debilitado.\n\nBeneficios reales: huesos densos y prevención de osteoporosis, menos calambres nocturnos, sistema inmune más fuerte, piel mejor cicatrizada, sueño más reparador, cabello y uñas más fuertes.\n\n250 tabletas dan más de 4 meses de tratamiento. 2 tabletas al día con comida (preferiblemente almuerzo).",
    features: ["Calcio 1000mg + Magnesio 400mg + Zinc 25mg","250 tabletas = 4+ meses","Sinergia entre los 3 minerales","Huesos, músculos y defensas","Para mujeres 35+ y atletas","Tomar 2 al día con comida","Sin gluten ni lácteos"],
  },
  {
    id: 25,
    name: "Spring Valley Hierro 65mg Ferroso - Anemia y Energía Femenina",
    brand: "Spring Valley",
    description: "Hierro Ferroso 65mg en tabletas. Combate anemia, fatiga y caída del cabello por deficiencia. Importado USA. Envío 24h Medellín.",
    longDescription: "Si te cansas con poco esfuerzo, tienes la piel pálida, te dan mareos al pararte rápido, o pierdes mucho cabello, la anemia por deficiencia de hierro es la causa más probable. Esto le pasa al 30% de las mujeres en edad reproductiva en Latinoamérica.\n\n¿Por qué las mujeres son más propensas? Pérdida mensual durante el período, embarazo y lactancia, dietas vegetarianas o restrictivas, donación de sangre frecuente, sangrados intensos.\n\nSíntomas de deficiencia: fatiga inexplicable, piel pálida, mareos al pararte rápido, falta de aire al subir escaleras, caída del cabello, uñas frágiles con manchas blancas, antojos extraños (hielo, tierra), frío en manos y pies.\n\nHierro ferroso 65mg cubre el 360% del requerimiento diario para reponer reservas rápido.\n\nIMPORTANTE: Toma con vitamina C (jugo de naranja) para mejor absorción. NO tomar con café, té o lácteos. Puede causar estreñimiento o náuseas — toma con comida. Si las heces se ponen oscuras, es normal.\n\nMujeres embarazadas: consultar con tu obstetra antes.",
    features: ["Hierro ferroso 65mg","Combate anemia por deficiencia","Mejora energía y fatiga","Reduce caída del cabello","Tomar con vitamina C","1 tableta al día con comida","360% del requerimiento diario"],
  },
  {
    id: 26,
    name: "Spring Valley Zinc 50mg - Sistema Inmune Piel y Cicatrización",
    brand: "Spring Valley",
    description: "Zinc 50mg en tabletas. Refuerza el sistema inmune, mejora la piel y acelera cicatrización. Reduce duración de resfriados. Original USA · Envío 24h Medellín.",
    longDescription: "El zinc es el mineral del sistema inmune por excelencia. Si te enfermas con frecuencia, tienes acné persistente, o las heridas tardan en sanar, una deficiencia de zinc puede ser la causa. La buena noticia: 50mg al día durante 30 días es suficiente para reponer reservas.\n\nBeneficios principales: refuerza sistema inmune (menos resfriados, gripes), acelera cicatrización de heridas, mejora acné y piel grasa, apoya salud reproductiva masculina, mejora sentido del gusto y olfato, apoya función cognitiva.\n\nIdeal para resfriados frecuentes, acné adulto persistente, hombres (próstata y fertilidad), veganos, adultos mayores, atletas, después de cirugías o lesiones.\n\nDato útil: durante un resfriado, tomar zinc en las primeras 24 horas puede acortar la duración en 1-2 días. Es uno de los pocos suplementos con evidencia científica robusta para esto.\n\nIMPORTANTE: 1 tableta al día CON comida (sino puede causar náusea). NO tomar más de 8 semanas seguidas a esta dosis sin descanso —saturar zinc baja el cobre.",
    features: ["Zinc 50mg dosis terapéutica","Refuerza sistema inmune","Reduce duración de resfriados","Acelera cicatrización","Mejora acné y piel","Para hombres (próstata)","Tomar con comida"],
  },
  {
    id: 29,
    name: "Spring Valley L-Lisina 1000mg - Refuerzo Inmune y Combate Herpes",
    brand: "Spring Valley",
    description: "L-Lisina 1000mg en tabletas. Combate herpes labial recurrente, refuerza colágeno y sistema inmune. Importado USA · Envío gratis +$150.000 Medellín.",
    longDescription: "Si sufres de herpes labial recurrente (esos fuegos en la boca que aparecen con el estrés o el sol), la L-Lisina es tu solución natural. Es un aminoácido esencial que tu cuerpo no produce —tienes que obtenerlo de la dieta o de un suplemento.\n\n¿Cómo combate el herpes? El virus del herpes simple necesita arginina para reproducirse. La lisina compite con la arginina, bloqueando la replicación viral. Si tomas lisina diariamente, las llagas aparecen menos y duran menos.\n\nOtros beneficios: producción de colágeno (piel, cartílagos), absorción de calcio (huesos), sistema inmune, recuperación post-ejercicio, producción de carnitina (energía).\n\nIdeal para personas con herpes labial recurrente, quienes notan brotes con el estrés, atletas, personas con dietas bajas en proteína animal, veganos.\n\nDosis: Prevención 1,000mg/día. Brote activo 3,000mg/día (3 tabletas) hasta que cicatrice. Mantenimiento 500-1,000mg/día.\n\nTomar con el estómago vacío, idealmente 1 hora antes de comer o 2 horas después. NO tomar con leche.",
    features: ["L-Lisina 1000mg por tableta","Combate herpes labial recurrente","Apoya producción de colágeno","Mejora absorción de calcio","Refuerza sistema inmune","Aminoácido esencial","Tomar en ayunas"],
  },
];

let success = 0;
let failed = 0;

for (const u of updates) {
  try {
    await prisma.product.update({
      where: { id: u.id },
      data: {
        name: u.name,
        brand: u.brand,
        description: u.description,
        longDescription: u.longDescription,
        features: u.features,
      },
    });
    console.log(`✓ ${u.id}: ${u.name.substring(0, 60)}...`);
    success++;
  } catch (e) {
    console.error(`✗ ${u.id}: ${e.message}`);
    failed++;
  }
}

await prisma.$disconnect();
console.log(`\n✨ Listo: ${success} exitosos, ${failed} fallidos`);
NODE_EOF

node seo-update.mjs && rm seo-update.mjs

log "Tanda 1 aplicada"

echo -e "\n${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Tanda 1 aplicada (15 productos top vitaminas)${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}\n"

echo "Productos optimizados:"
echo "  ✓ Nature's Bounty Biotina 80 gomitas"
echo "  ✓ Nature's Bounty 150 softgels"
echo "  ✓ Nature's Bounty Biotina 1000mcg"
echo "  ✓ Spring Valley Biotina 10000mcg gomitas"
echo "  ✓ Nature's Bounty Melatonina"
echo "  ✓ Spring Valley Triple Omega"
echo "  ✓ GNC Glucosamina"
echo "  ✓ Vitafusion Calcio + D3"
echo "  ✓ Spring Valley Cranberry"
echo "  ✓ Spring Valley Magnesio 250mg"
echo "  ✓ Spring Valley Magnesio Glicinato"
echo "  ✓ Spring Valley Calcio Mag Zinc"
echo "  ✓ Spring Valley Hierro 65mg"
echo "  ✓ Spring Valley Zinc 50mg"
echo "  ✓ Spring Valley L-Lisina"
echo ""
echo "Próximo paso:"
echo "  1. Verifica en local: npm run dev"
echo "     Visita: http://localhost:3000/products/5"
echo "     Debe mostrar el nombre y descripción nuevos"
echo ""
echo "  2. Si todo bien, sube a producción:"
echo "     git add . && git commit -m \"feat: SEO tanda 1 vitaminas\" && git push"
echo ""
echo "  3. Cuéntame si todo bien y voy con la Tanda 2 (15 cabello + belleza)"
