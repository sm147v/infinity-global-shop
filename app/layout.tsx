import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { CartProvider } from "@/components/cart-context";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { BottomNav } from "@/components/bottom-nav";
import { WhatsAppFloating } from "@/components/whatsapp-floating";
import { WelcomePopup } from "@/components/welcome-popup";
import { GoogleAnalytics } from "@/components/google-analytics";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Infinity Global Shop · Productos importados de USA en Medellín",
  description: "Vitaminas, productos de belleza y cuidado capilar importados de Estados Unidos. Envío gratis +$150.000. Entrega en 24h en Medellín.",
  keywords: ["vitaminas USA Medellín", "productos importados Colombia", "Nature's Bounty Colombia", "vitaminas originales", "belleza Medellín"],
  openGraph: {
    title: "Infinity Global Shop",
    description: "Productos importados de USA en 24 horas en Medellín",
    url: "https://www.infinityglobalshop.com",
    siteName: "Infinity Global Shop",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            "name": "Infinity Global Shop",
            "description": "Tienda online de productos importados de USA: vitaminas, belleza, cuidado capilar. Envío 24h en Medellín.",
            "url": "https://www.infinityglobalshop.com",
            "telephone": "+573054223600",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Medellín",
              "addressRegion": "Antioquia",
              "addressCountry": "CO"
            },
            "areaServed": {
              "@type": "AdministrativeArea",
              "name": "Medellín, Antioquia"
            },
            "currenciesAccepted": "COP",
            "paymentAccepted": "Visa, Mastercard, PSE, Nequi, Bancolombia",
            "openingHours": "Mo-Su 09:00-19:00",
            "sameAs": [
              "https://www.instagram.com/infinityglobalshop",
              "https://wa.me/573054223600"
            ]
          })
        }} />
      </head>
      <body className={`${dmSans.variable} ${fraunces.variable} antialiased`} style={{ margin: 0, background: "#F7F1E5" }}>
        <CartProvider>
          <div style={{
            background: "#4A5D3A",
            color: "#F7F1E5",
            padding: "0.6rem 1rem",
            textAlign: "center",
            fontSize: "0.78rem",
            fontWeight: 500,
            letterSpacing: "0.03em",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: 6, height: 6, background: "#C9A96E", borderRadius: "50%", display: "inline-block" }} />
              Envío gratis a partir de $150.000 · Solo en Medellín
            </span>
          </div>

          <SiteHeader />
          <main style={{ paddingBottom: "70px", minHeight: "100vh", background: "#F7F1E5", width: "100%" }}>
            {children}
          </main>
          <BottomNav />
          <CartDrawer />
          <WhatsAppFloating />
          <WelcomePopup />
          <GoogleAnalytics />
        </CartProvider>
      </body>
    </html>
  );
}
