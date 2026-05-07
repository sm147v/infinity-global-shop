import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { CartProvider } from "@/components/cart-context";
import { WishlistProvider } from "@/components/wishlist-context";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { BottomNav } from "@/components/bottom-nav";
import { WhatsAppFloating } from "@/components/whatsapp-floating";
import { SiteFooter } from "@/components/site-footer";
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4A5D3A",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.infinityglobalshop.com"),
  title: {
    default: "Infinity Global Shop · Vitaminas y productos importados de USA en Medellín",
    template: "%s · Infinity Global Shop",
  },
  description: "Vitaminas Nature's Bounty, Spring Valley, Vitafusion y más productos de belleza y cuidado importados originales de Estados Unidos. Envío gratis +$150.000 y entrega 24h en Medellín.",
  applicationName: "Infinity Global Shop",
  keywords: [
    "vitaminas Medellín",
    "vitaminas originales Colombia",
    "Nature's Bounty Colombia",
    "Spring Valley Medellín",
    "Vitafusion Colombia",
    "biotina Medellín",
    "melatonina Colombia",
    "productos importados USA",
    "tienda online Medellín",
    "comprar vitaminas online Colombia",
    "suplementos USA Medellín",
    "productos de belleza importados",
  ],
  authors: [{ name: "Infinity Global Shop" }],
  creator: "Infinity Global Shop",
  publisher: "Infinity Global Shop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "es-CO": "/",
    },
  },
  openGraph: {
    title: "Infinity Global Shop · Vitaminas y productos USA en Medellín",
    description: "Vitaminas, belleza y cuidado importados originales de USA. Envío gratis +$150.000 · Entrega 24h en Medellín.",
    url: "https://www.infinityglobalshop.com",
    siteName: "Infinity Global Shop",
    locale: "es_CO",
    type: "website",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Infinity Global Shop · Tienda oficial de productos importados de USA en Medellín",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinity Global Shop · Productos USA en Medellín",
    description: "Vitaminas, belleza y cuidado importados de USA. Envío 24h en Medellín.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "RbEA0_sEmUqGJu2lwOlXmsAaHUSnTnoR-b2Zju5641w",
  },
  category: "shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OnlineStore",
            "@id": "https://www.infinityglobalshop.com/#organization",
            "name": "Infinity Global Shop",
            "alternateName": "Infinity Global",
            "logo": "https://www.infinityglobalshop.com/logo.png",
            "image": "https://www.infinityglobalshop.com/og-image.png",
            "description": "Tienda online de productos importados originales de USA: vitaminas Nature's Bounty, Spring Valley, Vitafusion, belleza y cuidado capilar. Envío 24h en Medellín.",
            "url": "https://www.infinityglobalshop.com",
            "telephone": "+573054223600",
            "email": "hola@infinityglobalshop.com",
            "priceRange": "$$",
            "currenciesAccepted": "COP",
            "paymentAccepted": ["Visa", "Mastercard", "American Express", "PSE", "Nequi", "Bancolombia", "Daviplata"],
            "openingHoursSpecification": [{
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              "opens": "09:00",
              "closes": "19:00"
            }],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Medellín",
              "addressRegion": "Antioquia",
              "addressCountry": "CO"
            },
            "areaServed": [
              { "@type": "City", "name": "Medellín" },
              { "@type": "AdministrativeArea", "name": "Antioquia" }
            ],
            "contactPoint": [{
              "@type": "ContactPoint",
              "telephone": "+573054223600",
              "contactType": "customer service",
              "areaServed": "CO",
              "availableLanguage": ["Spanish"]
            }],
            "sameAs": [
              "https://www.instagram.com/infinityglobalshop",
              "https://wa.me/573054223600",
              "https://listado.mercadolibre.com.co/infinity-global-shop"
            ],
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.infinityglobalshop.com/products?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://www.infinityglobalshop.com/#website",
            "url": "https://www.infinityglobalshop.com",
            "name": "Infinity Global Shop",
            "description": "Productos importados originales de USA con entrega 24h en Medellín",
            "publisher": { "@id": "https://www.infinityglobalshop.com/#organization" },
            "inLanguage": "es-CO",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.infinityglobalshop.com/products?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }} />
      </head>
      <body className={`${dmSans.variable} ${fraunces.variable} antialiased`} style={{ margin: 0, background: "#F7F1E5", overflowX: "hidden", maxWidth: "100vw" }}>
        <WishlistProvider>
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
          <main style={{ paddingBottom: "0", minHeight: "100vh", background: "#F7F1E5", width: "100%", overflowX: "hidden" }}>
            {children}
          </main>
          <SiteFooter />
          <BottomNav />
          <CartDrawer />
          <WhatsAppFloating />
          <WelcomePopup />
          <GoogleAnalytics />
        </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
