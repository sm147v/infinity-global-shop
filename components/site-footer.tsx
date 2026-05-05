"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NewsletterForm } from "./newsletter-form";
import { PaymentRow } from "@/components/payment-row";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const footerLinkStyle: React.CSSProperties = {
    display: "block",
    color: "#F7F1E5",
    opacity: 0.72,
    textDecoration: "none",
    fontSize: "0.85rem",
    padding: "0.35rem 0",
    transition: "opacity 0.15s",
  };

  const socialBtnStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(201,169,110,0.2)",
    color: "#F7F1E5",
    padding: "0.55rem 1rem",
    borderRadius: 100,
    fontSize: "0.78rem",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
  };

  return (
    <footer style={{
      background: "#2A2E26",
      color: "#F7F1E5",
      padding: "3rem 1.5rem 6rem",
      fontFamily: "var(--font-dm-sans), Inter, sans-serif",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* GRID PRINCIPAL */}
        <div className="footer-main-grid">

          {/* COL 1: Marca + redes + pagos */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <Image
                src="/logo.png"
                alt="Infinity Global Shop"
                width={32}
                height={32}
                style={{ objectFit: "contain", borderRadius: 6 }}
              />
              <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.35rem", margin: 0, fontWeight: 500 }}>
                Infinity <em style={{ fontStyle: "italic", color: "#C9A96E", fontWeight: 300 }}>Global</em>
              </h3>
            </div>

            <p style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: "1.25rem", maxWidth: "280px", lineHeight: 1.65 }}>
              Productos importados de USA en Medellín. Vitaminas, belleza y bienestar con entrega en 24h.
            </p>

            {/* Redes sociales */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <a href="https://wa.me/573054223600?text=Hola%21%20Vi%20su%20tienda%20Infinity%20Global%20Shop%20y%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n" target="_blank" rel="noreferrer" style={socialBtnStyle}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
                </svg>
                WhatsApp
              </a>
              <a href="https://www.instagram.com/infinityglobalshop" target="_blank" rel="noreferrer" style={socialBtnStyle}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              <a href="https://listado.mercadolibre.com.co/infinity-global-shop" target="_blank" rel="noreferrer" style={{ ...socialBtnStyle, background: "rgba(255,230,0,0.1)", border: "1px solid rgba(255,230,0,0.22)" }}>
                🛒 MercadoLibre
              </a>
            </div>

            {/* Métodos de pago */}
            <div>
              <p style={{ fontSize: "0.65rem", color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.6rem", fontWeight: 600 }}>
                Pagos seguros
              </p>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center" }}>
                {/* Visa */}
                <div style={{ background: "#fff", borderRadius: 5, padding: "3px 7px", height: 24, display: "flex", alignItems: "center" }}>
                  <svg width="34" height="11" viewBox="0 0 750 250" xmlns="http://www.w3.org/2000/svg">
                    <path d="M278.2 200.7L311.8 51h52.6l-33.6 149.7h-52.6zM524.3 55.1c-10.4-3.9-26.7-8.1-47-8.1-51.8 0-88.3 26-88.5 63.3-.3 27.5 26 42.9 45.8 52 20.3 9.3 27.1 15.3 27 23.6-.1 12.7-16.2 18.5-31.2 18.5-20.8 0-31.9-2.9-49-9.9l-6.7-3-7.3 42.7c12.2 5.3 34.6 9.9 57.9 10.1 54.7 0 90.2-25.5 90.7-65 .2-21.7-13.6-38.1-43.5-51.7-18.1-8.8-29.2-14.7-29.1-23.6 0-7.9 9.4-16.3 29.7-16.3 16.9-.3 29.2 3.4 38.7 7.3l4.6 2.2 7-41.1zM657.6 51h-40.5c-12.5 0-21.9 3.4-27.4 15.8L513.5 200.7h54.7l10.9-28.5h66.8l6.3 28.5h48.2L657.6 51zm-64.1 89.3c4.3-11 20.8-53.3 20.8-53.3-.3.5 4.3-11 6.9-18.2l3.5 16.4 12 55.1h-43.2zM230.7 51l-51.3 102-5.5-26.6c-9.5-30.6-39.2-63.8-72.4-80.4l47 150.6 55.5-.1 82.5-145.5h-55.8z" fill="#1A1F71"/>
                    <path d="M131.7 51H51l-.8 3.8c62.9 15.3 104.5 52.2 121.8 96.6l-17.5-84.2C152.1 55.2 143.4 51.5 131.7 51z" fill="#F79E1B"/>
                  </svg>
                </div>
                {/* Mastercard */}
                <div style={{ background: "#fff", borderRadius: 5, padding: "3px 5px", height: 24, display: "flex", alignItems: "center" }}>
                  <svg width="28" height="18" viewBox="0 0 48 30">
                    <circle cx="18" cy="15" r="13" fill="#EB001B"/>
                    <circle cx="30" cy="15" r="13" fill="#F79E1B"/>
                    <path d="M24 4.8a13 13 0 0 1 0 20.4A13 13 0 0 1 24 4.8z" fill="#FF5F00"/>
                  </svg>
                </div>
                {/* PSE */}
                <div style={{ background: "#fff", borderRadius: 5, padding: "3px 7px", height: 24, display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#0F5BA7", fontFamily: "Arial Black, sans-serif" }}>PSE</span>
                </div>
                {/* Nequi */}
                <div style={{ background: "#DA0080", borderRadius: 5, padding: "3px 7px", height: 24, display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: "0.63rem", fontWeight: 700, color: "#fff", fontFamily: "Arial Rounded MT Bold, Arial, sans-serif" }}>nequi</span>
                </div>
                {/* Bancolombia */}
                <div style={{ background: "#FFDA00", borderRadius: 5, padding: "3px 7px", height: 24, display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: "0.58rem", fontWeight: 800, color: "#003595", fontFamily: "Arial Black, sans-serif" }}>Bancolombia</span>
                </div>
              </div>
            </div>
          </div>

          {/* COL 2: Tienda */}
          <div>
            <p style={{ fontSize: "0.68rem", color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 1rem", fontWeight: 600 }}>Tienda</p>
            <Link href="/products" style={footerLinkStyle}>Todos los productos</Link>
            <Link href="/products?category=Vitaminas" style={footerLinkStyle}>Vitaminas</Link>
            <Link href="/products?category=Belleza" style={footerLinkStyle}>Belleza</Link>
            <Link href="/products?category=Cabello" style={footerLinkStyle}>Cabello</Link>
            <Link href="/products?category=Salud" style={footerLinkStyle}>Salud</Link>
          </div>

          {/* COL 3: Info */}
          <div>
            <p style={{ fontSize: "0.68rem", color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 1rem", fontWeight: 600 }}>Información</p>
            <Link href="/us" style={footerLinkStyle}>Sobre nosotros</Link>
            <Link href="/sends" style={footerLinkStyle}>Política de envíos</Link>
            <Link href="/returns" style={footerLinkStyle}>Cambios y devoluciones</Link>
            <Link href="/order" style={footerLinkStyle}>Rastrear pedido</Link>
            <a href="https://wa.me/573054223600" target="_blank" rel="noreferrer" style={footerLinkStyle}>Atención al cliente</a>
          </div>

          {/* COL 4: Newsletter */}
          <div>
            <NewsletterForm />
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div style={{
          marginTop: "2.5rem",
          paddingTop: "1.25rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}>
      {/* Medios de pago — fila limpia, monocromo */}
      <div style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem", borderTop: "1px solid rgba(74, 93, 58, 0.1)", marginTop: "2rem" }}>
        <PaymentRow align="center" showLabel={true} />
      </div>

          <p style={{ fontSize: "0.75rem", opacity: 0.5, margin: 0 }}>
            © 2026 Infinity Global Shop · Medellín, Colombia 🇨🇴
          </p>
          <p style={{ fontSize: "0.72rem", opacity: 0.4, margin: 0 }}>
            Productos importados auténticos · Envío en 24 horas
          </p>
        </div>
      </div>

      <style>{`
        .footer-main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        @media (min-width: 900px) {
          .footer-main-grid {
            grid-template-columns: 1.7fr 1fr 1fr 1.3fr;
            gap: 2.5rem;
          }
        }
      `}</style>
    </footer>
  );
}
