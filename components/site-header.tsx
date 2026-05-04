"use client";
import Link from "next/link";
import { useCart } from "./cart-context";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const { itemCount, openCart } = useCart();
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasToken = localStorage.getItem("adminToken");
      const urlAdmin = window.location.search.includes("admin");
      setShowAdmin(!!hasToken || urlAdmin);
    }
  }, []);

  return (
    <header style={{
      padding: "0.65rem 1.25rem",
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
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        textDecoration: "none",
        color: "#4A5D3A",
      }}>
        <img
          src="/logo.png"
          alt="Infinity Global Shop"
          width={36}
          height={36}
          style={{ objectFit: "contain", display: "block" }}
        />
        <span style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: "1.15rem",
          fontWeight: 500,
          letterSpacing: "-0.02em",
        }}>
          Infinity <em style={{ fontStyle: "italic", fontWeight: 300, color: "#C97B5C" }}>Global</em>
        </span>
      </Link>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Link href="/pedido" style={{
          fontSize: "0.78rem",
          color: "#4A4F45",
          textDecoration: "none",
          padding: "0.5rem 0.85rem",
          borderRadius: 100,
          fontWeight: 500,
        }}>
          Mi pedido
        </Link>
        {showAdmin && (
          <Link href="/admin" style={{
            fontSize: "0.78rem",
            color: "#C97B5C",
            textDecoration: "none",
            padding: "0.5rem 0.85rem",
            borderRadius: 100,
            fontWeight: 500,
          }}>
            Admin
          </Link>
        )}
      </div>
    </header>
  );
}
