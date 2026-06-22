"use client";

import { useEffect, useState } from "react";
import { ReviewForm } from "./review-form";

interface Props {
  productId: number;
  productName: string;
}

interface ApiReview {
  id: number;
  customerName: string;
  comment: string;
  rating: number;
  location?: string | null;
  orderNumber?: string | null;
  createdAt: string;
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
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch("/api/reviews?productId=" + productId)
      .then(r => r.json())
      .then(data => setReviews(data.reviews || []))
      .catch(() => { /* silencioso */ });
  }, [productId, refresh]);

  const total = reviews.length;
  const avgRating = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;

  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => { distribution[r.rating] = (distribution[r.rating] || 0) + 1; });

  return (
    <section id="reviews" style={{ marginTop: "4rem", scrollMarginTop: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#A85A3C", marginBottom: "0.5rem", display: "block" }}>— Lo que opinan</span>
        <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.6rem", color: "#4A5D3A", fontWeight: 400, margin: 0 }}>
          Reseñas <em style={{ color: "#A85A3C" }}>de clientes</em>
        </h2>
      </div>

      {total > 0 ? (
        <div style={{ background: "#FDFAF3", borderRadius: 20, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", minWidth: 120 }}>
            <div style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "3rem", color: "#4A5D3A", fontWeight: 600, lineHeight: 1 }}>
              {avgRating.toFixed(1)}
            </div>
            <div style={{ marginTop: "0.4rem" }}>{renderStars(avgRating, 18)}</div>
            <div style={{ fontSize: "0.78rem", color: "#4A4F45", marginTop: "0.4rem" }}>
              {total} {total === 1 ? "reseña" : "reseñas"}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            {[5, 4, 3, 2, 1].map(stars => {
              const pct = total > 0 ? Math.round((distribution[stars] / total) * 100) : 0;
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
      ) : (
        <div style={{ background: "#FDFAF3", borderRadius: 20, padding: "1.75rem", border: "1px solid #EDE3CD", marginBottom: "1.5rem", textAlign: "center" }}>
          <div style={{ marginBottom: "0.5rem" }}>{renderStars(0, 18)}</div>
          <p style={{ fontSize: "0.95rem", color: "#4A4F45", margin: 0, lineHeight: 1.5 }}>
            Este producto aún no tiene reseñas. Si ya lo compraste, <strong style={{ color: "#4A5D3A" }}>sé el primero en opinar</strong> 🌿
          </p>
        </div>
      )}

      <div style={{ marginBottom: "1.5rem" }}>
        <ReviewForm productId={productId} productName={productName} onSubmitted={() => setRefresh(r => r + 1)} />
      </div>

      {total > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }} className="reviews-list">
          {reviews.slice(0, 6).map((r) => {
            const verified = !!r.orderNumber;
            return (
              <div key={r.id} style={{ background: "#FDFAF3", borderRadius: 18, padding: "1.25rem", border: "1px solid #EDE3CD", position: "relative" }}>
                {verified && (
                  <span style={{ position: "absolute", top: 12, right: 12, fontSize: "0.65rem", padding: "0.2rem 0.5rem", borderRadius: 100, background: "rgba(92,138,94,0.15)", color: "#5C8A5E", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    ✓ Verificada
                  </span>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #A85A3C, #C9A96E)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1rem", fontWeight: 600 }}>
                    {(r.customerName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#4A5D3A" }}>{r.customerName}</div>
                    <div style={{ fontSize: "0.72rem", color: "#4A4F45" }}>
                      {verified ? "Compra verificada" : "Cliente"}{r.location ? " · " + r.location : ""}
                    </div>
                  </div>
                  {renderStars(r.rating, 13)}
                </div>
                <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "0.95rem", color: "#4A5D3A", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      )}

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
