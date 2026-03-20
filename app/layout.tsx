import type { Metadata } from "next";
import Link from "next/link";
import { DM_Sans, Fraunces } from "next/font/google";
import { HeaderCart } from "@/components/header-cart";
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
  title: "Infinity Global Shop",
  description: "Small, secure and fast eCommerce base built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${dmSans.variable} ${fraunces.variable} antialiased`}>
        <header className="site-header">
          <div className="container nav-wrap">
            <Link href="/" className="brand" aria-label="Infinity Global Shop inicio">
              <span className="brand-mark">IG</span>
              <span className="brand-text">Infinity Global Shop</span>
            </Link>
            <nav className="nav-links">
              <Link href="/products">Productos</Link>
              <Link href="/checkout">Checkout</Link>
              <HeaderCart />
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="container main-content">{children}</main>
      </body>
    </html>
  );
}
