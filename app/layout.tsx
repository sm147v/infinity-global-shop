import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { CartProvider } from "@/components/cart-context";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { BottomNav } from "@/components/bottom-nav";
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
  title: "Infinity Global Shop · Salud, belleza y bienestar",
  description: "Productos importados de USA en 24 horas en Medellín. Vitaminas, belleza, cuidado del cabello y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
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
              <span style={{
                width: 6, height: 6,
                background: "#C9A96E",
                borderRadius: "50%",
                display: "inline-block",
              }} />
              Envío gratis a partir de $150.000 · Solo en Medellín
            </span>
          </div>

          <SiteHeader />
          <main style={{ paddingBottom: "70px", minHeight: "100vh", background: "#F7F1E5", width: "100%" }}>
            {children}
          </main>
          <BottomNav />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
