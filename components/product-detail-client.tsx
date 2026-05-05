"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { useCart } from "./cart-context";
import { HomeProductCard } from "./home-product-card";
import { ResponsiveGrid } from "./responsive-grid";
import { ProductGallery } from "./product-gallery";
import { ProductReviews } from "./product-reviews";
import { getProductReviews } from "@/lib/reviews";

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image: string | null;
  stock: number;
}

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");

export function ProductDetailClient({ product, related }: { product: Product; related: RelatedProduct[] }) {
  const { items, addItem, updateQty, openCart } = useCart();
  const inCart = items.find(i => i.id === product.id);
  const qty = inCart?.quantity ?? 0;

  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock === 0;

  const allImages = [...new Set([
    ...(product.images || []),
    ...(product.image ? [product.image] : [])
  ])].filter(Boolean);

  const reviewsPreview = getProductReviews(product.id);

  function shareWhatsApp() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = "Mira este producto en Infinity Global Shop: " + product.name + " " + url;
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  }

  function renderStars(rating: number, size: number = 14) {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <span style={{ display: "inline-flex", alignItems: "center", color: "#C9A96E", fontSize: size + "px", letterSpacing: "1px" }}>
        {"★".repeat(full)}
        {hasHalf && <span style={{ position: "relative", display: "inline-block" }}>★<span style={{ position: "absolute", left: 0, width: "50%", overflow: "hidden", color: "#EDE3CD" }}>★</span></span>}
        {"☆".repeat(5 - full - (hasHalf ? 1 : 0))}
      </span>
    );
  }

  return (
    <div style={{ background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif", paddingBottom: "3rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1rem 1.5rem" }}>

        <nav style={{ fontSize: "0.78rem", color: "#4A4F45", marginBottom: "1rem" }}>
          <Link href="/" style={{ color: "#4A4F45", textDecoration: "none" }}>Inicio</Link>
          <span style={{ margin: "0 0.5rem", opacity: 0.5 }}>›</span>
          <Link href="/products" style={{ color: "#4A4F45", textDecoration: "none" }}>Productos</Link>
          {product.category && (
            <>
              <span style={{ margin: "0 0.5rem", opacity: 0.5 }}>›</span>
              <span style={{ color: "#4A4F45" }}>{product.category}</span>
            </>
          )}
          <span style={{ margin: "0 0.5rem", opacity: 0.5 }}>›</span>
          <span style={{ color: "#4A5D3A", fontWeight: 500 }}>{product.name}</span>
        </nav>

        <div className="product-detail-grid">

          <div>
            <ProductGallery images={allImages} productName={product.name} />
          </div>

          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
              <span style={{ padding: "0.3rem 0.8rem", background: "#EDE3CD", color: "#4A5D3A", borderRadius: 100, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                ✓ Importado USA
              </span>
              <span style={{ padding: "0.3rem 0.8rem", background: "rgba(92,138,94,0.15)", color: "#5C8A5E", borderRadius: 100, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                100% Original
              </span>
              {lowStock && (
                <span style={{ padding: "0.3rem 0.8rem", background: "rgba(201,83,61,0.1)", color: "#C9533D", borderRadius: 100, fontSize: "0.7rem", fontWeight: 700 }}>
                  ⚠️ Solo {product.stock} disponibles
                </span>
              )}
            </div>

            <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "#4A5D3A", fontWeight: 400, lineHeight: 1.15, marginBottom: "0.75rem" }}>
              {product.name}
            </h1>

            <a href="#reviews" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", textDecoration: "none", color: "inherit" }}>
              {renderStars(reviewsPreview.rating, 16)}
              <span style={{ fontSize: "0.85rem", color: "#4A5D3A", fontWeight: 600 }}>{reviewsPreview.rating.toFixed(1)}</span>
              <span style={{ fontSize: "0.85rem", color: "#4A4F45" }}>· {reviewsPreview.count} reseñas</span>
              <span style={{ fontSize: "0.78rem", color: "#5C8A5E", fontWeight: 600, marginLeft: "0.3rem" }}>✓ Verificadas</span>
            </a>

            <div style={{ marginBottom: "1.5rem" }}>
              <span style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "2.4rem", fontWeight: 600, color: "#4A5D3A" }}>
                {fmt(product.price)}
              </span>
              <span style={{ fontSize: "0.78rem", color: "#5C8A5E", marginLeft: "0.85rem", fontWeight: 600 }}>
                IVA incluido
              </span>
            </div>

            <p style={{ fontSize: "0.95rem", color: "#4A4F45", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              {product.description}
            </p>

            <div style={{ background: "#FDFAF3", border: "1px solid #EDE3CD", borderRadius: 16, padding: "1rem", marginBottom: "1.5rem" }}>
              {[
                { icon: "🚚", text: "Envío gratis en pedidos +$150.000" },
                { icon: "⚡", text: "Recibe en 24 horas en Medellín" },
                { icon: "🔒", text: "Pago seguro con Wompi" },
                { icon: "✨", text: "100% original e importado de USA" },
                { icon: "💬", text: "Soporte directo por WhatsApp" },
              ].map(b => (
                <div key={b.text} style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.4rem 0", fontSize: "0.85rem", color: "#4A5D3A" }}>
                  <span style={{ fontSize: "1.1rem" }}>{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>

            {outOfStock ? (
              <button disabled style={{ width: "100%", background: "#C9533D40", color: "#C9533D", border: "none", padding: "1.1rem", borderRadius: 100, fontSize: "1rem", fontWeight: 600, cursor: "not-allowed", fontFamily: "inherit", marginBottom: "1rem" }}>
                Agotado por ahora
              </button>
            ) : qty === 0 ? (
              <button onClick={() => { addItem(product); openCart(); }} style={{ width: "100%", background: "#4A5D3A", color: "#F7F1E5", border: "none", padding: "1.1rem", borderRadius: 100, fontSize: "1rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Agregar al carrito · {fmt(product.price)}
              </button>
            ) : (
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", background: "#4A5D3A", borderRadius: 100, padding: "0.3rem", flex: 1, justifyContent: "space-between" }}>
                  <button onClick={() => updateQty(product.id, -1)} style={qtyBtn}>−</button>
                  <span style={{ color: "#F7F1E5", fontSize: "1rem", fontWeight: 600, fontFamily: "var(--font-fraunces), Georgia, serif" }}>{qty} en carrito</span>
                  <button onClick={() => updateQty(product.id, 1)} disabled={qty >= product.stock} style={{ ...qtyBtn, opacity: qty >= product.stock ? 0.4 : 1 }}>+</button>
                </div>
                <button onClick={openCart} style={{ background: "#C97B5C", color: "white", border: "none", padding: "0 1.25rem", borderRadius: 100, fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                  Ver carrito →
                </button>
              </div>
            )}

            <button onClick={shareWhatsApp} style={{ width: "100%", background: "transparent", border: "1px solid #EDE3CD", color: "#4A4F45", padding: "0.85rem", borderRadius: 100, fontSize: "0.85rem", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              💬 Compartir por WhatsApp
            </button>
          </div>
        </div>

        <ProductReviews productId={product.id} productName={product.name} />

        <section style={{ marginTop: "3rem" }}>
          <div className="trust-section">
            {[
              { icon: "🇺🇸", title: "Importado de EE.UU.", desc: "Productos auténticos directamente desde Estados Unidos" },
              { icon: "🛡️", title: "Garantía de calidad", desc: "Si no quedas satisfecha, te devolvemos tu dinero" },
              { icon: "📦", title: "Empaque cuidado", desc: "Cada pedido empacado con detalle y cariño" },
            ].map(t => (
              <div key={t.title} style={{ background: "#FDFAF3", border: "1px solid #EDE3CD", borderRadius: 18, padding: "1.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>{t.icon}</div>
                <h4 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.05rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 0.4rem" }}>{t.title}</h4>
                <p style={{ fontSize: "0.85rem", color: "#4A4F45", margin: 0, lineHeight: 1.5 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section style={{ marginTop: "4rem" }}>
            <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.5rem", color: "#4A5D3A", fontWeight: 400, marginBottom: "1.5rem" }}>
              También te puede <em style={{ color: "#C97B5C" }}>gustar</em>
            </h2>
            <ResponsiveGrid>
              {related.map(p => (
                <HomeProductCard key={p.id} product={p} />
              ))}
            </ResponsiveGrid>
          </section>
        )}

      </div>

      <style>{`
        .product-detail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        .trust-section {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: start;
          }
          .trust-section {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}

const qtyBtn: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "none",
  background: "#F7F1E5",
  color: "#4A5D3A",
  fontSize: "1.2rem",
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
