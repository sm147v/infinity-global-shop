"use client";

import { useState } from "react";

interface Props {
  productId: number;
  productName?: string;
  onSubmitted?: () => void;
}

export function ReviewForm({ productId, onSubmitted }: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [comment, setComment] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function submit() {
    setError("");
    if (rating === 0) { setError("Selecciona cuántas estrellas"); return; }
    if (name.trim().length < 2) { setError("Ingresa tu nombre"); return; }
    if (comment.trim().length < 10) { setError("Cuéntanos un poco más (mínimo 10 caracteres)"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          customerName: name.trim(),
          customerEmail: email.trim() || null,
          orderNumber: orderNumber.trim() || null,
          rating,
          comment: comment.trim(),
          location: location.trim() || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        onSubmitted?.();
      } else {
        setError(data.error || "Error al enviar");
      }
    } catch {
      setError("Error de conexión");
    }
    setSubmitting(false);
  }

  if (success) {
    return (
      <div style={{ background: "rgba(92,138,94,0.1)", border: "1px solid rgba(92,138,94,0.3)", borderRadius: 18, padding: "1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✨</div>
        <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: "#5C8A5E", fontSize: "1.2rem", margin: "0 0 0.4rem", fontWeight: 500 }}>
          ¡Gracias por tu reseña!
        </h3>
        <p style={{ color: "#4A4F45", fontSize: "0.88rem", margin: 0, lineHeight: 1.5 }}>
          {orderNumber ? "Tu reseña aparecerá pronto en este producto." : "Revisaremos tu reseña y la publicaremos pronto."}
        </p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} style={{
        width: "100%",
        padding: "1rem",
        background: "transparent",
        border: "1px dashed #4A5D3A",
        color: "#4A5D3A",
        borderRadius: 14,
        fontSize: "0.9rem",
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}>
        ✏️ Escribir una reseña sobre este producto
      </button>
    );
  }

  return (
    <div style={{ background: "#FDFAF3", border: "1px solid #EDE3CD", borderRadius: 18, padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: "#4A5D3A", fontSize: "1.2rem", margin: 0, fontWeight: 500 }}>
          Tu opinión sobre este producto
        </h3>
        <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "#4A4F45", cursor: "pointer", fontSize: "1rem" }}>✕</button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Tu calificación *</label>
        <div style={{ display: "flex", gap: "0.3rem" }}>
          {[1, 2, 3, 4, 5].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              onMouseEnter={() => setHoverRating(num)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "2rem",
                color: num <= (hoverRating || rating) ? "#C9A96E" : "#EDE3CD",
                padding: 0,
                transition: "color 0.15s",
              }}
            >
              ★
            </button>
          ))}
          {rating > 0 && (
            <span style={{ marginLeft: "0.5rem", alignSelf: "center", fontSize: "0.85rem", color: "#4A5D3A", fontWeight: 600 }}>
              {rating} estrella{rating !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input placeholder="Tu nombre *" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        <input placeholder="Tu email (opcional)" type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input placeholder="Ciudad o barrio (opcional)" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
        <input placeholder="Número de pedido (IGS-2026-...) si aplica" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} style={inputStyle} />
        <textarea
          placeholder="Cuéntanos qué te pareció el producto..."
          rows={4}
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ ...inputStyle, borderRadius: 14, resize: "vertical", minHeight: 80 }}
        />
      </div>

      {error && (
        <div style={{ background: "rgba(201,83,61,0.1)", border: "1px solid rgba(201,83,61,0.3)", padding: "0.75rem", borderRadius: 12, color: "#C9533D", fontSize: "0.85rem", marginTop: "0.85rem" }}>
          ⚠️ {error}
        </div>
      )}

      <p style={{ fontSize: "0.72rem", color: "#4A4F45", marginTop: "0.85rem", lineHeight: 1.4 }}>
        💡 Si incluyes tu número de pedido, tu reseña aparecerá inmediatamente. Sin él, será revisada antes de publicarse.
      </p>

      <button onClick={submit} disabled={submitting} style={{
        width: "100%",
        background: "#4A5D3A",
        color: "#F7F1E5",
        border: "none",
        padding: "0.95rem",
        borderRadius: 100,
        fontSize: "0.92rem",
        fontWeight: 500,
        cursor: submitting ? "wait" : "pointer",
        opacity: submitting ? 0.6 : 1,
        fontFamily: "inherit",
        marginTop: "1rem",
      }}>
        {submitting ? "Enviando..." : "Enviar reseña"}
      </button>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  color: "#4A4F45",
  marginBottom: "0.4rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.85rem 1rem",
  borderRadius: 100,
  border: "1px solid #EDE3CD",
  background: "#F7F1E5",
  fontSize: "0.92rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  color: "#4A5D3A",
};
