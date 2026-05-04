"use client";

import { useState, useEffect, useMemo } from "react";
import { HomeProductCard } from "./home-product-card";
import { ResponsiveGrid } from "./responsive-grid";
import { useSearchParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  category: string;
}

const CATEGORY_EMOJI: Record<string, string> = {
  "Vitaminas": "💊",
  "Belleza": "💄",
  "Cabello": "💆",
  "Salud": "🩹",
  "Hogar": "🏠",
  "Herramientas": "🔧",
  "Más productos": "✨",
  "General": "🌿",
};

export function ProductsClient({ products, categories }: { products: Product[]; categories: string[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const q = searchParams?.get("q");
    if (q) setSearch(q);
    const cat = searchParams?.get("category");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "ALL") {
      list = list.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, activeCategory, search]);

  return (
    <div style={{ background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif", paddingBottom: "3rem" }}>

      <section style={{ padding: "2rem 1.5rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.7rem",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "#C97B5C",
          marginBottom: "0.75rem",
        }}>
          <span style={{ width: 20, height: 1, background: "#C97B5C" }} />
          Catálogo curado
        </div>

        <h1 style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: "clamp(1.85rem, 4vw, 2.8rem)",
          lineHeight: 1.1,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: "#4A5D3A",
          marginBottom: "0.75rem",
        }}>
          Todos nuestros <em style={{ fontStyle: "italic", fontWeight: 300, color: "#C97B5C" }}>productos</em>
        </h1>

        <p style={{ fontSize: "0.95rem", color: "#4A4F45", maxWidth: "560px", marginBottom: "1.5rem" }}>
          {products.length} productos importados desde EE.UU., con stock disponible y entrega rápida en Medellín.
        </p>

        <div style={{ position: "relative", marginBottom: "1.25rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A4F45" strokeWidth="2" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}>
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.95rem 1rem 0.95rem 3rem",
              borderRadius: 100,
              border: "1px solid #EDE3CD",
              background: "#FDFAF3",
              fontSize: "0.95rem",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              color: "#4A5D3A",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
          <button
            onClick={() => setActiveCategory("ALL")}
            style={{
              flexShrink: 0,
              padding: "0.6rem 1.2rem",
              background: activeCategory === "ALL" ? "#4A5D3A" : "#FDFAF3",
              color: activeCategory === "ALL" ? "#F7F1E5" : "#4A4F45",
              border: "1px solid " + (activeCategory === "ALL" ? "#4A5D3A" : "#EDE3CD"),
              borderRadius: 100,
              fontSize: "0.85rem",
              fontWeight: activeCategory === "ALL" ? 600 : 400,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            Todos ({products.length})
          </button>
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            const active = activeCategory === cat;
            const emoji = CATEGORY_EMOJI[cat] || "🌿";
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0,
                  padding: "0.6rem 1.2rem",
                  background: active ? "#4A5D3A" : "#FDFAF3",
                  color: active ? "#F7F1E5" : "#4A4F45",
                  border: "1px solid " + (active ? "#4A5D3A" : "#EDE3CD"),
                  borderRadius: 100,
                  fontSize: "0.85rem",
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                {emoji} {cat} ({count})
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ padding: "0 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        {filtered.length === 0 ? (
          <div style={{
            background: "#FDFAF3",
            borderRadius: 18,
            padding: "3rem 2rem",
            border: "1px solid #EDE3CD",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🌿</div>
            <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: "#4A5D3A", margin: "0 0 0.5rem", fontWeight: 500 }}>
              No encontramos productos
            </h3>
            <p style={{ color: "#4A4F45", fontSize: "0.9rem", margin: 0 }}>
              Prueba con otra categoría o búsqueda
            </p>
          </div>
        ) : (
          <>
            <p style={{ color: "#4A4F45", fontSize: "0.85rem", marginBottom: "1rem" }}>
              Mostrando {filtered.length} de {products.length} productos
            </p>
            <ResponsiveGrid>
              {filtered.map((product) => (
                <HomeProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </ResponsiveGrid>
          </>
        )}
      </section>

    </div>
  );
}
