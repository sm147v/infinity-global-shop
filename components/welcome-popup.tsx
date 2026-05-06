"use client";

import { useEffect, useState } from "react";

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Solo mostrar una vez por usuario
    const seen = localStorage.getItem("welcome_popup_seen");
    if (!seen) {
      const timer = setTimeout(() => setIsOpen(true), 3000);
      setIsHydrated(true);
      return () => clearTimeout(timer);
    }
    setIsHydrated(true);
  }, []);

  function close() {
    localStorage.setItem("welcome_popup_seen", "1");
    setIsOpen(false);
  }

  function copyCode() {
    navigator.clipboard.writeText("BIENVENIDA10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function submitEmail() {
    if (!email.includes("@")) return;
    // Aquí podrías guardar el email en una lista si quisieras
    localStorage.setItem("subscriber_email", email);
    setSubmitted(true);
    setTimeout(() => close(), 2000);
  }

  // No renderizar hasta después de la hidratación para evitar mismatch
  if (!isHydrated || !isOpen) return null;

  return (
    <div onClick={close} style={{
      position: "fixed",
      inset: 0,
      background: "rgba(42,46,38,0.7)",
      backdropFilter: "blur(8px)",
      zIndex: 400,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      animation: "fadeIn 0.3s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#FDFAF3",
        borderRadius: 24,
        maxWidth: 440,
        width: "100%",
        position: "relative",
        overflow: "hidden",
        animation: "slideUp 0.4s ease",
        fontFamily: "var(--font-dm-sans), Inter, sans-serif",
      }}>
        <button onClick={close} aria-label="Cerrar" style={{
          position: "absolute",
          top: 12, right: 12,
          width: 36, height: 36,
          borderRadius: "50%",
          background: "rgba(247, 241, 229, 0.9)",
          border: "none",
          cursor: "pointer",
          fontSize: "1rem",
          color: "#4A5D3A",
          zIndex: 2,
          backdropFilter: "blur(4px)",
        }}>✕</button>

        <div style={{
          background: "linear-gradient(135deg, #C97B5C 0%, #A85E42 100%)",
          padding: "2.5rem 1.5rem 1.5rem",
          color: "#F7F1E5",
          textAlign: "center",
          position: "relative",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎁</div>
          <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 0.5rem", opacity: 0.9, fontWeight: 600 }}>
            Bienvenida a Infinity
          </p>
          <h2 style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "1.8rem",
            fontWeight: 400,
            margin: "0 0 0.5rem",
            lineHeight: 1.1,
          }}>
            10% de <em style={{ color: "#FDFAF3", fontStyle: "italic" }}>descuento</em><br />
            en tu primera compra
          </h2>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {!submitted ? (
            <>
              <p style={{ color: "#4A4F45", fontSize: "0.92rem", textAlign: "center", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
                Usa este código en tu próximo pedido y aprovecha el descuento especial de bienvenida.
              </p>

              <button onClick={copyCode} style={{
                width: "100%",
                background: "#4A5D3A",
                color: "#F7F1E5",
                border: "2px dashed #C9A96E",
                padding: "1rem",
                borderRadius: 14,
                fontSize: "1.3rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "monospace",
                letterSpacing: "0.1em",
                marginBottom: "1rem",
                position: "relative",
              }}>
                {copied ? "✓ ¡Código copiado!" : "BIENVENIDA10 📋"}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "1rem 0", color: "#4A4F45" }}>
                <div style={{ flex: 1, height: 1, background: "#EDE3CD" }} />
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>O</span>
                <div style={{ flex: 1, height: 1, background: "#EDE3CD" }} />
              </div>

              <p style={{ fontSize: "0.85rem", color: "#4A4F45", textAlign: "center", margin: "0 0 0.75rem" }}>
                Recíbelo por email para no perderlo:
              </p>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.85rem 1rem",
                    borderRadius: 100,
                    border: "1px solid #EDE3CD",
                    background: "#F7F1E5",
                    fontSize: "0.9rem",
                    outline: "none",
                    fontFamily: "inherit",
                    color: "#4A5D3A",
                  }}
                />
                <button onClick={submitEmail} style={{
                  background: "#C97B5C",
                  color: "white",
                  border: "none",
                  padding: "0 1.25rem",
                  borderRadius: 100,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}>
                  Recibir
                </button>
              </div>

              <p style={{ fontSize: "0.7rem", color: "#4A4F45", textAlign: "center", margin: "1rem 0 0", opacity: 0.7 }}>
                Compra mínima $80.000 · Vence en 90 días · Aplican términos
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>✨</div>
              <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: "#5C8A5E", fontSize: "1.3rem", margin: "0 0 0.5rem", fontWeight: 500 }}>
                ¡Listo!
              </h3>
              <p style={{ color: "#4A4F45", fontSize: "0.9rem", margin: 0 }}>
                Pronto recibirás tu cupón en tu correo.
              </p>
            </div>
          )}
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
