import { TiltCard } from "@/components/TiltCard";
import HeroCarousel from "@/components/HeroCarousel";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
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
  "tylenol-artritis-8hr-acetaminofen-650mg-290-capsulas-dolor-articular",
  "devrom-desodorante-interno-200mg-100-tabletas-masticables-anti-olor",
  "preparation-h-unguento-hemorroides-alivio-rapido-del-picor-y-ardor",
];

export default async function Home() {
  const [featured, exclusivos] = await Promise.all([
    prisma.product.findMany({
      take: 8,
      orderBy: { id: "asc" },
      where: { stock: { gt: 0 } },
    }),
    prisma.product.findMany({
      where: { slug: { in: VERTICAL_B_SLUGS } },
    }),
  ]);

  // Mantener el orden definido en VERTICAL_B_SLUGS, no el orden de DB.
  const exclusivosOrdered = VERTICAL_B_SLUGS
    .map(slug => exclusivos.find(p => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div style={{ background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>
      <HeroCarousel />

      {/* HERO COMPACTO */}
      <section style={{ padding: "2rem 1.5rem 2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C97B5C", marginBottom: "1rem" }}>
            <span style={{ width: 20, height: 1, background: "#C97B5C" }} />
            Bienvenida a Infinity
            <span style={{ width: 20, height: 1, background: "#C97B5C" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.9rem, 4.5vw, 3rem)", lineHeight: 1.1, fontWeight: 400, letterSpacing: "-0.02em", color: "#4A5D3A", marginBottom: "1rem" }}>
            Productos USA originales en Medellín.{" "}
            <em style={{ fontStyle: "italic", fontWeight: 300, color: "#C97B5C" }}>Sin esperas, sin dólares,</em>{" "}
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
              { num: "+125", label: "Reseñas" },
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
          <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C97B5C", marginBottom: "0.5rem", display: "block" }}>— Lo más querido</span>
          <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.85rem, 4vw, 2.6rem)", fontWeight: 400, lineHeight: 1.1, color: "#4A5D3A", letterSpacing: "-0.02em" }}>
            Productos <em style={{ fontStyle: "italic", fontWeight: 300, color: "#C97B5C" }}>destacados</em>
          </h2>
        </div>
        <ResponsiveGrid>
          {featured.map(p => (
            <TiltCard key={p.id}><HomeProductCard product={{ id: p.id, name: p.name, price: Number(p.price), image: p.image, stock: p.stock, slug: p.slug }} /></TiltCard>
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
                Productos de salud que cambian la vida de quien los necesita — pero que las cadenas farmacéuticas colombianas no importan. Para nuestros clientes, sí lo son.
              </p>
            </div>
            <ResponsiveGrid>
              {exclusivosOrdered.map(p => (
                <HomeProductCard
                  key={p.id}
                  product={{ id: p.id, name: p.name, price: Number(p.price), image: p.image, stock: p.stock, slug: p.slug }}
                />
              ))}
            </ResponsiveGrid>
          </div>
        </section>
      )}

      {/* RESEÑAS REALES — reemplaza la sección "Una marca que nace contigo" */}
      <section style={{ padding: "3.5rem 1.5rem", background: "#EDE3CD" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C97B5C", marginBottom: "0.5rem", display: "block" }}>
              — Lo que dicen quienes ya compraron
            </span>
            <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.85rem, 4vw, 2.6rem)", fontWeight: 400, color: "#4A5D3A", letterSpacing: "-0.02em", margin: "0.5rem 0 0.75rem" }}>
              +125 reseñas <em style={{ fontStyle: "italic", fontWeight: 300, color: "#C97B5C" }}>verificadas</em>. Y contando.
            </h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#FDFAF3", padding: "0.5rem 1rem", borderRadius: 100, marginTop: "0.5rem", border: "1px solid rgba(74, 93, 58, 0.08)" }}>
              <span style={{ color: "#C9A96E", fontSize: "1rem", letterSpacing: "0.05em" }}>★★★★★</span>
              <span style={{ fontWeight: 600, color: "#4A5D3A" }}>4.7</span>
              <span style={{ color: "#4A4F45", fontSize: "0.85rem" }}>promedio</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
            {[
              { name: "Laura T.", location: "Laureles", text: "Por fin productos americanos sin pagar dólares ni esperar 3 semanas.", initial: "L" },
              { name: "Camila V.", location: "El Poblado", text: "Los empaques súper cuidados, se nota el cariño en cada detalle.", initial: "C" },
              { name: "Andrea P.", location: "El Poblado", text: "Muy profesionales, el seguimiento por WhatsApp es genial.", initial: "A" },
            ].map(r => (
              <div key={r.name} style={{ background: "#FDFAF3", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(74, 93, 58, 0.08)" }}>
                <div style={{ color: "#C9A96E", fontSize: "0.95rem", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>★★★★★</div>
                <p style={{ color: "#4A4F45", fontSize: "0.95rem", lineHeight: 1.55, margin: "0 0 1.25rem", fontStyle: "italic" }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#4A5D3A", color: "#F7F1E5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: "0.9rem" }}>
                    {r.initial}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#4A5D3A", fontSize: "0.9rem" }}>{r.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#4A4F45", opacity: 0.7 }}>
                      Compra verificada · {r.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/productos" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 1.5rem", background: "#4A5D3A", color: "#F7F1E5", borderRadius: 100, textDecoration: "none", fontSize: "0.88rem", fontWeight: 500 }}>
              Ver productos →
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES con Lucide */}
      <FeaturesSection />

    </div>
  );
}
