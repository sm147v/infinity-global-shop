"use client";

import { useState } from "react";

interface AppliedCoupon {
  code: string;
  description: string | null;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  value: number;
  discount: number;
  freeShipping: boolean;
}

interface Props {
  subtotal: number;
  appliedCoupon: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon | null) => void;
}

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");

export function CouponInput({ subtotal, appliedCoupon, onApply }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function applyCoupon() {
    setError("");
    if (!code.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        onApply(data.coupon);
        setCode("");
        setIsOpen(false);
      } else {
        setError(data.error || "Cupón inválido");
      }
    } catch {
      setError("Error de conexión");
    }
    setLoading(false);
  }

  function removeCoupon() {
    onApply(null);
    setError("");
  }

  if (appliedCoupon) {
    return (
      <div style={{
        background: "rgba(92,138,94,0.1)",
        border: "1px solid rgba(92,138,94,0.3)",
        borderRadius: 14,
        padding: "0.85rem 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "0.78rem", color: "#5C8A5E", fontWeight: 600, margin: "0 0 0.2rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            ✅ Cupón aplicado: <strong style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}>{appliedCoupon.code}</strong>
          </p>
          <p style={{ fontSize: "0.78rem", color: "#4A4F45", margin: 0 }}>
            {appliedCoupon.freeShipping ? "🚚 Envío gratis" : "Ahorras " + fmt(appliedCoupon.discount)}
          </p>
        </div>
        <button onClick={removeCoupon} style={{
          background: "transparent",
          border: "1px solid rgba(201,83,61,0.3)",
          color: "#C9533D",
          padding: "0.4rem 0.85rem",
          borderRadius: 100,
          fontSize: "0.75rem",
          cursor: "pointer",
          fontFamily: "inherit",
          flexShrink: 0,
        }}>
          Quitar
        </button>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} style={{
        width: "100%",
        background: "transparent",
        border: "1px dashed #C97B5C",
        color: "#C97B5C",
        padding: "0.85rem",
        borderRadius: 14,
        fontSize: "0.88rem",
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}>
        🎟️ ¿Tienes un cupón de descuento?
      </button>
    );
  }

  return (
    <div style={{ background: "#F7F1E5", borderRadius: 14, padding: "0.85rem", border: "1px solid #EDE3CD" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
        <p style={{ fontSize: "0.85rem", color: "#4A5D3A", fontWeight: 600, margin: 0 }}>
          Aplica tu cupón
        </p>
        <button onClick={() => { setIsOpen(false); setError(""); }} style={{
          background: "transparent",
          border: "none",
          color: "#4A4F45",
          cursor: "pointer",
          fontSize: "0.85rem",
        }}>
          Cancelar
        </button>
      </div>

      <div style={{ display: "flex", gap: "0.4rem" }}>
        <input
          type="text"
          placeholder="Ej: BIENVENIDA10"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && applyCoupon()}
          autoFocus
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: 100,
            border: "1px solid #EDE3CD",
            background: "#FDFAF3",
            fontSize: "0.85rem",
            outline: "none",
            fontFamily: "monospace",
            letterSpacing: "0.05em",
            color: "#4A5D3A",
            textTransform: "uppercase",
          }}
        />
        <button onClick={applyCoupon} disabled={loading || !code.trim()} style={{
          background: "#4A5D3A",
          color: "#F7F1E5",
          border: "none",
          padding: "0 1.25rem",
          borderRadius: 100,
          fontSize: "0.85rem",
          fontWeight: 500,
          cursor: loading ? "wait" : "pointer",
          opacity: loading || !code.trim() ? 0.6 : 1,
          fontFamily: "inherit",
          whiteSpace: "nowrap",
        }}>
          {loading ? "..." : "Aplicar"}
        </button>
      </div>

      {error && (
        <p style={{ color: "#C9533D", fontSize: "0.78rem", margin: "0.5rem 0 0" }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
