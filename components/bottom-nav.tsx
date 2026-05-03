"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-context";

export function BottomNav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();

  if (pathname?.startsWith("/admin")) return null;

  const isHome = pathname === "/";
  const isProducts = pathname === "/products";

  const itemStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.2rem",
    padding: "0.5rem",
    color: active ? "#4A5D3A" : "#4A4F45",
    fontWeight: active ? 600 : 400,
    textDecoration: "none",
    fontSize: "0.65rem",
    fontFamily: "inherit",
    border: "none",
    background: "none",
    cursor: "pointer",
  });

  return (
    <nav style={{
      position: "fixed",
      bottom: 0, left: 0, right: 0,
      background: "#FDFAF3",
      borderTop: "1px solid rgba(74, 93, 58, 0.1)",
      padding: "0.5rem",
      display: "flex",
      justifyContent: "space-around",
      zIndex: 90,
    }}>
      <Link href="/" style={itemStyle(isHome)}>
        <div style={{ position: "relative", height: 22 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <span>Inicio</span>
      </Link>

      <Link href="/products" style={itemStyle(isProducts)}>
        <div style={{ position: "relative", height: 22 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <span>Buscar</span>
      </Link>

      <button onClick={openCart} style={itemStyle(false)}>
        <div style={{ position: "relative", height: 22, display: "inline-block" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {itemCount > 0 && (
            <span style={{
              position: "absolute",
              top: -6,
              right: -8,
              background: "#C97B5C",
              color: "white",
              fontSize: "0.6rem",
              fontWeight: 700,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              borderRadius: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}>
              {itemCount}
            </span>
          )}
        </div>
        <span>Carrito</span>
      </button>
    </nav>
  );
}
