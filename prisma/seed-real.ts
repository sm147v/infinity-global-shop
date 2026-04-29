import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Limpiando productos anteriores...");

  // Borra productos previos solo si no tienen pedidos asociados
  await prisma.product.deleteMany({
    where: {
      items: { none: {} },
    },
  });

  console.log("📦 Cargando 60 productos del catálogo Infinity Global Shop...");

  await prisma.product.createMany({
    data: [
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 01 · VITAMINAS Y SUPLEMENTOS (27 productos)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      {
        name: "Vitafusion - Calcium plus Vitamina D3",
        description:
          "Suplemento en gomitas masticables que combina calcio y vitamina D3 para apoyar la salud de huesos y dientes. Ideal para quienes no toleran las pastillas tradicionales. Delicioso sabor a frutas y crema, fácil de tomar todos los días. Frasco con 100 gomitas.",
        price: 130000,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Vitafusion+Calcium+D3",
        stock: 15,
      },
      {
        name: "Nature's Bounty Hair, Skin & Nails 80 gomitas",
        description:
          "Suplemento dietario de la marca estadounidense #1 en belleza nutricional. Cada gomita de sabor fresa aporta 2,500 mcg de Biotina más Vitaminas C y E, nutrientes clave para fortalecer el cabello, mejorar la piel y endurecer las uñas. Frasco x80 gomitas.",
        price: 90000,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Nature%27s+Bounty+Hair+Skin+Nails",
        stock: 20,
      },
      {
        name: "Nature's Bounty Biotina 1000mcg 110 gomitas",
        description:
          "Suplemento de Biotina 1000mcg de Nature's Bounty en formato de gomitas con sabores a uva, naranja y cereza para apoyar la salud del cabello, piel y uñas. Fórmula de salud general con gran sabor certificado. Frasco x110 gomitas.",
        price: 110000,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Nature%27s+Bounty+Biotina+1000mcg",
        stock: 18,
      },
      {
        name: "Nature's Bounty Melatonina 10mg 140 gomitas",
        description:
          "Gomitas para dormir de Nature's Bounty con Melatonina 100% libre de drogas, formuladas para apoyar la salud del sueño de forma natural y sin hábito. Sabor mora azul. Frasco x140 gomitas.",
        price: 135900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Nature%27s+Bounty+Melatonina",
        stock: 15,
      },
      {
        name: "Spring Valley Triple Omega 120 softgels",
        description:
          "Suplemento de la marca Spring Valley con fórmula Triple Omega (3-6-9) 800mg de cada uno, a base de aceites de pescado, lino y borraja, diseñado para apoyar la salud cardiovascular y el bienestar general. Presentación en softgels de fácil absorción. Frasco x120 softgels.",
        price: 95900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Triple+Omega",
        stock: 22,
      },
      {
        name: "GNC Glucosamina y Chondroitina",
        description:
          "Suplemento articular de GNC con Glucosamina, Condroitina y Boswellia para apoyar la salud de las articulaciones, reducir la inflamación y mejorar la movilidad. Ideal para uso diario. 340 tabletas.",
        price: 155000,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=GNC+Glucosamina+Chondroitina",
        stock: 10,
      },
      {
        name: "Tylenol 8HR Dolor Artritis",
        description:
          "Tylenol Artritis 8HR es un analgésico de liberación extendida con Acetaminofén 650mg por cápsula, formulado específicamente para el alivio prolongado del dolor articular leve a moderado. Una sola toma actúa hasta 8 horas. Frasco x290 cápsulas.",
        price: 169900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Tylenol+8HR+Artritis",
        stock: 12,
      },
      {
        name: "Preparation H Ungüento para hemorroides",
        description:
          "Ungüento hemorroides de la reconocida marca Preparation H que alivia el picor, ardor e incomodidad, reduce el tejido inflamado y previene mayor irritación interna y externa.",
        price: 39900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Preparation+H",
        stock: 25,
      },
      {
        name: "Devrom Desodorante interno",
        description:
          "Devrom es un desodorante interno en tableta con 200mg de Subgalato de Bismuto, diseñado para neutralizar los olores corporales desde adentro. Ideal para personas con condiciones digestivas o postquirúrgicas. Frasco x100 tabletas masticables.",
        price: 165900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Devrom",
        stock: 8,
      },
      {
        name: "Nature's Bounty Hair, Skin & Nails 150 softgels",
        description:
          "La versión avanzada de la marca #1 en belleza nutricional, ahora en softgels de liberación rápida con el doble de Biotina: 5,000mcg por porción, más Aceite de Argán, Ácido Hialurónico y Vitaminas C & E para resultados más potentes y visibles en cabello, piel y uñas. Caja x150 softgels.",
        price: 120000,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Nature%27s+Bounty+Advanced",
        stock: 15,
      },
      {
        name: "Cranberry Spring Valley",
        description:
          "Suplemento de arándano rojo concentrado con vitamina C, especialmente formulado para apoyar la salud del tracto urinario. Ayuda a mantener el sistema urinario limpio y saludable de forma natural. Fácil de tomar, frasco con 60 softgels.",
        price: 89900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Cranberry+Spring+Valley",
        stock: 18,
      },
      {
        name: "Spring Valley Potasio 99mg",
        description:
          "Suplemento de potasio que contribuye al buen funcionamiento del corazón y al equilibrio de fluidos en el cuerpo. Apoya la salud cardiovascular y el correcto funcionamiento muscular. Presentación Value Size con gran cantidad de tabletas.",
        price: 149900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Potasio",
        stock: 12,
      },
      {
        name: "Spring Valley Biotina 10,000mcg 90 gomitas",
        description:
          "Biotina 10,000mcg en gomitas de Spring Valley para fortalecer cabello, piel y uñas de manera deliciosa y sin esfuerzo. Fórmula extra strength en formato masticable.",
        price: 120000,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Biotina+Gomitas",
        stock: 20,
      },
      {
        name: "Spring Valley Biotin Extra Strength 10,000mcg",
        description:
          "Biotina de máxima concentración 10,000mcg de Spring Valley para un soporte intensivo del cabello, piel y uñas, ideal para quienes buscan resultados más rápidos y visibles.",
        price: 79900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Biotin+10000mcg",
        stock: 25,
      },
      {
        name: "Spring Valley Kid's Multi Gummies",
        description:
          "Multivitamínico completo en gomitas para niños de Spring Valley con vitaminas y minerales esenciales para apoyar su crecimiento, energía e inmunidad de forma deliciosa.",
        price: 150000,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Kid%27s+Multi",
        stock: 15,
      },
      {
        name: "Spring Valley Magnesium Oxide 250mg",
        description:
          "Óxido de Magnesio de Spring Valley en alta potencia para apoyar la función muscular, nerviosa y el bienestar general. Fórmula de liberación estándar de alta absorción. Frasco x250 tabletas.",
        price: 79900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Magnesium+250mg",
        stock: 20,
      },
      {
        name: "Spring Valley Magnesium Oxide 400mg",
        description:
          "Óxido de Magnesio de Spring Valley en alta potencia para apoyar la función muscular, nerviosa y el bienestar general. Fórmula de liberación estándar de alta absorción. Frasco x250 tabletas.",
        price: 111900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Magnesium+400mg",
        stock: 18,
      },
      {
        name: "Spring Valley Magnesio 200mg Alta Absorción",
        description:
          "Magnesio de alta absorción 200mg en cápsulas vegetarianas de Spring Valley, formulado para relajar músculos, apoyar el sueño y la salud cardiovascular. Frasco x60 cápsulas.",
        price: 84900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Magnesio+200mg",
        stock: 22,
      },
      {
        name: "Spring Valley Calcio, Magnesio y Zinc 250 tabletas",
        description:
          "Suplemento completo de Spring Valley con Calcio, Magnesio, Zinc y Vitamina D para fortalecer huesos, dientes y músculos en una sola cápsula diaria. Frasco x250 tabletas.",
        price: 95900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Cal+Mag+Zinc",
        stock: 18,
      },
      {
        name: "Spring Valley Calcium 600mg + Vitamina D",
        description:
          "Calcio 600mg con Vitamina D3 de Spring Valley para apoyar la salud ósea y la absorción óptima del calcio en el organismo. Presentación de alta cantidad para uso prolongado.",
        price: 110000,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Calcium+600mg",
        stock: 15,
      },
      {
        name: "Spring Valley Selenium 200mcg",
        description:
          "Selenio 200mcg de Spring Valley, mineral antioxidante esencial para apoyar la función tiroidea, el sistema inmune y proteger las células del daño oxidativo. Frasco x90 tabletas.",
        price: 64900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Selenium",
        stock: 20,
      },
      {
        name: "Spring Valley Hierro 65mg",
        description:
          "Suplemento de Hierro 65mg de Spring Valley de liberación gradual para apoyar la producción de glóbulos rojos y combatir la deficiencia de hierro de forma suave con el estómago. Frasco x100 tabletas.",
        price: 69900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Hierro+65mg",
        stock: 22,
      },
      {
        name: "Spring Valley Zinc 50mg",
        description:
          "Zinc 50mg de Spring Valley para fortalecer el sistema inmune, apoyar la cicatrización de tejidos y la salud reproductiva. Presentación x200 tabletas.",
        price: 59900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Zinc+50mg",
        stock: 25,
      },
      {
        name: "Spring Valley Zinc 50mg Masticable",
        description:
          "Zinc 50mg en tabletas masticables de Spring Valley con sabor frutal, la opción ideal para quienes prefieren no tragar cápsulas sin sacrificar la dosis diaria de este mineral esencial. x150 tabletas.",
        price: 69900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+Zinc+Masticable",
        stock: 20,
      },
      {
        name: "Pepcid Complete Dual Action 100 cápsulas",
        description:
          "Antiácido de doble acción con Famotidina, Carbonato de Calcio y Magnesio para alivio rápido de la acidez y la indigestión. Con solo una tableta masticable sabor berry. Frasco x100 tabletas.",
        price: 200000,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Pepcid+Complete",
        stock: 10,
      },
      {
        name: "Spring Valley L-Lysine 1000mg",
        description:
          "Suplemento de aminoácido esencial L-Lisina 1000mg de Spring Valley, formulado para apoyar la salud de tejidos, favorecer la producción de colágeno y fortalecer el sistema inmune. Ideal para la recuperación y el bienestar general. Frasco x100 tabletas.",
        price: 109900,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Spring+Valley+L-Lysine",
        stock: 15,
      },
      {
        name: "Advil Ibuprofeno 200mg 24 cápsulas",
        description:
          "Advil es el analgésico y antifebril de confianza mundial con Ibuprofeno 200mg (NSAID), efectivo contra dolores de cabeza, musculares, fiebre y molestias generales. Presentación en cápsulas recubiertas de fácil ingesta. Caja/frasco x24 cápsulas.",
        price: 50000,
        image: "https://placehold.co/600x600/f5e6dc/8b6f47?text=Advil+Ibuprofeno+200mg",
        stock: 30,
      },

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 02 · CUIDADO Y BELLEZA (12 productos)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      {
        name: "Bubble Slam Dunk Hydrating Moisturizer",
        description:
          "Bubble es una marca de skincare joven y vegana con su hidratante Slam Dunk, formulada para nutrir e hidratar profundamente todo tipo de piel con ingredientes de alta calidad. Presentación elegante y moderna de 50ml.",
        price: 50000,
        image: "https://placehold.co/600x600/fde2e4/8b6f47?text=Bubble+Slam+Dunk",
        stock: 15,
      },
      {
        name: "AMBI Complexion Cleansing Bar",
        description:
          "Jabón facial y corporal de la marca AMBI, formulado para todo tipo de piel con propiedades aclarantes y unificadoras del tono. Limpia profundamente mientras cuida y suaviza la piel con cada uso. Presentación x2 barras de 3.5oz.",
        price: 25900,
        image: "https://placehold.co/600x600/fde2e4/8b6f47?text=AMBI+Cleansing+Bar",
        stock: 25,
      },
      {
        name: "Earth Therapeutics Foot Repair Therapeutic Balm",
        description:
          "Bálsamo terapéutico orgánico para pies con Aloe Vera, Aceite de Árbol de Té y Manzanilla, formulado para suavizar, reparar y revitalizar pies secos y agrietados. 118ml.",
        price: 59900,
        image: "https://placehold.co/600x600/fde2e4/8b6f47?text=Earth+Therapeutics+Foot+Balm",
        stock: 18,
      },
      {
        name: "Dove Men+Care Extra Fresh Antiperspirant",
        description:
          "Antitranspirante de Dove Men+Care con protección 72 horas, fórmula refrescante que cuida la piel mientras mantiene el frescor todo el día. Pack x2 barras.",
        price: 42900,
        image: "https://placehold.co/600x600/fde2e4/8b6f47?text=Dove+Men+Extra+Fresh",
        stock: 22,
      },
      {
        name: "Secret Powder Fresh Antiperspirant",
        description:
          "Antitranspirante y desodorante para mujer de Secret con fragancia fresca a polvo, protección pH balanceada de larga duración para mantenerte segura y fresca todo el día.",
        price: 32900,
        image: "https://placehold.co/600x600/fde2e4/8b6f47?text=Secret+Powder+Fresh",
        stock: 25,
      },
      {
        name: "Secret Spring Breeze Antiperspirant",
        description:
          "Antitranspirante clásico de Secret con aroma limpio y fresco, protección confiable de larga duración con fórmula suave para la piel, el favorito de siempre.",
        price: 29900,
        image: "https://placehold.co/600x600/fde2e4/8b6f47?text=Secret+Spring+Breeze",
        stock: 25,
      },
      {
        name: "Degree Men Desodorante Viajero",
        description:
          "Antitranspirante en barra de Degree Men con protección de 48 horas contra el sudor y el olor, fórmula de liberación de movimiento que activa mayor protección cuando más lo necesitas.",
        price: 6900,
        image: "https://placehold.co/600x600/fde2e4/8b6f47?text=Degree+Men+Travel",
        stock: 40,
      },
      {
        name: "Fixodent Original Complete All Day Hold",
        description:
          "Adhesivo dental clínicamente probado de Fixodent que garantiza una sujeción firme y duradera todo el día para dentaduras postizas. Elegible para HSA y FSA. Pack x3 tubos.",
        price: 42900,
        image: "https://placehold.co/600x600/fde2e4/8b6f47?text=Fixodent+Original",
        stock: 15,
      },
      {
        name: "Irish Spring Gel de Ducha",
        description:
          "Gel de ducha para hombres que ofrece hasta 24 horas de frescura y limpieza profunda, utilizando tecnología neutralizadora de olores. Su fórmula refrescante elimina bacterias, hidrata la piel, es libre de parabenos/ftalatos y cuenta con ingredientes biodegradables.",
        price: 39900,
        image: "https://placehold.co/600x600/fde2e4/8b6f47?text=Irish+Spring+Gel+Ducha",
        stock: 20,
      },
      {
        name: "e.l.f. Cosmetics Lápiz de Cejas Instant Lift",
        description:
          "Un lápiz mecánico de doble punta que incluye una fórmula cremosa para definir y rellenar, y un cepillo para peinar y dar forma a las cejas.",
        price: 39900,
        image: "https://placehold.co/600x600/fde2e4/8b6f47?text=e.l.f.+Lapiz+Cejas",
        stock: 20,
      },
      {
        name: "e.l.f. Monochromatic Multi-Stick",
        description:
          "Stick multiusos de la marca e.l.f. en tono rosado malva para aplicar en mejillas, labios y ojos con un solo producto. Fórmula cremosa de fácil difuminado para un look natural y monocromático en segundos.",
        price: 39900,
        image: "https://placehold.co/600x600/fde2e4/8b6f47?text=e.l.f.+Multi-Stick",
        stock: 20,
      },
      {
        name: "Kit Cuidado Facial",
        description:
          "Kit completo de cuidado facial con productos seleccionados para una rutina diaria efectiva. Ideal para todo tipo de piel.",
        price: 39900,
        image: "https://placehold.co/600x600/fde2e4/8b6f47?text=Kit+Cuidado+Facial",
        stock: 15,
      },

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 03 · CUIDADO DEL CABELLO (8 productos)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      {
        name: "One'n Only Aceite de Argán Tratamiento Capilar",
        description:
          "Tratamiento capilar puro de Aceite de Argán para nutrir, controlar el frizz y aportar brillo intenso a todo tipo de cabello. Fórmula ligera de uso diario.",
        price: 72900,
        image: "https://placehold.co/600x600/e8d5c4/8b6f47?text=One+n+Only+Argan+Oil",
        stock: 18,
      },
      {
        name: "Africa's Best Kids Shea Butter Detangling Moisturizer",
        description:
          "Acondicionador hidratante con Manteca de Karité especialmente formulado para niñas, facilita el desenredado, suaviza y nutre el cabello rizado o trenzado sin maltratarlo.",
        price: 88900,
        image: "https://placehold.co/600x600/e8d5c4/8b6f47?text=Africa%27s+Best+Kids",
        stock: 15,
      },
      {
        name: "Burt's Bees Baby Shampoo & Wash Calming",
        description:
          "Shampoo y gel de baño 2 en 1 para bebé de Burt's Bees con Lavanda calmante, fórmula 99.9% natural, libre de lágrimas e hipoalergénico para una rutina suave y tranquilizadora. 372ml.",
        price: 79900,
        image: "https://placehold.co/600x600/e8d5c4/8b6f47?text=Burt%27s+Bees+Baby",
        stock: 18,
      },
      {
        name: "One 'n Only Argan Oil Defining Curl Cream con Acacia Collagen",
        description:
          "Crema definidora de rizos enriquecida con Aceite de Argán y Colágeno de Acacia para potenciar, definir y controlar los rizos sin encrespar. Hidrata profundamente, reduce el frizz y deja el cabello suave, brillante y bien definido. Presentación de 340g / 12oz.",
        price: 69900,
        image: "https://placehold.co/600x600/e8d5c4/8b6f47?text=One+n+Only+Curl+Cream",
        stock: 20,
      },
      {
        name: "ORS Olive Oil Acondicionador sin Enjuague",
        description:
          "Acondicionador sin enjuague de ORS enriquecido con Aceite de Oliva, Agua de Arroz y Electrolitos para hidratación supercargada y estimulación del crecimiento. Ideal para cabello seco y sin brillo. 475ml.",
        price: 89900,
        image: "https://placehold.co/600x600/e8d5c4/8b6f47?text=ORS+Olive+Oil",
        stock: 15,
      },
      {
        name: "Africa's Best Originals Olive & Shea Deep Conditioner Masque",
        description:
          "Mascarilla acondicionadora profunda con Oliva y Manteca de Karité, especialmente formulada para tratar cabello seco y dañado, restaurando suavidad, elasticidad y brillo intenso. 524g.",
        price: 65900,
        image: "https://placehold.co/600x600/e8d5c4/8b6f47?text=Africa%27s+Best+Olive+Shea",
        stock: 18,
      },
      {
        name: "Africa's Best Originals Carrot & Tea Tree Oil",
        description:
          "Aceite capilar terapéutico con Zanahoria y Árbol de Té que nutre el cuero cabelludo, combate la resequedad y fortalece el cabello desde la raíz hasta las puntas.",
        price: 64900,
        image: "https://placehold.co/600x600/e8d5c4/8b6f47?text=Africa%27s+Best+Carrot+Tea+Tree",
        stock: 18,
      },
      {
        name: "Ricola Swiss Alpine Herbs sin Azúcar",
        description:
          "Los clásicos caramelos suizos de Ricola elaborados con 13 hierbas alpinas, en versión sin azúcar para cuidar la garganta con el sabor natural y refrescante de siempre.",
        price: 9900,
        image: "https://placehold.co/600x600/e8d5c4/8b6f47?text=Ricola+Swiss+Herbs",
        stock: 40,
      },

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 04 · HOGAR (3 productos)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      {
        name: "Mrs. Meyer's Clean Day Multi-Surface Spray Iowa Pine",
        description:
          "Limpiador multiusos de Mrs. Meyer's en edición limitada aroma Iowa Pine, a base de ingredientes de origen vegetal, efectivo en cocina, baño y superficies del hogar con un refrescante olor a pino.",
        price: 99900,
        image: "https://placehold.co/600x600/d4c4b0/8b6f47?text=Mrs.+Meyer%27s+Iowa+Pine",
        stock: 15,
      },
      {
        name: "Mrs. Meyer's Clean Day Multi-Surface Spray Fall Leaves",
        description:
          "Limpiador multiusos Mrs. Meyer's en aroma otoñal Fall Leaves, fórmula biodegradable y de origen vegetal para limpiar cualquier superficie del hogar dejando una fragancia cálida y acogedora.",
        price: 99900,
        image: "https://placehold.co/600x600/d4c4b0/8b6f47?text=Mrs.+Meyer%27s+Fall+Leaves",
        stock: 15,
      },
      {
        name: "Dr Teal's Foaming Bath Soothe & Sleep Lavender",
        description:
          "Espuma de baño Dr Teal's con Aceite Esencial de Lavanda y Sales de Epsom para relajar el cuerpo, calmar la mente y prepararte para un sueño profundo y reparador. 1 litro.",
        price: 65000,
        image: "https://placehold.co/600x600/d4c4b0/8b6f47?text=Dr+Teal%27s+Lavender",
        stock: 20,
      },

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 05 · HERRAMIENTAS (3 productos)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      {
        name: "Klein Tools Impact Screwdriver",
        description:
          "Destornillador de impacto de Klein Tools con múltiples puntas intercambiables, diseño ergonómico y agarre antideslizante para trabajos de electricidad y construcción con mayor potencia y precisión.",
        price: 230000,
        image: "https://placehold.co/600x600/c5b39a/8b6f47?text=Klein+Tools+Impact",
        stock: 8,
      },
      {
        name: "Klein Tools Pass-Thru Modular Crimper",
        description:
          "Ponchadora modular Pass-Thru de Klein Tools, herramienta profesional para crimpar conectores RJ45 y RJ11 con mayor velocidad y precisión. Ideal para instalaciones de redes y telecomunicaciones.",
        price: 369900,
        image: "https://placehold.co/600x600/c5b39a/8b6f47?text=Klein+Tools+Crimper",
        stock: 6,
      },
      {
        name: "Klein Tools Accu-Bend 4-Vial Level 6",
        description:
          "Nivel magnético de 4 ampollas Accu-Bend de Klein Tools con riel magnético patentado que fija el nivel a superficies metálicas. Precisión profesional en un compacto formato de 6 pulgadas.",
        price: 169900,
        image: "https://placehold.co/600x600/c5b39a/8b6f47?text=Klein+Tools+Level",
        stock: 8,
      },

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 06 · MÁS PRODUCTOS (8 productos)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      {
        name: "First Alert Carbon Monoxide Alarm",
        description:
          "Detector de monóxido de carbono de First Alert con alarma sonora, respaldo de batería y fácil instalación plug-in. Protección confiable y discreta para el hogar y la familia.",
        price: 89900,
        image: "https://placehold.co/600x600/b09684/8b6f47?text=First+Alert+CO+Alarm",
        stock: 12,
      },
      {
        name: "CamelBak Hydration Reservoir",
        description:
          "Depósito de hidratación flexible de CamelBak con sistema de boquilla y tubo para mantenerte hidratado en actividades al aire libre, ciclismo o senderismo sin detener el movimiento.",
        price: 155900,
        image: "https://placehold.co/600x600/b09684/8b6f47?text=CamelBak+Hydration",
        stock: 10,
      },
      {
        name: "Fiskars Non-Stick Scissors No.5",
        description:
          "Tijeras antiadherentes Micro-Tip de Fiskars, diseñadas para cortar materiales pegajosos, cintas y adhesivos sin que se adhieran a las hojas. Precisión profesional en un tamaño compacto.",
        price: 69900,
        image: "https://placehold.co/600x600/b09684/8b6f47?text=Fiskars+Scissors",
        stock: 15,
      },
      {
        name: "LEGO Chain Reactions Klutz",
        description:
          "Kit educativo y creativo de LEGO x Klutz para niños mayores de 8 años que incluye más de 20 piezas esenciales y un libro guía para diseñar y construir máquinas en movimiento con reacciones en cadena. Aprendizaje STEM divertido y desafiante.",
        price: 59900,
        image: "https://placehold.co/600x600/b09684/8b6f47?text=LEGO+Chain+Reactions",
        stock: 12,
      },
      {
        name: "The Grinch Christmas Adventures Nintendo Switch",
        description:
          "Videojuego navideño basado en el famoso personaje El Grinch. Vive aventuras llenas de humor y espíritu navideño en este juego apto para toda la familia. Compatible con Nintendo Switch. Clasificación (Everyone).",
        price: 99900,
        image: "https://placehold.co/600x600/b09684/8b6f47?text=The+Grinch+Switch",
        stock: 8,
      },
      {
        name: "Mr. Bubble Extra Gentle Bubble Bath",
        description:
          "El baño de burbujas #1 para niños de Mr. Bubble en fórmula extra suave, sin fragancia, libre de lágrimas e hipoalergénica, ideal para pieles sensibles. 473ml / 16oz.",
        price: 78900,
        image: "https://placehold.co/600x600/b09684/8b6f47?text=Mr.+Bubble+Bath",
        stock: 18,
      },
      {
        name: "Stainless Steel Wine Shower Funnel & Sediment Strainer",
        description:
          "Accesorio de acero inoxidable diseñado para servir el vino de forma elegante y filtrar los sedimentos naturales de la botella. Mejora la aireación del vino al verterlo, realzando su sabor y aroma. Ideal para amantes del vino.",
        price: 59900,
        image: "https://placehold.co/600x600/b09684/8b6f47?text=Wine+Funnel+Strainer",
        stock: 10,
      },
      {
        name: "Soporte Magnético de Carga Inalámbrica Scosche MagicMount Pro Qi",
        description:
          "Optimiza tu experiencia de conducción con este soporte magnético de alta calidad que combina la comodidad de un montaje seguro con la eficiencia de la carga inalámbrica Qi.",
        price: 149900,
        image: "https://placehold.co/600x600/b09684/8b6f47?text=Scosche+MagicMount",
        stock: 12,
      },
    ],
  });

  const total = await prisma.product.count();
  console.log(`✅ Seed completado: ${total} productos cargados.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
