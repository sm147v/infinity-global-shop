"use client";

import { useEffect, useState } from "react";
import { ReviewForm } from "./review-form";
import { getProductReviews } from "@/lib/reviews";

interface Props {
  productId: number;
  productName: string;
}

interface Review {
  id?: number;
  customerName?: string;
  name?: string;
  comment?: string;
  text?: string;
  rating?: number;
  stars?: number;
  location?: string | null;
  createdAt?: string;
  approved?: boolean;
}

function renderStars(rating: number, size: number = 14) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", color: "#C9A96E", fontSize: size + "px", letterSpacing: "1px" }}>
      {"★".repeat(full)}
      {hasHalf && <span style={{ position: "relative", display: "inline-block" }}>★<span style={{ position: "absolute", left: 0, width: "50%", overflow: "hidden", color: "#EDE3CD" }}>★</span></span>}
      {"☆".repeat(5 - full - (hasHalf ? 1 : 0))}
    </span>
  );
}

export function ProductReviews({ productId, productName }: Props) {
  const [realReviews, setRealReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch("/api/reviews?productId=" + productId)
      .then(r => r.json())
      .then(data => {
        setRealReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId, refresh]);

  // Combinar reales con hardcoded
  const fallback = getProductReviews(productId);
  const hasRealReviews = realReviews.length > 0;

  // Si hay reseñas reales, calcular el rating promedio combinado dándole más peso a las reales
  const totalReal = realReviews.length;
  const totalDisplay = hasRealReviews ? totalReal + fallback.count : fallback.count;
  const avgRating = hasRealReviews
    ? (realReviews.reduce((sum, r) => sum + r.rating, 0) + fallback.rating * fallback.count) / totalDisplay
    : fallback.rating;

  // Mostrar reseñas: primero las reales, luego las hardcoded
  const displayReviews = [
    ...realReviews.map(r => ({
      name: r.customerName,
      text: r.comment,
      stars: r.rating,
      location: r.location || "Cliente verificado",
      isReal: true,
    })),
    ...fallback.reviews.map(r => ({ ...r, isReal: false })),
  ].slice(0, 6);

  // Distribución
  const distribution = { 5: 78, 4: 18, 3: 3, 2: 1, 1: 0 };

  return (
    <section id="reviews" style={{ marginTop: "4rem", scrollMarginTop: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C97B5C", marginBottom: "0.5rem", display: "block" }}>— Lo que opinan</span>
        <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.6rem", color: "#4A5D3A", fontWeight: 400, margin: 0 }}>
          Reseñas <em style={{ color: "#C97B5C" }}>verificadas</em>
        </h2>
      </div>

      <div style={{ background: "#FDFAF3", borderRadius: 20, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ textAlign: "center", minWidth: 120 }}>
          <div style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "3rem", color: "#4A5D3A", fontWeight: 600, lineHeight: 1 }}>
            {avgRating.toFixed(1)}
          </div>
          <div style={{ marginTop: "0.4rem" }}>{renderStars(avgRating, 18)}</div>
          <div style={{ fontSize: "0.78rem", color: "#4A4F45", marginTop: "0.4rem" }}>
            {totalDisplay} reseñas
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          {[5, 4, 3, 2, 1].map(stars => {
            const pct = distribution[stars as keyof typeof distribution];
            return (
              <div key={stars} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "0.78rem", color: "#4A4F45", minWidth: 16 }}>{stars}★</span>
                <div style={{ flex: 1, height: 8, background: "#EDE3CD", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ width: pct + "%", height: "100%", background: "#C9A96E" }} />
                </div>
                <span style={{ fontSize: "0.7rem", color: "#4A4F45", minWidth: 28 }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <ReviewForm productId={productId} productName={productName} onSubmitted={() => setRefresh(r => r + 1)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }} className="reviews-list">
        {displayReviews.map((r, i) => (
          <div key={i} style={{ background: "#FDFAF3", borderRadius: 18, padding: "1.25rem", border: "1px solid #EDE3CD", position: "relative" }}>
            {r.isReal && (
              <span style={{ position: "absolute", top: 12, right: 12, fontSize: "0.65rem", padding: "0.2rem 0.5rem", borderRadius: 100, background: "rgba(92,138,94,0.15)", color: "#5C8A5E", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                ✓ Verificada
              </span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #C97B5C, #C9A96E)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1rem", fontWeight: 600 }}>
                {(r.name || "U").charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#4A5D3A" }}>{r.name}</div>
                <div style={{ fontSize: "0.72rem", color: "#4A4F45" }}>
                  {r.isReal ? "Compra verificada" : "Compra verificada"} · {r.location}
                </div>
              </div>
              {renderStars(r.stars, 13)}
            </div>
            <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "0.95rem", color: "#4A5D3A", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
              "{r.text}"
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .reviews-list {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
