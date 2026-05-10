import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const pStyle: React.CSSProperties = {
  color: "#4A4F45",
  fontSize: "1rem",
  lineHeight: 1.7,
  margin: "0 0 1.25rem",
};

const h2Style: React.CSSProperties = {
  fontFamily: "var(--font-fraunces), Georgia, serif",
  fontSize: "clamp(1.4rem, 3vw, 1.85rem)",
  fontWeight: 500,
  color: "#4A5D3A",
  letterSpacing: "-0.02em",
  margin: "2.5rem 0 1rem",
  lineHeight: 1.2,
};

const h3Style: React.CSSProperties = {
  fontFamily: "var(--font-fraunces), Georgia, serif",
  fontSize: "1.15rem",
  fontWeight: 500,
  color: "#4A5D3A",
  margin: "1.75rem 0 0.75rem",
  lineHeight: 1.3,
};

const listStyle: React.CSSProperties = {
  color: "#4A4F45",
  fontSize: "1rem",
  lineHeight: 1.7,
  margin: "0 0 1.25rem",
  paddingLeft: "1.25rem",
};

const calloutStyle: React.CSSProperties = {
  background: "#FDFAF3",
  border: "1px solid #EDE3CD",
  borderLeft: "4px solid #C97B5C",
  borderRadius: 12,
  padding: "1rem 1.25rem",
  margin: "1.5rem 0",
  color: "#4A4F45",
  fontSize: "0.95rem",
  lineHeight: 1.6,
};

const ctaButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.95rem 1.75rem",
  background: "#4A5D3A",
  color: "#F7F1E5",
  borderRadius: 100,
  textDecoration: "none",
  fontSize: "0.95rem",
  fontWeight: 500,
};

const finalCtaStyle: React.CSSProperties = {
  background: "#EDE3CD",
  borderRadius: 20,
  padding: "2rem 1.5rem",
  margin: "2.5rem 0 1.5rem",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS_CONTENT[slug];
  if (!post) {
    return { title: "Artículo no encontrado · Infinity Global Shop" };
  }
  return {
    title: `${post.title} · Infinity Global Shop`,
    description: post.description,
    alternates: { canonical: `https://www.infinityglobalshop.com/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.infinityglobalshop.com/blog/${slug}`,
      type: "article",
      locale: "es_CO",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS_CONTENT[slug];

  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: "#F7F1E5",
        minHeight: "100vh",
        fontFamily: "var(--font-dm-sans), Inter, sans-serif",
        paddingBottom: "4rem",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2.5rem 1.5rem 1rem" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: "0.8rem", color: "#4A4F45", opacity: 0.7, marginBottom: "1.5rem" }}>
          <Link href="/" style={{ color: "#4A5D3A", textDecoration: "none" }}>
            Inicio
          </Link>
          {" › "}
          <Link href="/blog" style={{ color: "#4A5D3A", textDecoration: "none" }}>
            Blog
          </Link>
          {" › "}
          <span>{post.title}</span>
        </div>

        {/* Header del artículo */}
        <header style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: CATEGORY_COLORS[post.category] || "#4A5D3A",
                background: `${CATEGORY_COLORS[post.category]}15`,
                padding: "0.25rem 0.7rem",
                borderRadius: 100,
              }}
            >
              {post.category}
            </span>
            <span style={{ fontSize: "0.78rem", color: "#4A4F45", opacity: 0.65 }}>
              {post.readTime} de lectura · {formattedDate}
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(1.85rem, 4.5vw, 2.6rem)",
              color: "#4A5D3A",
              fontWeight: 400,
              margin: "0 0 0.5rem",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            {post.title}
          </h1>
        </header>

        {/* Contenido del artículo */}
        <article style={{ fontSize: "1rem", lineHeight: 1.7, color: "#4A4F45" }}>
          {post.content}
        </article>

        {/* Volver al blog */}
        <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(74, 93, 58, 0.12)" }}>
          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#4A5D3A",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            ← Volver al blog
          </Link>
        </div>
      </div>
    </div>
  );
}


// Mapa de contenido de artículos.
// Para agregar un artículo nuevo: añade una entrada aquí + entrada en app/blog/page.tsx (posts[]).
const POSTS_CONTENT: Record<
  string,
  {
    title: string;
    description: string;
    category: string;
    readTime: string;
    date: string;
    emoji: string;
    content: React.ReactNode;
  }
