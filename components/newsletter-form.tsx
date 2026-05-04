"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function submit() {
    setError("");
    if (!email.includes("@") || email.length < 5) {
      setError("Ingresa un email válido");
      return;
    }
    // Guardar localmente (puedes integrar con Resend o Mailchimp luego)
    const existing = JSON.parse(localStorage.getItem("igs_subscribers") || "[]");
    if (!existing.includes(email)) {
      existing.push(email);
      localStorage.setItem("igs_subscribers", JSON.stringify(existing));
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
        <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "0.95rem", color: "#C9A96E", margin: 0, fontStyle: "italic" }}>
          ✨ ¡Listo! Recibirás nuestras novedades pronto.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: "0.78rem", color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.75rem", fontWeight: 600 }}>
        Recibe novedades
      </p>
      <p style={{ fontSize: "0.85rem", opacity: 0.75, margin: "0 0 0.85rem", lineHeight: 1.5 }}>
        Únete y recibe ofertas exclusivas, lanzamientos y un cupón de bienvenida.
      </p>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: 100,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            fontSize: "16px",
            outline: "none",
            fontFamily: "inherit",
            color: "#F7F1E5",
            boxSizing: "border-box",
          }}
        />
        <button onClick={submit} style={{
          background: "#C97B5C",
          color: "white",
          border: "none",
          padding: "0 1.1rem",
          borderRadius: 100,
          fontSize: "0.82rem",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
        }}>
          Suscribirme
        </button>
      </div>
      {error && (
        <p style={{ color: "#C9533D", fontSize: "0.75rem", marginTop: "0.5rem" }}>⚠️ {error}</p>
      )}
    </div>
  );
}
