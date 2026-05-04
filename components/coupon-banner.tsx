"use client";

import { useState } from "react";

export function CouponBanner({ code = "BIENVENIDA10", description = "10% de descuento en tu primera compra" }: { code?: string; description?: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #C97B5C 0%, #A85E42 100%)",
      color: "#F7F1E5",
      padding: "1.5rem",
      borderRadius: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "1rem",
      maxWidth: 720,
      margin: "0 auto",
    }}>
      <div>
        <p style={{ fontSize: "0.7rem", color: "#F7F1E5", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.4rem", opacity: 0.85 }}>
          🎉 Cupón especial
        </p>
        <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.15rem", margin: 0, lineHeight: 1.3, fontWeight: 500 }}>
          {description}
        </p>
      </div>
      <button onClick={copy} style={{
        background: "#F7F1E5",
        color: "#4A5D3A",
        border: "none",
        padding: "0.85rem 1.25rem",
        borderRadius: 100,
        fontSize: "0.95rem",
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "monospace",
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
      }}>
        {copied ? "✓ ¡Copiado!" : code + " 📋"}
      </button>
    </div>
  );
}
