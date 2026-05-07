import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog de Bienestar · Infinity Global Shop",
  description: "Guías, consejos y comparativas sobre vitaminas, suplementos y productos de belleza importados de USA. Todo lo que necesitas saber para cuidar tu salud en Colombia.",
  alternates: { canonical: "https://www.infinityglobalshop.com/blog" },
};

export const posts = [
  {
    slug: "biotina-para-cabello-dosis-beneficios",
    title: "Biotina para el cabello: dosis, beneficios y cuál comprar en Colombia",
    excerpt: "La biotina es el suplemento #1 para el crecimiento del cabello. Te explicamos qué dosis necesitas, cuándo ver resultados y cuál es la mejor opción disponible en Medellín.",
    category: "Vitaminas",
    readTime: "5 min",
    date: "2026-04-15",
    emoji: "💊",
  },
  {
    slug: "omega-3-6-9-diferencias-para-que-sirve",
    title: "Omega 3, 6 y 9: diferencias, para qué sirve cada uno y cómo tomarlos",
    excerpt: "No todos los Omega son iguales. Descubre qué hace cada uno, cuál necesitas según tu estilo de vida y por qué el Triple Omega de Spring Valley es tan popular en Colombia.",
    category: "Vitaminas",
    readTime: "6 min",
    date: "2026-04-20",
    emoji: "🐟",
  },
  {
    slug: "melatonina-5mg-vs-10mg-cual-elegir",
    title: "Melatonina 5mg vs 10mg: ¿cuál elegir para dormir mejor?",
    excerpt: "Más no siempre es mejor. Te explicamos la diferencia entre las dosis de melatonina, cómo tomarla correctamente y por qué los médicos recomiendan empezar con la dosis más baja.",
    category: "Salud",
    readTime: "4 min",
    date: "2026-04-25",
    emoji: "🌙",
  },
  {
    slug: "vitaminas-para-huesos-calcio-magnesio-vitamina-d",
    title: "Vitaminas para huesos fuertes: calcio, magnesio y vitamina D explicados",
    excerpt: "El calcio solo no es suficiente. Descubre por qué necesitas magnesio y vitamina D para absorberlo correctamente, y cuál es el mejor suplemento para la salud ósea en Colombia.",
    category: "Vitaminas",
    readTime: "5 min",
    date: "2026-05-01",
    emoji: "🦴",
  },
  {
    slug: "productos-belleza-importados-usa-colombia",
    title: "Los mejores productos de belleza importados de USA disponibles en Colombia",
    excerpt: "Desde e.l.f. Cosmetics hasta Dove Men+Care — te mostramos los productos de belleza estadounidenses más valorados que ya puedes comprar en Medellín con entrega en 24 horas.",
    category: "Belleza",
    readTime: "7 min",
    date: "2026-05-05",
    emoji: "✨",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Vitaminas: "#6B7B4F",
  Salud: "#C9533D",
  Belleza: "#C97B5C",
};

export default function BlogPage() {
  return (
    <div style={{ background: "#F7F1E5", minHeight: "100vh", fontFamily: "var(--font-dm-sans), Inter, sans-serif", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem 1rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C97B5C", marginBottom: "0.75rem" }}>
          <span style={{ width: 20, height: 1, background: "#C97B5C" }} />
          Bienestar & Salud
        </div>
        <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#4A5D3A", fontWeight: 400, margin: "0 0 0.75rem", lineHeight: 1.1 }}>
          Blog de <em style={{ color: "#C97B5C", fontStyle: "italic" }}>Bienestar</em>
        </h1>
        <p style={{ color: "#4A4F45", fontSize: "1rem", maxWidth: 560, marginBottom: "2.5rem", lineHeight: 1.6 }}>
          Guías honestas sobre vitaminas, suplementos y belleza. Sin lenguaje técnico, sin publicidad engañosa.
        </p>

        <div style={{ display: "grid", gap: "1.25rem" }}>
          {posts.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
              <article style={{
                background: "#FDFAF3",
                borderRadius: 20,
                padding: "1.5rem",
                border: "1px solid #EDE3CD",
                display: "grid",
                gridTemplateColumns: i === 0 ? "1fr" : "auto 1fr",
                gap: "1rem",
                alignItems: "center",
                transition: "box-shadow 0.2s",
              }}>
                {i === 0 && (
                  <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>{post.emoji}</div>
                )}
                {i > 0 && (
                  <div style={{ fontSize: "2.5rem", width: 64, height: 64, background: "#F7F1E5", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {post.emoji}
                  </div>
                )}
                <div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: CATEGORY_COLORS[post.category] || "#4A5D3A", background: `${CATEGORY_COLORS[post.category]}15`, padding: "0.2rem 0.6rem", borderRadius: 100 }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#4A4F45", opacity: 0.6 }}>{post.readTime} de lectura</span>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: i === 0 ? "1.5rem" : "1.1rem", color: "#4A5D3A", margin: "0 0 0.5rem", fontWeight: 500, lineHeight: 1.2 }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: "0.88rem", color: "#4A4F45", margin: 0, lineHeight: 1.5 }}>
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
