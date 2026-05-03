"use client";

import Link from "next/link";
import { useCart } from "./cart-context";

export function SiteHeader() {
  const { itemCount, openCart } = useCart();

  return (
    <header style={{
      padding: "0.85rem 1.25rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "rgba(247, 241, 229, 0.95)",
      backdropFilter: "blur(10px)",
      position: "sticky",
      top: 36,
      zIndex: 99,
      borderBottom: "1px solid rgba(74, 93, 58, 0.08)",
    }}>
      <Link href="/" style={{
        fontFamily: "var(--font-fraunces), Georgia, serif",
        fontSize: "1.2rem",
        fontWeight: 500,
        letterSpacing: "-0.02em",
        color: "#4A5D3A",
        textDecoration: "none",
      }}>
        Infinity <em style={{ fontStyle: "italic", fontWeight: 300, color: "#C97B5C" }}>Global</em>
      </Link>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Link href="/products" style={{
          width: 40, height: 40,
          borderRadius: "50%",
          background: "#EDE3CD",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#4A5D3A",
          textDecoration: "none",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </Link>

        <button onClick={openCart} style={{
          width: 40, height: 40,
          borderRadius: "50%",
          background: "#EDE3CD",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          color: "#4A5D3A",
          cursor: "pointer",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {itemCount > 0 && (
            <span style={{
              position: "absolute",
              top: -2, right: -2,
              background: "#C97B5C",
              color: "white",
              fontSize: "0.65rem",
              fontWeight: 600,
              width: 18, height: 18,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
