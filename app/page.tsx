import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HomeProductCard } from "@/components/home-product-card";
import { ResponsiveGrid } from "@/components/responsive-grid";
import { CouponBanner } from "@/components/coupon-banner";
import { NewsletterForm } from "@/components/newsletter-form";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = await prisma.product.findMany({
    take: 8,
    orderBy: { id: "asc" },
  });

  return (
    <div style={{ background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>

      <section style={{ padding: "2.5rem 1.5rem 3rem", maxWidth: "1280px", margin: "0 auto" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C97B5C", marginBottom: "1rem" }}>
              <span style={{ width: 20, height: 1, background: "#C97B5C" }} />
              Bienvenida a Infinity
            </div>

            <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(2.2rem, 5vw, 3.6rem)", lineHeight: 1.05, fontWeight: 400, letterSpacing: "-0.02em", color: "#4A5D3A", marginBottom: "1rem" }}>
              Belleza, salud y <em style={{ fontStyle: "italic", fontWeight: 300, color: "#C97B5C" }}>ritual diario</em>,<br />
              <span style={{ position: "relative", display: "inline-block" }}>
                <span style={{ position: "relative", zIndex: 1 }}>curados con cariño</span>
                <span style={{ position: "absolute", left: 0, right: 0, bottom: "4%", height: 8, background: "#E5D4A8", opacity: 0.7, zIndex: 0 }} />
              </span>.
            </h1>

            <p style={{ fontSize: "1rem", color: "#4A4F45", marginBottom: "1.5rem", maxWidth: "520px", lineHeight: 1.6 }}>
              Productos importados desde Estados Unidos. Llegan a tu puerta en Medellín en 24 horas.
            </p>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", padding: "0.85rem", background: "#FDFAF3", borderRadius: 16, border: "1px solid rgba(74, 93, 58, 0.08)", maxWidth: "440px" }}>
              {[
                { num: "60+", label: "Productos" },
                { num: "24h", label: "Envío" },
                { num: "100%", label: "Originales" },
              ].map((s, i) => (
                <div key={s.label} style={{ flex: 1, textAlign: "center", borderLeft: i > 0 ? "1px solid rgba(74, 93, 58, 0.1)" : undefined }}>
                  <span style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.3rem", fontWeight: 500, color: "#4A5D3A", display: "block" }}>{s.num}</span>
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#4A4F45" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <Link href="/products" style={{ background: "#4A5D3A", color: "#F7F1E5", padding: "1rem 1.75rem", borderRadius: 100, fontSize: "0.95rem", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              Explorar tienda
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>

          <div className="hero-visual" style={{ position: "relative", height: "400px" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: "70%", height: "70%", borderRadius: 24, background: "linear-gradient(135deg, #A8B584 0%, #6B7B4F 70%, #4A5D3A 100%)", boxShadow: "0 20px 60px rgba(74, 93, 58, 0.2)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "55%", height: "55%", borderRadius: 24, background: "linear-gradient(135deg, #C97B5C 0%, #A85E42 100%)", boxShadow: "0 20px 60px rgba(201, 123, 92, 0.2)", zIndex: 2 }} />
            <div style={{ position: "absolute", top: "32%", left: "38%", width: "30%", height: "30%", borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, #E5D4A8 0%, #C9A96E 70%, #8B7140 100%)", boxShadow: "0 12px 32px rgba(201, 169, 110, 0.4)", zIndex: 3 }} />
          </div>
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .hero-grid { grid-template-columns: 1.1fr 1fr !important; }
          }
          @media (max-width: 1023px) {
            .hero-visual { display: none !important; }
          }
        `}</style>
      </section>

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
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      <section style={{ padding: "2.5rem 1.5rem 0", maxWidth: "1280px", margin: "0 auto" }}>
        <CouponBanner />
      </section>

      <section style={{ padding: "3rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C97B5C", marginBottom: "0.5rem", display: "block" }}>— Lo más querido</span>
          <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.85rem, 4vw, 2.6rem)", fontWeight: 400, lineHeight: 1.1, color: "#4A5D3A", letterSpacing: "-0.02em" }}>
            Productos <em style={{ fontStyle: "italic", fontWeight: 300, color: "#C97B5C" }}>destacados</em>
          </h2>
        </div>

        <ResponsiveGrid>
          {featured.map(p => (
            <HomeProductCard key={p.id} product={{ id: p.id, name: p.name, price: Number(p.price), image: p.image, stock: p.stock }} />
          ))}
        </ResponsiveGrid>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.95rem 1.75rem", background: "transparent", border: "1px solid rgba(74, 93, 58, 0.3)", color: "#4A5D3A", borderRadius: 100, textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>
            Ver todos los productos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </section>

      <section style={{ padding: "3rem 1.5rem", background: "#EDE3CD" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C97B5C", marginBottom: "0.5rem", display: "block" }}>— Construyendo confianza</span>
            <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 400, color: "#4A5D3A", letterSpacing: "-0.02em" }}>
              Una marca que <em style={{ fontStyle: "italic", fontWeight: 300, color: "#C97B5C" }}>nace contigo</em>
            </h2>
          </div>

          <div style={{ background: "#FDFAF3", borderRadius: 24, padding: "2.5rem 1.5rem", border: "1px solid #EDE3CD", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🌱</div>
            <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)", color: "#4A5D3A", fontStyle: "italic", lineHeight: 1.5, margin: "0 0 1rem", maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}>
              "Estamos empezando este viaje y queremos hacerlo bien. <span style={{ color: "#C97B5C", fontStyle: "normal", fontWeight: 600 }}>Tu opinión real será la primera</span> en aparecer aquí cuando completes tu compra."
            </p>
            <p style={{ color: "#4A4F45", fontSize: "0.9rem", margin: "1rem 0 1.5rem", maxWidth: "560px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Sé parte de nuestra historia. Cada cliente cuenta. Cada experiencia se vuelve la base de la siguiente.
            </p>
            <Link href="/nosotros" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 1.5rem", background: "#4A5D3A", color: "#F7F1E5", borderRadius: 100, textDecoration: "none", fontSize: "0.88rem", fontWeight: 500 }}>
              Conoce nuestra historia →
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "3rem 1.5rem", background: "#4A5D3A", color: "#F7F1E5", textAlign: "center" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 400, marginBottom: "0.5rem", lineHeight: 1.2 }}>
            Tu <em style={{ color: "#C9A96E", fontStyle: "italic", fontWeight: 300 }}>tranquilidad</em><br />es nuestro compromiso
          </h2>
          <p style={{ fontSize: "0.95rem", opacity: 0.85, marginBottom: "2rem", maxWidth: "560px", margin: "0 auto 2rem" }}>
            Compra fácil, envío rápido, productos de confianza.
          </p>

          <div className="trust-grid">
            {[
              { icon: "📦", title: "Envío 24h", desc: "En toda Medellín, sin excusas." },
              { icon: "🔒", title: "Pago seguro", desc: "Wompi, Visa, PSE, Nequi." },
              { icon: "💬", title: "Soporte directo", desc: "Por WhatsApp todo el día." },
              { icon: "✨", title: "100% originales", desc: "Importados directamente." },
            ].map(f => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201, 169, 110, 0.2)", padding: "1.25rem", borderRadius: 14, textAlign: "left" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: "0.6rem" }}>{f.icon}</div>
                <h4 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1rem", fontWeight: 500, marginBottom: "0.25rem" }}>{f.title}</h4>
                <p style={{ fontSize: "0.8rem", opacity: 0.8, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .trust-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; max-width: 880px; margin: 0 auto; }
          @media (min-width: 1024px) {
            .trust-grid { grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
          }
        `}</style>
      </section>

      <footer style={{ background: "#2A2E26", color: "#F7F1E5", padding: "3rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="footer-grid">
            <div>
              <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.6rem", marginBottom: "0.6rem", margin: "0 0 0.6rem" }}>
                Infinity <em style={{ fontStyle: "italic", color: "#C9A96E", fontWeight: 300 }}>Global</em>
              </h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "1.5rem", maxWidth: "320px", lineHeight: 1.6 }}>
                Bienestar curado para toda la familia. Productos importados con cariño desde EE.UU.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <a href="https://wa.me/573054223600?text=Hola%21%20Vi%20su%20tienda%20Infinity%20Global%20Shop%20y%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n" target="_blank" rel="noreferrer" style={socialBtnStyle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "0.4rem" }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
                  </svg>
                  WhatsApp
                </a>
                <a href="https://www.instagram.com/infinityglobalshop" target="_blank" rel="noreferrer" style={socialBtnStyle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "0.4rem" }}>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <NewsletterForm />
            </div>
          </div>

          <div className="footer-other-cols">
            <div>
              <p style={{ fontSize: "0.78rem", color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.85rem", fontWeight: 600 }}>Tienda</p>
              <Link href="/products" style={footerLinkStyle}>Todos los productos</Link>
              <Link href="/products?category=Vitaminas" style={footerLinkStyle}>Vitaminas</Link>
              <Link href="/products?category=Belleza" style={footerLinkStyle}>Belleza</Link>
              <Link href="/products?category=Cabello" style={footerLinkStyle}>Cabello</Link>
            </div>

            <div>
              <p style={{ fontSize: "0.78rem", color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.85rem", fontWeight: 600 }}>Información</p>
              <Link href="/nosotros" style={footerLinkStyle}>Sobre nosotros</Link>
              <Link href="/envios" style={footerLinkStyle}>Política de envíos</Link>
              <Link href="/devoluciones" style={footerLinkStyle}>Cambios y devoluciones</Link>
              <Link href="/pedido" style={footerLinkStyle}>Rastrear pedido</Link>
            </div>
          </div>

          <div style={{ paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: "0.78rem", opacity: 0.6, textAlign: "center", marginTop: "2rem" }}>
            © 2026 Infinity Global Shop · Hecho con cariño en Medellín 🌿
          </div>
        </div>

        <style>{`
          .footer-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-other-cols {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          @media (min-width: 768px) {
            .footer-grid {
              grid-template-columns: 1.4fr 1fr;
              gap: 3rem;
            }
            .footer-other-cols {
              grid-template-columns: 1fr 1fr;
            }
          }
        `}</style>
      </footer>

    </div>
  );
}

const socialBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(201, 169, 110, 0.2)",
  color: "#F7F1E5",
  padding: "0.75rem 1.25rem",
  borderRadius: 100,
  fontSize: "0.82rem",
  textDecoration: "none",
};

const footerLinkStyle: React.CSSProperties = {
  display: "block",
  color: "#F7F1E5",
  opacity: 0.75,
  textDecoration: "none",
  fontSize: "0.88rem",
  padding: "0.4rem 0",
};