> = {
  "devrom-en-colombia": {
    title: "Devrom en Colombia: la guía completa para encontrarlo original",
    description:
      "Si buscas Devrom y descubriste que nadie lo tiene en Colombia, te explicamos qué es, para quién funciona, cómo se toma y dónde comprarlo original con entrega 24h en Medellín.",
    category: "Salud",
    readTime: "8 min",
    date: "2026-05-09",
    emoji: "🌿",
    content: (
      <>
        <p style={pStyle}>
          <strong>Si llegaste a este artículo es porque buscaste &ldquo;Devrom en Colombia&rdquo; en Google. Y probablemente estás frustrada o frustrado: nadie lo tiene, las farmacias no lo conocen, y en Amazon te cobran 60 dólares más envío de tres semanas. Te entiendo. Vamos a resolverlo.</strong>
        </p>
        <p style={pStyle}>
          En Infinity Global Shop importamos Devrom directamente desde Estados Unidos y lo entregamos en Medellín en 24 horas. Pero antes de que compres, quiero explicarte exactamente qué es, para quién funciona, cómo se usa y por qué este producto es tan poco conocido en el mercado colombiano. Es un texto largo pero te va a ahorrar dudas, plata y tiempo.
        </p>

        <h2 style={h2Style}>¿Qué es Devrom?</h2>
        <p style={pStyle}>
          Devrom es un <strong>desodorante interno en tabletas masticables</strong> fabricado por la empresa estadounidense Parthenon Co. Su ingrediente activo es <strong>subgalato de bismuto a 200 mg por tableta</strong>, un compuesto que neutraliza los olores del intestino antes de que salgan del cuerpo.
        </p>
        <p style={pStyle}>
          Para entenderlo en términos simples: <strong>no trata el problema digestivo, controla el olor</strong>. Funciona en el tracto digestivo bajo y reduce los compuestos sulfurosos responsables del mal olor de las heces y los gases.
        </p>
        <p style={pStyle}>
          Es un producto <strong>de venta libre en Estados Unidos</strong> (no requiere fórmula médica), aprobado por la FDA bajo la monografía oficial de subgalato de bismuto. Se vende en tabletas masticables con sabor a vainilla suave para hacerlas fáciles de tomar.
        </p>

        <h2 style={h2Style}>¿Para quién es Devrom?</h2>
        <p style={pStyle}>
          Aquí es donde la mayoría de páginas se queda corta. Devrom no es un producto para &ldquo;cualquiera con gases ocasionales&rdquo;. Está diseñado para personas con condiciones específicas donde el olor es un problema serio que afecta la calidad de vida y la confianza social.
        </p>
        <p style={pStyle}>Las personas que más lo usan en Estados Unidos son:</p>

        <h3 style={h3Style}>1. Pacientes con ostomía (colostomía o ileostomía)</h3>
        <p style={pStyle}>
          Son personas que, por cirugía, tienen una bolsa externa para recolectar heces. El olor es una de las preocupaciones más grandes y limitantes socialmente. Devrom fue creado originalmente para este grupo y sigue siendo el estándar mundial de manejo del olor en pacientes ostomizados.
        </p>

        <h3 style={h3Style}>2. Pacientes post cirugía bariátrica</h3>
        <p style={pStyle}>
          Después de bypass gástrico o manga gástrica, muchos pacientes desarrollan flatulencia con olor fuerte por la malabsorción de grasas y los cambios en la flora intestinal. Devrom es de los pocos productos seguros y bien estudiados para este grupo.
        </p>

        <h3 style={h3Style}>3. Personas con incontinencia fecal</h3>
        <p style={pStyle}>
          Adultos mayores o pacientes con condiciones neurológicas pueden tener pérdidas involuntarias. Reducir el olor mejora la dignidad, la vida social y reduce el aislamiento.
        </p>

        <h3 style={h3Style}>4. Síndrome de intestino irritable (SII) severo</h3>
        <p style={pStyle}>
          Algunas personas con SII tipo diarrea o gases crónicos lo usan como apoyo cuando los tratamientos digestivos no son suficientes para manejar el olor que les genera ansiedad social.
        </p>

        <h3 style={h3Style}>5. Personas con flatulencia crónica con olor severo</h3>
        <p style={pStyle}>
          Hay personas que, sin tener una condición diagnosticada, sufren de gases con olor extremo que les afecta socialmente. Para ellas, Devrom puede ser una solución mientras encuentran la causa de fondo.
        </p>

        <div style={calloutStyle}>
          <strong>Importante:</strong> si tienes problemas digestivos persistentes, lo primero es ver a un gastroenterólogo. Devrom maneja el síntoma del olor, no la causa. Si nunca te han evaluado, agenda una cita antes de auto-medicarte.
        </div>

        <h2 style={h2Style}>¿Cómo funciona Devrom?</h2>
        <p style={pStyle}>El subgalato de bismuto actúa de tres formas principales en el intestino:</p>
        <ol style={listStyle}>
          <li>Se une a los compuestos de azufre que son los principales responsables del mal olor.</li>
          <li>Tiene un efecto leve sobre las bacterias productoras de olor.</li>
          <li>Forma un complejo que se elimina con las heces sin ser absorbido sistémicamente en cantidades significativas, lo que lo hace seguro para uso prolongado en la mayoría de personas.</li>
        </ol>
        <p style={pStyle}>
          Lo importante: <strong>no detiene los gases ni las heces</strong>. Solo reduce el olor. No es laxante, no es antidiarreico, no es supresor de gases. Es exclusivamente un desodorizante.
        </p>

        <h2 style={h2Style}>¿Cómo se toma Devrom?</h2>
        <p style={pStyle}>
          Según el etiquetado oficial del fabricante, la dosis usual es <strong>una a dos tabletas masticables, tres a cuatro veces al día</strong>, con las comidas. Las tabletas se mastican (no se tragan enteras) y tienen un sabor a vainilla.
        </p>
        <p style={pStyle}>
          El frasco original que importamos trae <strong>100 tabletas masticables de 200 mg</strong>, lo que generalmente alcanza para entre 12 y 25 días de uso continuo, dependiendo de la dosis que necesites.
        </p>
        <p style={pStyle}>
          <strong>Cuánto tarda en hacer efecto:</strong> la mayoría de personas notan diferencia entre el primer y tercer día de uso constante.
        </p>
        <div style={calloutStyle}>
          <strong>Disclaimer médico:</strong> esta información es educativa y proviene del etiquetado del fabricante. La dosis específica para tu caso debe definirla tu médico, especialmente si estás bajo otros tratamientos.
        </div>

        <h2 style={h2Style}>Efectos secundarios y advertencias</h2>
        <p style={pStyle}>
          Devrom es generalmente bien tolerado, pero tiene dos efectos visuales que asustan a la gente la primera vez y que son <strong>completamente normales y temporales</strong>:
        </p>
        <ul style={listStyle}>
          <li><strong>Las heces pueden volverse más oscuras (negras o grisáceas).</strong> Esto ocurre por la reacción del bismuto con el azufre y desaparece al suspender el producto.</li>
          <li><strong>La lengua puede oscurecerse temporalmente.</strong> Mismo mecanismo, mismo desenlace.</li>
        </ul>
        <p style={pStyle}>
          Ambos efectos son cosméticos. No es sangrado, no es daño, no es peligroso. Pero si nunca lo sabes, te puedes asustar mucho la primera vez.
        </p>
        <p style={pStyle}><strong>Cuándo NO usar Devrom sin consultar primero:</strong></p>
        <ul style={listStyle}>
          <li>Embarazo y lactancia.</li>
          <li>Alergia conocida al bismuto o a los salicilatos.</li>
          <li>Insuficiencia renal severa.</li>
          <li>Niños menores de 12 años sin supervisión médica.</li>
        </ul>
        <p style={pStyle}>
          Si tomas anticoagulantes, medicamentos para gota, antibióticos como tetraciclinas, o tienes condiciones renales, <strong>habla con tu médico antes de empezar</strong>. El bismuto puede interactuar con algunos fármacos.
        </p>

        <h2 style={h2Style}>¿Por qué Devrom no se consigue en farmacias colombianas?</h2>
        <p style={pStyle}>Hay tres razones que se combinan:</p>

        <h3 style={h3Style}>1. No tiene registro INVIMA propio</h3>
        <p style={pStyle}>
          Las farmacias en cadena no traen productos sin registro local porque no pueden venderlos en sus tiendas físicas. Por eso no lo vas a encontrar en La Rebaja, Cruz Verde, Cafam, Colsubsidio ni Pasteur.
        </p>

        <h3 style={h3Style}>2. El mercado parece &ldquo;pequeño&rdquo; desde afuera</h3>
        <p style={pStyle}>
          Las cadenas farmacéuticas evalúan productos por volumen masivo. Devrom es un producto de nicho — no vende como un Tylenol — y por eso no entra en sus catálogos. Pero para las personas que lo necesitan, no hay sustituto.
        </p>

        <h3 style={h3Style}>3. La traída uno por uno es costosa</h3>
        <p style={pStyle}>
          Importar un frasco a la vez por Amazon o eBay sale a 200.000 a 280.000 pesos con envío y demoras de 2 a 4 semanas, además del riesgo de que se quede en aduana o se pierda.
        </p>
        <p style={pStyle}>
          Por eso lo importamos en lotes y lo mantenemos disponible localmente, listo para entregarte en 24 horas.
        </p>

        <h2 style={h2Style}>¿Dónde comprar Devrom original en Colombia?</h2>
        <p style={pStyle}>
          En <strong>Infinity Global Shop</strong> lo tenemos disponible permanentemente:
        </p>
        <ul style={listStyle}>
          <li><strong>Precio:</strong> $165.900 COP (frasco de 100 tabletas masticables, 200 mg).</li>
          <li><strong>Origen:</strong> comprado directamente en cadenas oficiales de Estados Unidos.</li>
          <li><strong>Envío:</strong> 24 horas en el área metropolitana de Medellín. Envíos a otras ciudades por WhatsApp.</li>
          <li><strong>Garantía:</strong> producto sellado, con fecha de vencimiento vigente. Si llega dañado o no es lo que esperabas, te lo cambiamos.</li>
        </ul>
        <div style={{ textAlign: "center", margin: "2rem 0" }}>
          <Link
            href="/products/devrom-desodorante-interno-200mg-100-tabletas-masticables-anti-olor"
            style={ctaButtonStyle}
          >
            Ver Devrom en la tienda →
          </Link>
        </div>

        <h2 style={h2Style}>Preguntas frecuentes</h2>

        <h3 style={h3Style}>¿Es seguro tomar Devrom todos los días por meses?</h3>
        <p style={pStyle}>
          En Estados Unidos se prescribe para uso continuo en pacientes con ostomía. Para uso prolongado de más de 6 meses, siempre habla con tu médico tratante.
        </p>

        <h3 style={h3Style}>¿Devrom me va a quitar el problema digestivo de fondo?</h3>
        <p style={pStyle}>
          No. Maneja solo el olor. Si tienes diarrea crónica, gases por intolerancia alimentaria o cualquier síntoma persistente, necesitas evaluación médica para encontrar la causa.
        </p>

        <h3 style={h3Style}>¿Cuánto me dura un frasco?</h3>
        <p style={pStyle}>
          Entre 12 y 25 días de uso continuo, dependiendo de tu dosis. La mayoría de pacientes con ostomía usan un frasco al mes.
        </p>

        <h3 style={h3Style}>¿Lo puede tomar mi mamá que tiene más de 70 años?</h3>
        <p style={pStyle}>
          Generalmente sí, pero si toma medicamentos crónicos o tiene problemas renales, consulta primero con su médico tratante.
        </p>

        <h3 style={h3Style}>¿Tienen el frasco grande de 200 tabletas?</h3>
        <p style={pStyle}>
          Por ahora manejamos solo el de 100. Si necesitas el grande, escríbenos por WhatsApp y lo conseguimos en el siguiente pedido.
        </p>

        <h3 style={h3Style}>¿Lo envían a otras ciudades fuera de Medellín?</h3>
        <p style={pStyle}>
          Sí, escríbenos por WhatsApp y coordinamos envío nacional con Servientrega o Coordinadora.
        </p>

        <div style={finalCtaStyle}>
          <p style={{ ...pStyle, margin: "0 0 1rem", textAlign: "center" }}>
            <strong>Si llegaste hasta aquí, ya sabes más sobre Devrom que el 99% de personas en Colombia.</strong> Lo siguiente es decidir si es para ti. Si tienes dudas específicas sobre tu caso, escríbenos por WhatsApp y te respondemos personalmente, sin compromiso.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <a
              href="https://wa.me/573054223600?text=Hola%21%20Tengo%20preguntas%20sobre%20Devrom"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...ctaButtonStyle, background: "#25D366" }}
            >
              💬 Escribir por WhatsApp
            </a>
            <Link
              href="/products/devrom-desodorante-interno-200mg-100-tabletas-masticables-anti-olor"
              style={ctaButtonStyle}
            >
              🛒 Comprar Devrom
            </Link>
          </div>
        </div>

        <p style={{ ...pStyle, fontSize: "0.8rem", opacity: 0.65, marginTop: "2rem", textAlign: "center" }}>
          <em>Última actualización: mayo 2026. Información educativa basada en el etiquetado oficial del fabricante. No reemplaza la consulta médica.</em>
        </p>
      </>
    ),
  },

  "biotina-para-cabello-dosis-beneficios": {
    title: "Biotina para el cabello: dosis, beneficios y cuál comprar en Colombia",
    description: "La biotina es el suplemento #1 para el crecimiento del cabello. Te explicamos qué dosis necesitas, cuándo ver resultados y cuál es la mejor opción disponible en Medellín.",
    category: "Vitaminas",
    readTime: "5 min",
    date: "2026-04-15",
    emoji: "💊",
    content: (
      <>
        <p style={pStyle}>
          <strong>La biotina es el suplemento más vendido del mundo para el crecimiento del cabello. Pero hay mucha desinformación: que si funciona, que si no funciona, que cuánto tomar, que cuándo ver resultados. Vamos a aclarar todo.</strong>
        </p>
        <p style={pStyle}>
          La biotina (también llamada vitamina B7 o vitamina H) es una vitamina del complejo B que tu cuerpo usa para producir queratina, la proteína que forma tu cabello, uñas y piel. Cuando hay deficiencia de biotina, el cabello se debilita, se cae más de lo normal y crece más lento.
        </p>

        <h2 style={h2Style}>¿Cuánta biotina necesitas?</h2>
        <p style={pStyle}>
          La dosis diaria recomendada para un adulto sano es de <strong>30 mcg al día</strong>. Pero los suplementos para crecimiento capilar van mucho más allá: las dosis comerciales empiezan en 1,000 mcg y llegan hasta 10,000 mcg.
        </p>
        <p style={pStyle}>
          <strong>¿Por qué tanto?</strong> Porque la biotina es soluble en agua: lo que tu cuerpo no usa, lo eliminas por la orina. No se acumula. Por eso los dermatólogos recomiendan dosis altas cuando hay caída del cabello significativa.
        </p>

        <h3 style={h3Style}>Guía rápida de dosis:</h3>
        <p style={pStyle}>
          <strong>1,000 mcg al día:</strong> mantenimiento. Si tu cabello está sano y solo quieres prevenir.<br />
          <strong>5,000 mcg al día:</strong> dosis estándar para crecimiento moderado.<br />
          <strong>10,000 mcg al día:</strong> dosis terapéutica. Para caída notoria, postparto, alopecia leve o estrés crónico.
        </p>

        <h2 style={h2Style}>¿Cuándo se ven los resultados?</h2>
        <p style={pStyle}>
          Aquí es donde la gente se desespera. La biotina <strong>no funciona en una semana</strong>. El cabello crece aproximadamente 1 cm por mes, y los folículos capilares necesitan tiempo para fortalecerse desde la raíz.
        </p>
        <p style={pStyle}>
          <strong>Mes 1:</strong> empiezas a notar menos caída en el cepillo.<br />
          <strong>Mes 2-3:</strong> aparecen pelitos nuevos en la línea del cabello (baby hairs).<br />
          <strong>Mes 4-6:</strong> cabello visiblemente más grueso, brillante y con menos quiebre.<br />
          <strong>Mes 6+:</strong> resultado completo. El cabello que crece ahora es 100% nuevo y nutrido con biotina.
        </p>

        <h2 style={h2Style}>¿Qué marca comprar?</h2>
        <p style={pStyle}>
          En Estados Unidos las dos marcas dominantes son <strong>Nature&rsquo;s Bounty</strong> y <strong>Spring Valley</strong>. Las dos son originales, certificadas, y mucho más baratas que las marcas premium europeas.
        </p>
        <p style={pStyle}>
          <strong>Nature&rsquo;s Bounty Biotina 1,000 mcg:</strong> 110 gomitas veganas. Ideal para mantenimiento o si nunca has tomado biotina.
        </p>
        <p style={pStyle}>
          <strong>Spring Valley Biotina 10,000 mcg:</strong> 90 gomitas o 100 tabletas. La dosis terapéutica para casos de caída del cabello, alopecia postparto o estrés.
        </p>

        <h2 style={h2Style}>Importante: la prueba de tiroides</h2>
        <p style={pStyle}>
          Si te haces exámenes de sangre periódicos, especialmente de tiroides (TSH, T3, T4), <strong>suspende la biotina 3 días antes</strong>. Las dosis altas pueden alterar los resultados de los kits de laboratorio. Esto no significa que sea peligrosa, solo que interfiere con la prueba.
        </p>

        <h2 style={h2Style}>Comprar biotina en Medellín</h2>
        <p style={pStyle}>
          En Infinity Global Shop tenemos biotina <strong>importada original de USA</strong> con entrega en 24 horas en Medellín y a toda Colombia. Frascos sellados, fecha de vencimiento vigente y 100% auténticos.
        </p>
      </>
    ),
  },
  "omega-3-6-9-diferencias-para-que-sirve": {
    title: "Omega 3, 6 y 9: diferencias, para qué sirve cada uno y cómo tomarlos",
    description: "No todos los Omega son iguales. Descubre qué hace cada uno, cuál necesitas según tu estilo de vida y por qué el Triple Omega de Spring Valley es tan popular en Colombia.",
    category: "Vitaminas",
    readTime: "6 min",
    date: "2026-04-20",
    emoji: "🐟",
    content: (
      <>
        <p style={pStyle}>
          <strong>Cuando escuchas &ldquo;Omega 3&rdquo; piensas inmediatamente en aceite de pescado y salud cardiovascular. Pero existen Omega 6 y Omega 9, y los tres tienen funciones distintas en tu cuerpo. Vamos a aclararlo.</strong>
        </p>

        <h2 style={h2Style}>¿Qué son los Omega?</h2>
        <p style={pStyle}>
          Los Omega son <strong>ácidos grasos esenciales</strong>: tu cuerpo los necesita para funcionar pero no los produce solo. Tienes que obtenerlos de la dieta o de un suplemento. Son la materia prima de las membranas celulares, las hormonas inflamatorias y la función cerebral.
        </p>

        <h2 style={h2Style}>Omega 3: el más famoso (y el más importante)</h2>
        <p style={pStyle}>
          Se obtiene principalmente del aceite de pescado (sardina, salmón, anchoa). Sus dos componentes activos son <strong>EPA y DHA</strong>.
        </p>
        <p style={pStyle}>
          <strong>Para qué sirve:</strong> reduce triglicéridos, baja la presión arterial, es antiinflamatorio sistémico, mejora la función cerebral y la memoria, y protege el corazón.
        </p>
        <p style={pStyle}>
          <strong>Quién lo necesita:</strong> básicamente todo el mundo mayor de 30 años. Especialmente personas con colesterol alto, deportistas, y quienes no comen pescado mínimo 2 veces por semana.
        </p>

        <h2 style={h2Style}>Omega 6: el que sí o sí debes vigilar</h2>
        <p style={pStyle}>
          Se obtiene del aceite de borraja, onagra y algunos aceites vegetales. Su componente activo es el <strong>ácido gamma-linolénico (GLA)</strong>.
        </p>
        <p style={pStyle}>
          <strong>Para qué sirve:</strong> apoya el equilibrio hormonal femenino (clave para mujeres con síndrome premenstrual o premenopausia), salud de la piel (eczema, dermatitis, acné hormonal) y es antiinflamatorio.
        </p>
        <p style={pStyle}>
          <strong>Cuidado:</strong> los aceites vegetales refinados (girasol, maíz, soya) son ricos en Omega 6 pero en su forma proinflamatoria. El Omega 6 de un buen suplemento (aceite de borraja) es lo opuesto: antiinflamatorio.
        </p>

        <h2 style={h2Style}>Omega 9: el menos esencial pero útil</h2>
        <p style={pStyle}>
          Se obtiene del aceite de oliva, aguacate y linaza. Su componente activo es el <strong>ácido oleico</strong>.
        </p>
        <p style={pStyle}>
          <strong>Para qué sirve:</strong> sube el colesterol bueno (HDL), apoya la energía celular, protege contra el daño oxidativo.
        </p>
        <p style={pStyle}>
          <strong>Dato:</strong> el Omega 9 técnicamente NO es esencial porque tu cuerpo puede producirlo. Pero un aporte extra de fuentes saludables es siempre bienvenido.
        </p>

        <h2 style={h2Style}>¿Triple Omega o Omega 3 solo?</h2>
        <p style={pStyle}>
          Si solo vas a tomar UN suplemento, que sea <strong>Omega 3 puro</strong>. Es el más estudiado y el más impactante.
        </p>
        <p style={pStyle}>
          Pero si quieres la fórmula completa por un costo similar, el <strong>Triple Omega 3-6-9 de Spring Valley</strong> te da las tres formas en una sola cápsula. Es la opción más popular en Estados Unidos por relación calidad-precio.
        </p>

        <h2 style={h2Style}>Cómo tomarlo correctamente</h2>
        <p style={pStyle}>
          <strong>Con comida:</strong> los Omega son grasas, se absorben mejor con una comida que tenga algo de grasa.<br />
          <strong>Mejor en el almuerzo:</strong> evita tomarlo en la noche si te genera reflujo.<br />
          <strong>Constancia:</strong> los efectos cardiovasculares se ven después de 8-12 semanas de uso continuo.
        </p>

        <h2 style={h2Style}>Comprar Omega original en Colombia</h2>
        <p style={pStyle}>
          En Infinity Global Shop tenemos el <strong>Spring Valley Triple Omega 3-6-9</strong> en presentación de 120 softgels (4 meses de tratamiento) importado original de USA. Entrega 24h en Medellín.
        </p>
      </>
    ),
  },
  "melatonina-5mg-vs-10mg-cual-elegir": {
    title: "Melatonina 5mg vs 10mg: ¿cuál elegir para dormir mejor?",
    description: "Más no siempre es mejor. Te explicamos la diferencia entre las dosis de melatonina, cómo tomarla correctamente y por qué los médicos recomiendan empezar con la dosis más baja.",
    category: "Salud",
    readTime: "4 min",
    date: "2026-04-25",
    emoji: "🌙",
    content: (
      <>
        <p style={pStyle}>
          <strong>Si llevas semanas sin dormir bien, probablemente alguien te recomendó melatonina. Pero al buscar te encontraste con dosis de 1mg, 3mg, 5mg, 10mg... ¿cuál escoger? Te explico.</strong>
        </p>

        <h2 style={h2Style}>¿Qué es la melatonina?</h2>
        <p style={pStyle}>
          La melatonina es <strong>la hormona del sueño</strong>. Tu cerebro la produce naturalmente cuando oscurece, y es la señal que le dice a tu cuerpo &ldquo;es hora de dormir&rdquo;. Con la luz del celular, el estrés, los horarios irregulares y la edad, esa producción disminuye.
        </p>
        <p style={pStyle}>
          Tomar melatonina <strong>NO es como tomar un sedante</strong>. No te &ldquo;noquea&rdquo; ni te deja resaca. Solo le da a tu cuerpo la señal que ya no produce bien.
        </p>

        <h2 style={h2Style}>Las dosis comunes</h2>
        <p style={pStyle}>
          <strong>0.5 mg - 1 mg:</strong> dosis fisiológica. Es lo que tu cuerpo produciría naturalmente. Estudios recientes sugieren que esta es la dosis óptima para la mayoría de personas.
        </p>
        <p style={pStyle}>
          <strong>3 mg - 5 mg:</strong> dosis estándar. Es la más vendida en Estados Unidos. Funciona bien para insomnio ocasional, jet lag y ajuste de horarios.
        </p>
        <p style={pStyle}>
          <strong>10 mg:</strong> dosis alta. Para insomnio crónico, trabajo nocturno, o personas que ya probaron las dosis bajas y no les hicieron efecto.
        </p>

        <h2 style={h2Style}>Más NO es mejor</h2>
        <p style={pStyle}>
          Aquí está el dato que pocos conocen: <strong>dosis altas de melatonina pueden ser contraproducentes</strong>. Tu cuerpo reduce su producción natural cuando recibe mucha externa, y se vuelve menos sensible a la hormona con el tiempo.
        </p>
        <p style={pStyle}>
          Los médicos especialistas en sueño recomiendan <strong>empezar con la dosis más baja que te funcione</strong>. Si 1 mg te hace dormir bien, no subas a 5 mg.
        </p>

        <h2 style={h2Style}>¿Cuándo elegir 10 mg?</h2>
        <p style={pStyle}>
          La dosis de 10 mg está justificada cuando:
        </p>
        <p style={pStyle}>
          - Ya probaste 3-5 mg y no funcionaron<br />
          - Tienes insomnio crónico (más de 3 meses)<br />
          - Cambias de turno de trabajo (día/noche)<br />
          - Tienes jet lag fuerte (más de 6 horas de diferencia)<br />
          - Eres mayor de 60 años (la producción natural baja con la edad)
        </p>

        <h2 style={h2Style}>Cómo tomarla correctamente</h2>
        <p style={pStyle}>
          <strong>30 a 60 minutos antes de dormir.</strong> Si la tomas justo al acostarte, no te dará tiempo de hacer efecto.
        </p>
        <p style={pStyle}>
          <strong>Sin pantallas después de tomarla.</strong> La luz azul del celular bloquea la melatonina natural y reduce el efecto del suplemento.
        </p>
        <p style={pStyle}>
          <strong>Máximo 5 noches por semana.</strong> Para que tu cuerpo no &ldquo;olvide&rdquo; producirla solo, deja descansos.
        </p>

        <h2 style={h2Style}>Comprar melatonina en Colombia</h2>
        <p style={pStyle}>
          En Infinity Global Shop tenemos la <strong>Nature&rsquo;s Bounty Melatonina 10 mg</strong> en gomitas sabor fresa, presentación de 140 unidades (4-5 meses de tratamiento). Importada original de USA.
        </p>
        <p style={pStyle}>
          Si prefieres una dosis menor, podemos pedir presentaciones de 3 mg y 5 mg también. Escríbenos por WhatsApp.
        </p>
      </>
    ),
  },
  "vitaminas-para-huesos-calcio-magnesio-vitamina-d": {
    title: "Vitaminas para huesos fuertes: calcio, magnesio y vitamina D explicados",
    description: "El calcio solo no es suficiente. Descubre por qué necesitas magnesio y vitamina D para absorberlo correctamente, y cuál es el mejor suplemento para la salud ósea en Colombia.",
    category: "Vitaminas",
    readTime: "5 min",
    date: "2026-05-01",
    emoji: "🦴",
    content: (
      <>
        <p style={pStyle}>
          <strong>El mito más común sobre la salud ósea: &ldquo;tomo calcio, así que mis huesos están bien&rdquo;. La realidad es que el calcio solo, sin magnesio y vitamina D, casi NO se absorbe. Te explico por qué y qué hacer.</strong>
        </p>

        <h2 style={h2Style}>El trío que tu cuerpo necesita</h2>
        <p style={pStyle}>
          La salud ósea no depende de un solo nutriente. Es un equipo de tres trabajando juntos:
        </p>
        <p style={pStyle}>
          <strong>Calcio:</strong> es el ladrillo. Forma la estructura del hueso.<br />
          <strong>Vitamina D3:</strong> es el camión que lleva el ladrillo. Sin D3, el calcio no entra al hueso.<br />
          <strong>Magnesio:</strong> es el cemento. Activa la vitamina D y ayuda a fijar el calcio.
        </p>
        <p style={pStyle}>
          Si tomas solo calcio, es como pedir ladrillos sin camión ni cemento. La construcción no avanza.
        </p>

        <h2 style={h2Style}>¿Cuánto necesitas?</h2>
        <p style={pStyle}>
          <strong>Calcio:</strong> 1,000 mg al día (1,200 mg si tienes más de 50 años o estás en menopausia).<br />
          <strong>Vitamina D3:</strong> 1,000 a 4,000 UI al día.<br />
          <strong>Magnesio:</strong> 300 a 400 mg al día.
        </p>

        <h2 style={h2Style}>¿Por qué la mujer adulta es la más afectada?</h2>
        <p style={pStyle}>
          La densidad ósea empieza a bajar a partir de los 30 años en mujeres. En la menopausia, la caída se acelera por la reducción de estrógenos. <strong>1 de cada 3 mujeres mayores de 50 años desarrolla osteoporosis</strong>.
        </p>
        <p style={pStyle}>
          La buena noticia: con suplementación adecuada y ejercicio de fuerza, se puede prevenir e incluso revertir la pérdida ósea temprana.
        </p>

        <h2 style={h2Style}>Señales de deficiencia</h2>
        <p style={pStyle}>
          - Calambres musculares frecuentes (deficiencia de magnesio)<br />
          - Uñas frágiles que se quiebran (deficiencia de calcio)<br />
          - Cansancio crónico, dolor de espalda baja (deficiencia de D3)<br />
          - Caries frecuentes a pesar de buena higiene<br />
          - Espasmos en los párpados (magnesio)<br />
          - Dolor articular en mañanas<br />
        </p>

        <h2 style={h2Style}>¿Qué suplemento elegir?</h2>
        <p style={pStyle}>
          Tienes dos opciones:
        </p>
        <p style={pStyle}>
          <strong>Opción 1 - Suplemento triple en uno:</strong> Spring Valley Calcio + Magnesio + Zinc. Te da los tres nutrientes en una sola tableta. Ideal si quieres simplificar.
        </p>
        <p style={pStyle}>
          <strong>Opción 2 - Por separado:</strong> Vitafusion Calcio + Vitamina D3 (en gomitas) más Spring Valley Magnesio Glicinato (alta absorción). Ideal si tienes deficiencias específicas o quieres dosis personalizadas.
        </p>

        <h2 style={h2Style}>Tip que pocos conocen</h2>
        <p style={pStyle}>
          <strong>Toma el calcio en el ALMUERZO, no en la noche</strong>. Tu cuerpo absorbe mejor el calcio cuando hay actividad física en las horas siguientes. Si lo tomas antes de dormir, parte se elimina sin absorberse.
        </p>
        <p style={pStyle}>
          El magnesio sí es ideal en la noche: ayuda a relajar músculos y mejorar el sueño.
        </p>

        <h2 style={h2Style}>Comprar en Medellín</h2>
        <p style={pStyle}>
          En Infinity Global Shop tenemos los suplementos óseos más vendidos de USA: Vitafusion Calcio + D3, Spring Valley Calcio Magnesio Zinc, y Spring Valley Magnesio Glicinato. Todos importados originales con entrega 24h.
        </p>
      </>
    ),
  },
  "productos-belleza-importados-usa-colombia": {
    title: "Los mejores productos de belleza importados de USA disponibles en Colombia",
    description: "Desde e.l.f. Cosmetics hasta Dove Men+Care — te mostramos los productos de belleza estadounidenses más valorados que ya puedes comprar en Medellín con entrega en 24 horas.",
    category: "Belleza",
    readTime: "7 min",
    date: "2026-05-05",
    emoji: "✨",
    content: (
      <>
        <p style={pStyle}>
          <strong>El mercado de belleza en Estados Unidos es uno de los más innovadores del mundo. Productos virales en TikTok, marcas indie con cero químicos agresivos, fórmulas que no llegan a Colombia. Aquí te muestro los que ya puedes comprar en Medellín.</strong>
        </p>

        <h2 style={h2Style}>1. e.l.f. Cosmetics</h2>
        <p style={pStyle}>
          La marca #1 entre Gen Z en Estados Unidos. Maquillaje cruelty-free, vegano, formulado por dermatólogos y a precios mucho más bajos que las marcas tradicionales.
        </p>
        <p style={pStyle}>
          <strong>Producto estrella:</strong> el lápiz de cejas Instant Lift y el Monochromatic Multi-Stick (rubor + sombra + labial en uno). Son los productos que más se han vuelto virales en TikTok los últimos 2 años.
        </p>

        <h2 style={h2Style}>2. Bubble Skincare</h2>
        <p style={pStyle}>
          La marca de skincare más viral entre adolescentes y mileniales en USA. Filosofía de cuidado facial sin químicos agresivos, sin precios absurdos y con texturas que sí quieres usar todos los días.
        </p>
        <p style={pStyle}>
          <strong>Producto estrella:</strong> el Slam Dunk Hydrating Moisturizer. Hidratante facial ligero con ácido hialurónico y niacinamida. Perfecto para piel mixta y joven.
        </p>

        <h2 style={h2Style}>3. Burt&rsquo;s Bees Baby</h2>
        <p style={pStyle}>
          Para mamás que buscan productos naturales para sus bebés. 98% de ingredientes naturales, sin parabenos, sin sulfatos, dermatológicamente probada.
        </p>
        <p style={pStyle}>
          <strong>Producto estrella:</strong> el Calming Shampoo &amp; Body Wash con lavanda. El baño de la noche que ayuda a tu bebé a relajarse antes de dormir.
        </p>

        <h2 style={h2Style}>4. Africa&rsquo;s Best</h2>
        <p style={pStyle}>
          Marca especializada en cabello afro, rizado y texturizado. 35 años en el mercado estadounidense.
        </p>
        <p style={pStyle}>
          <strong>Productos estrella:</strong> el aceite de zanahoria y árbol de té (estimula crecimiento), la mascarilla profunda Olive &amp; Shea (repara cabello dañado), y la línea Kids Shea Butter Detangling para cabello infantil rizado.
        </p>

        <h2 style={h2Style}>5. ORS (Organic Root Stimulator)</h2>
        <p style={pStyle}>
          La marca de referencia mundial para cuidado de cabello rizado y afro. El leave-in con aceite de oliva es legendario.
        </p>
        <p style={pStyle}>
          <strong>Producto estrella:</strong> el Olive Oil Leave-In Conditioner. Define rizos sin endurecer, hidrata sin grasa.
        </p>

        <h2 style={h2Style}>6. One &lsquo;n Only</h2>
        <p style={pStyle}>
          Tratamientos capilares con aceite de argán a precios mucho más accesibles que las marcas de salón.
        </p>
        <p style={pStyle}>
          <strong>Producto estrella:</strong> el Argan Oil Treatment. Aceite capilar puro que funciona como protector térmico (hasta 230°C), reparador de puntas y dador de brillo.
        </p>

        <h2 style={h2Style}>7. Ambi</h2>
        <p style={pStyle}>
          Marca con más de 50 años especializada en aclarado y uniformidad del tono de piel. Recomendada por dermatólogos en USA.
        </p>
        <p style={pStyle}>
          <strong>Producto estrella:</strong> el Complexion Cleansing Bar. Jabón aclarador para manchas, melasma y zonas oscuras como axilas, codos y rodillas.
        </p>

        <h2 style={h2Style}>8. Dr. Teal&rsquo;s</h2>
        <p style={pStyle}>
          La marca #1 de baños terapéuticos en USA. Sales de Epsom con aromaterapia.
        </p>
        <p style={pStyle}>
          <strong>Producto estrella:</strong> Foaming Bath Soothe &amp; Sleep con lavanda. El baño que combina sales de Epsom (relajan músculos) con aceite de lavanda (favorece el sueño).
        </p>

        <h2 style={h2Style}>¿Por qué importar y no comprar local?</h2>
        <p style={pStyle}>
          Las marcas grandes que ves en Colombia (Loreal, Maybelline, Pantene) tienen fórmulas similares en todos los mercados. Pero las marcas de nicho - las indie, las cruelty-free, las especializadas - solo se distribuyen en países específicos.
        </p>
        <p style={pStyle}>
          En Estados Unidos hay miles de marcas pequeñas con productos increíbles que nunca llegan a Latinoamérica. Importar directamente es la única forma de acceder.
        </p>

        <h2 style={h2Style}>Comprar en Medellín</h2>
        <p style={pStyle}>
          Todos los productos mencionados están disponibles en Infinity Global Shop con entrega 24 horas en Medellín y a toda Colombia. Originales, sellados, fecha de vencimiento vigente.
        </p>
      </>
    ),
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Vitaminas: "#6B7B4F",
  Salud: "#C9533D",
  Belleza: "#C97B5C",
};

// Estilos compartidos
