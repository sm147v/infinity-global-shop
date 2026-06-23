import { TiltCard } from "@/components/TiltCard";
import HeroCarousel from "@/components/HeroCarousel";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { applyDiscountsToProducts } from "@/lib/discounts";
import { HomeProductCard } from "@/components/home-product-card";
import { ResponsiveGrid } from "@/components/responsive-grid";
import { CouponBanner } from "@/components/coupon-banner";
import { CategoriesSection } from "@/components/categories-section";
import { FeaturesSection } from "@/components/features-section";

// ISR: regenera la home cada 10 minutos en background.
// Mejora drásticamente Core Web Vitals (no pega DB en cada visita).
export const revalidate = 600;

// Productos del Vertical B — "los que Colombia no trae".
// IMPORTANTE: si cambias slugs en tu DB, actualízalos aquí.
const VERTICAL_B_SLUGS = [
  "gnc-glucosamina-y-condroitina-salud-articular-y-movilidad",
  "spring-valley-cranberry-concentrado-salud-urinaria-femenina",
  "spring-valley-l-lisina-1000mg-refuerzo-inmune-y-combate-herpes",
  "spring-valley-magnesio-200mg-alta-absorcion-glicinato-tolerable",
];

export default async function Home() {
  const [featured, exclusivos, banners] = await Promise.all([
    prisma.product.findMany({
      take: 8,
      orderBy: { id: "asc" },
      where: { stock: { gt: 0 }, active: true, slug: { notIn: VERTICAL_B_SLUGS } },
    }),
    prisma.product.findMany({
      where: { slug: { in: VERTICAL_B_SLUGS }, active: true },
    }),
    prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
  ]);

  // Mantener el orden definido en VERTICAL_B_SLUGS, no el orden de DB.
  const exclusivosOrdered = VERTICAL_B_SLUGS
    .map(slug => exclusivos.find(p => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // Aplicar descuentos activos (precio tachado + etiqueta)
  const featuredD = await applyDiscountsToProducts(
    featured.map(p => ({ id: p.id, name: p.name, price: Number(p.price), image: p.image, stock: p.stock, slug: p.slug, category: p.category }))
  );
  const exclusivosD = await applyDiscountsToProducts(
    exclusivosOrdered.map(p => ({ id: p.id, name: p.name, price: Number(p.price), image: p.image, stock: p.stock, slug: p.slug, category: p.category }))
  );

  return (
    <div style={{ background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>
      <HeroCarousel initialBanners={banners.map(b => ({ id: b.id, imageUrl: b.imageUrl, title: b.title, subtitle: b.subtitle, ctaText: b.ctaText, ctaUrl: b.ctaUrl, alt: b.alt, active: b.active, order: b.order }))} />

      {/* HERO COMPACTO */}
      <section style={{ padding: "2rem 1.5rem 2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#A85A3C", marginBottom: "1rem" }}>
            <span style={{ width: 20, height: 1, background: "#A85A3C" }} />
            Bienvenida a Infinity
            <span style={{ width: 20, height: 1, background: "#A85A3C" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.9rem, 4.5vw, 3rem)", lineHeight: 1.1, fontWeight: 400, letterSpacing: "-0.02em", color: "#4A5D3A", marginBottom: "1rem" }}>
            Productos USA originales en Medellín.{" "}
            <em style={{ fontStyle: "italic", fontWeight: 300, color: "#A85A3C" }}>Sin esperas, sin dólares,</em>{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ position: "relative", zIndex: 1 }}>sin aduanas</span>
              <span style={{ position: "absolute", left: 0, right: 0, bottom: "4%", height: 6, background: "#E5D4A8", opacity: 0.7, zIndex: 0 }} />
            </span>.
          </h1>
          <p style={{ fontSize: "1rem", color: "#4A4F45", marginBottom: "1.5rem", maxWidth: "560px", lineHeight: 1.55, margin: "0 auto 1.5rem" }}>
            Vitaminas, salud y belleza importados directamente desde Estados Unidos. En tu puerta en 24 horas — incluyendo lo que las farmacias colombianas no traen.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", padding: "0.85rem", background: "#FDFAF3", borderRadius: 16, border: "1px solid rgba(74, 93, 58, 0.08)", maxWidth: "440px", margin: "0 auto 1.5rem" }}>
            {[
              { num: "USA", label: "Importado" },
              { num: "24h", label: "Envío" },
              { num: "100%", label: "Originales" },
            ].map((s, i) => (
              <div key={s.label} style={{ flex: 1, textAlign: "center", borderLeft: i > 0 ? "1px solid rgba(74, 93, 58, 0.1)" : undefined }}>
                <span style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.3rem", fontWeight: 500, color: "#4A5D3A", display: "block" }}>{s.num}</span>
                <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#4A4F45" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/productos" style={{ background: "#4A5D3A", color: "#F7F1E5", padding: "1rem 1.75rem", borderRadius: 100, fontSize: "0.95rem", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              Explorar tienda
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link href="#exclusivos-usa" style={{ background: "transparent", color: "#4A5D3A", padding: "1rem 1.5rem", borderRadius: 100, fontSize: "0.95rem", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", border: "1px solid rgba(74, 93, 58, 0.3)" }}>
              Productos exclusivos USA
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: "#4A5D3A", color: "#F7F1E5", padding: "0.85rem 0", overflow: "hidden", whiteSpace: "nowrap", position: "relative" }}>
        <div style={{ display: "flex", animation: "scroll 35s linear infinite", fontFamily: "var(--font-fraunces), Georgia, serif", fontStyle: "italic", fontSize: "0.95rem", width: "max-content" }}>
          {Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ display: "flex", paddingRight: "2rem" }}>
              {["Envío gratis +$150k", "Productos USA originales", "Pago seguro con Wompi", "Entrega 24h en Medellín", "Atención por WhatsApp"].map(t => (
                <span key={t + i} style={{ marginRight: "2rem", display: "inline-flex", alignItems: "center", gap: "1rem" }}>
                  {t}
                  <span style={{ color: "#C9A96E", fontStyle: "normal" }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
        <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </div>

      {/* CUPÓN */}
      <section style={{ padding: "2.5rem 1.5rem 0", maxWidth: "1280px", margin: "0 auto" }}>
        <CouponBanner />
      </section>

      {/* CATEGORÍAS / NICHOS */}
      <CategoriesSection />

      {/* PRODUCTOS DESTACADOS */}
      <section style={{ padding: "3rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#A85A3C", marginBottom: "0.5rem", display: "block" }}>— Lo más querido</span>
          <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.85rem, 4vw, 2.6rem)", fontWeight: 400, lineHeight: 1.1, color: "#4A5D3A", letterSpacing: "-0.02em" }}>
            Productos <em style={{ fontStyle: "italic", fontWeight: 300, color: "#A85A3C" }}>destacados</em>
          </h2>
        </div>
        <ResponsiveGrid>
          {featuredD.map(p => (
            <TiltCard key={p.id}><HomeProductCard product={p} /></TiltCard>
          ))}
        </ResponsiveGrid>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/productos" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.95rem 1.75rem", background: "transparent", border: "1px solid rgba(74, 93, 58, 0.3)", color: "#4A5D3A", borderRadius: 100, textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>
            Ver todos los productos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* PRODUCTOS USA EXCLUSIVOS — VERTICAL B (mina de oro) */}
      {exclusivosOrdered.length > 0 && (
        <section id="exclusivos-usa" style={{ padding: "4rem 1.5rem", background: "#4A5D3A" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#E5D4A8", marginBottom: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: 20, height: 1, background: "#E5D4A8" }} />
                Lo que no consigues en farmacias
                <span style={{ width: 20, height: 1, background: "#E5D4A8" }} />
              </span>
              <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.85rem, 4vw, 2.6rem)", fontWeight: 400, lineHeight: 1.15, color: "#F7F1E5", letterSpacing: "-0.02em", margin: "0.75rem 0 1rem" }}>
                Productos USA que <em style={{ fontStyle: "italic", fontWeight: 300, color: "#E5D4A8" }}>Colombia no trae</em>
              </h2>
              <p style={{ color: "rgba(247, 241, 229, 0.85)", fontSize: "0.95rem", maxWidth: "620px", margin: "0 auto", lineHeight: 1.6 }}>
                Productos importados difíciles de conseguir en Colombia: los que las grandes cadenas farmacéuticas no traen, nosotros sí los conseguimos para ti.
              </p>
            </div>
            <ResponsiveGrid>
              {exclusivosD.map(p => (
                <HomeProductCard
                  key={p.id}
                  product={p}
                />
              ))}
            </ResponsiveGrid>
          </div>
        </section>
      )}

      {/* RESEÑAS — tienda nueva, sé el primero (honesto, sin reseñas fabricadas) */}
      <section style={{ padding: "3.5rem 1.5rem", background: "#EDE3CD" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#A85A3C", marginBottom: "0.5rem", display: "block" }}>
            — Recién empezamos
          </span>
          <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.85rem, 4vw, 2.6rem)", fontWeight: 400, color: "#4A5D3A", letterSpacing: "-0.02em", margin: "0.5rem 0 0.85rem" }}>
            Sé de los <em style={{ fontStyle: "italic", fontWeight: 300, color: "#A85A3C" }}>primeros</em> en contar tu experiencia
          </h2>
          <p style={{ color: "#4A4F45", fontSize: "0.98rem", lineHeight: 1.6, margin: "0 auto 1.75rem", maxWidth: "520px" }}>
            Somos una tienda nueva en Medellín y lo estamos haciendo bien desde el inicio. Tu reseña real será de las primeras en aparecer aquí — y nos ayuda a crecer con confianza.
          </p>
          <a href="https://wa.me/573054223600?text=Hola%21%20Quiero%20dejar%20mi%20rese%C3%B1a%20de%20Infinity%20Global%20Shop" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.95rem 1.75rem", background: "#4A5D3A", color: "#F7F1E5", borderRadius: 100, textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>
            Dejar mi reseña por WhatsApp
          </a>
        </div>
      </section>

      {/* FEATURES con Lucide */}
      <FeaturesSection />

    </div>
  );
}
