"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, startTransition } from "react";
import { cloudinaryLoader } from "@/lib/image";

interface Product {
  id: number;
  name: string;
  price: number | string;
  image: string | null;
  category: string;
  stock: number;
  slug?: string | null;
}

interface Props {
  onClose: () => void;
  doSearch: (q?: string) => void;
  goToCategory: (cat: string) => void;
  query: string;
  setQuery: (q: string) => void;
}

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");

export function SearchModal({ onClose, doSearch, goToCategory, query, setQuery }: Props) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      startTransition(() => setResults([]));
      return;
    }
    startTransition(() => setLoading(true));
    const timer = setTimeout(() => {
      fetch("/api/products/search?q=" + encodeURIComponent(query))
        .then(r => r.json())
        .then(data => {
          setResults(data.products || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 250); // debounce 250ms

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div onClick={onClose} style={{
      position: "fixed",
      inset: 0,
      background: "rgba(42,46,38,0.65)",
      backdropFilter: "blur(8px)",
      zIndex: 200,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "4rem 1rem 1rem",
      animation: "fadeIn 0.2s",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#FDFAF3",
        borderRadius: 24,
        width: "100%",
        maxWidth: 520,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        fontFamily: "var(--font-dm-sans), Inter, sans-serif",
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        <div style={{ padding: "1.25rem 1.25rem 0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
            <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", margin: 0, fontWeight: 500 }}>
              ¿Qué buscas?
            </h3>
            <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#4A4F45" }} aria-label="Cerrar">✕</button>
          </div>

          <div style={{ position: "relative" }}>
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
                paddingRight: "3rem",
                borderRadius: 100,
                border: "1px solid #EDE3CD",
                background: "#F7F1E5",
                fontSize: "16px",
                outline: "none",
                fontFamily: "inherit",
                color: "#4A5D3A",
                boxSizing: "border-box",
              }}
            />
            {loading && (
              <span style={{ position: "absolute", right: "1.25rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.85rem", color: "#4A4F45" }}>
                ...
              </span>
            )}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem 1.25rem" }}>
          {query.trim().length < 2 ? (
            <div>
              <p style={{ fontSize: "0.72rem", color: "#4A4F45", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0.5rem 0 0.6rem", fontWeight: 600 }}>
                Categorías populares
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
                {["Vitaminas", "Belleza", "Cabello", "Salud", "Hogar"].map(cat => (
                  <button key={cat} onClick={() => goToCategory(cat)} style={{
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

              <p style={{ fontSize: "0.72rem", color: "#4A4F45", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0.5rem 0 0.6rem", fontWeight: 600 }}>
                Búsquedas sugeridas
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {["multivitamínico", "biotina", "argan", "colágeno", "melatonina"].map(s => (
                  <button key={s} onClick={() => { setQuery(s); }} style={{
                    background: "transparent",
                    border: "1px solid #EDE3CD",
                    color: "#4A4F45",
                    padding: "0.4rem 0.75rem",
                    borderRadius: 100,
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}>
                    🔍 {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔍</div>
              <p style={{ color: "#4A4F45", fontSize: "0.9rem", margin: "0 0 0.85rem" }}>
                No encontramos resultados para &ldquo;<strong>{query}</strong>&rdquo;
              </p>
              <button onClick={() => doSearch()} style={{
                background: "#4A5D3A",
                color: "#F7F1E5",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: 100,
                fontSize: "0.85rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}>
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "0.72rem", color: "#4A4F45", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0.5rem 0 0.6rem", fontWeight: 600 }}>
                {results.length} resultado{results.length !== 1 ? "s" : ""}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {results.map(p => (
                  <Link
                    key={p.id}
                    href={"/products/" + (p.slug || p.id)}
                    onClick={onClose}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.85rem",
                      padding: "0.6rem",
                      borderRadius: 14,
                      background: "#F7F1E5",
                      border: "1px solid #EDE3CD",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: 10,
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "linear-gradient(135deg, #EDE3CD, #A8B584)",
                      position: "relative",
                    }}>
                      {p.image && (
                        <Image src={p.image} alt={p.name} fill sizes="56px" style={{ objectFit: "cover" }} loader={cloudinaryLoader} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                        fontSize: "0.9rem",
                        color: "#4A5D3A",
                        margin: "0 0 0.2rem",
                        fontWeight: 500,
                        lineHeight: 1.2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {p.name}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
                        <span style={{ color: "#4A5D3A", fontWeight: 600 }}>{fmt(Number(p.price))}</span>
                        <span style={{ color: "#4A4F45", opacity: 0.6 }}>·</span>
                        <span style={{ color: "#C97B5C" }}>{p.category}</span>
                      </div>
                    </div>
                    <span style={{ color: "#4A5D3A", fontSize: "1.2rem" }}>›</span>
                  </Link>
                ))}
              </div>

              {results.length >= 8 && (
                <button onClick={() => doSearch()} style={{
                  width: "100%",
                  marginTop: "0.85rem",
                  background: "transparent",
                  color: "#4A5D3A",
                  border: "1px solid #4A5D3A",
                  padding: "0.85rem",
                  borderRadius: 100,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 500,
                }}>
                  Ver todos los resultados →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
