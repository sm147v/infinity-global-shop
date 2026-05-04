"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "./cart-context";
import { useWishlist } from "./wishlist-context";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openCart } = useCart();
  const { count: wishCount } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen]);

  if (pathname?.startsWith("/admin")) return null;

  const isHome = pathname === "/";
  const isProducts = pathname === "/products";

  function doSearch(q?: string) {
    const term = (q ?? query).trim();
    if (term) {
      router.push("/products?q=" + encodeURIComponent(term));
    } else {
      router.push("/products");
    }
    setSearchOpen(false);
    setQuery("");
  }

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
    <>
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
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
          </div>
          <span>Tienda</span>
        </Link>

        <button onClick={() => setSearchOpen(true)} style={itemStyle(searchOpen)}>
          <div style={{ position: "relative", height: 22 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <span>Buscar</span>
        </button>

        <Link href="/favoritos" style={itemStyle(pathname === "/favoritos")}>
          <div style={{ position: "relative", height: 22, display: "inline-block" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishCount > 0 && (
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
              }}>{wishCount}</span>
            )}
          </div>
          <span>Favoritos</span>
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

      {searchOpen && (
        <div onClick={() => setSearchOpen(false)} style={{
          position: "fixed",
          inset: 0,
          background: "rgba(42,46,38,0.6)",
          backdropFilter: "blur(6px)",
          zIndex: 200,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "5rem 1rem 1rem",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#FDFAF3",
            borderRadius: 24,
            padding: "1.25rem",
            width: "100%",
            maxWidth: 480,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            fontFamily: "var(--font-dm-sans), Inter, sans-serif",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", margin: 0, fontWeight: 500 }}>
                ¿Qué estás buscando?
              </h3>
              <button onClick={() => setSearchOpen(false)} style={{ background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#4A4F45" }}>✕</button>
            </div>

            <input
              type="text"
              placeholder="Vitaminas, cabello, belleza..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && doSearch()}
              autoFocus
              style={{
                width: "100%",
                padding: "1rem 1.25rem",
                borderRadius: 100,
                border: "1px solid #EDE3CD",
                background: "#F7F1E5",
                fontSize: "16px",
                outline: "none",
                fontFamily: "inherit",
                color: "#4A5D3A",
                boxSizing: "border-box",
                marginBottom: "1rem",
              }}
            />

            <button onClick={() => doSearch()} style={{
              width: "100%",
              background: "#4A5D3A",
              color: "#F7F1E5",
              border: "none",
              padding: "1rem",
              borderRadius: 100,
              fontSize: "0.92rem",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: "1rem",
            }}>
              🔍 Buscar
            </button>

            <div>
              <p style={{ fontSize: "0.72rem", color: "#4A4F45", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.6rem", fontWeight: 600 }}>
                Categorías populares
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {["Vitaminas", "Belleza", "Cabello", "Salud", "Hogar"].map(cat => (
                  <button key={cat} onClick={() => doSearch(cat)} style={{
                    background: "#EDE3CD",
                    border: "none",
                    color: "#4A5D3A",
                    padding: "0.5rem 0.85rem",
                    borderRadius: 100,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
