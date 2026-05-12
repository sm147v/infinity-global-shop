"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { useWishlist } from "./wishlist-context";
import { HomeProductCard } from "./home-product-card";
import { ResponsiveGrid } from "./responsive-grid";

export function FavoritesClient({ allProducts }: { allProducts: Product[] }) {
  const { items, count } = useWishlist();
  const favorites = allProducts.filter(p => items.includes(p.id));

  return (
    <main style={{ background: "#F7F1E5", padding: "2rem 1.5rem 3rem", minHeight: "60vh", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "#C97B5C", fontWeight: 600 }}>
            ❤️ Tus favoritos
          </span>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "#4A5D3A", fontWeight: 400, margin: "0.5rem 0 0", lineHeight: 1.1 }}>
            Mis <em style={{ color: "#C97B5C" }}>favoritos</em>
          </h1>
          {count > 0 && <p style={{ color: "#4A4F45", marginTop: "0.5rem", fontSize: "0.9rem" }}>{count} producto{count !== 1 ? "s" : ""} guardado{count !== 1 ? "s" : ""}</p>}
        </div>

        {favorites.length === 0 ? (
          <div style={{ background: "#FDFAF3", borderRadius: 24, padding: "3rem 1.5rem", border: "1px solid #EDE3CD", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>💚</div>
            <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.4rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 0.5rem" }}>
              Aún no tienes favoritos
            </h3>
            <p style={{ color: "#4A4F45", margin: "0 0 1.5rem", fontSize: "0.92rem", lineHeight: 1.5 }}>
              Toca el corazón en cualquier producto para guardarlo aquí.
            </p>
            <Link href="/productos" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.95rem 1.75rem", background: "#4A5D3A", color: "#F7F1E5", borderRadius: 100, textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>
              Explorar productos →
            </Link>
          </div>
        ) : (
          <ResponsiveGrid>
            {favorites.map(p => <HomeProductCard key={p.id} product={p} />)}
          </ResponsiveGrid>
        )}
      </div>
    </main>
  );
}
