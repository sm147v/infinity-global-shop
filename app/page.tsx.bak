import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HomeProductCard } from "@/components/home-product-card";
import { ResponsiveGrid } from "@/components/responsive-grid";

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

      <div style={{ background: "#4A5D3A", color: "#F7F1E5", padding: "0.85rem 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "scroll 30s linear infinite", fontFamily: "var(--font-fraunces), Georgia, serif", fontStyle: "italic", fontSize: "0.95rem" }}>
          {Array(2).fill(0).map((_, i) => (
            <span key={i}>
              {["Envío gratis +$150k", "Productos USA", "Pago seguro", "Entrega 24h"].map(t => (
                <span key={t} style={{ marginRight: "1.5rem" }}>
                  {t} <span style={{ color: "#C9A96E", fontStyle: "normal", marginLeft: "1rem" }}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
        <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </div>

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
                <a href="https://wa.me/573054223600" style={socialBtnStyle}>💬 WhatsApp</a>
                <a href="https://instagram.com" style={socialBtnStyle}>📷 Instagram</a>
              </div>
            </div>

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
          @media (min-width: 768px) {
            .footer-grid {
              grid-template-columns: 2fr 1fr 1fr;
              gap: 3rem;
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
