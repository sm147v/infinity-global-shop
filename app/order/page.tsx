"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MiPedidoPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function search() {
    const trimmed = orderNumber.trim().toUpperCase();
    if (!trimmed) {
      setError("Ingresa tu número de pedido");
      return;
    }
    router.push(`/order/${trimmed}`);
  }

  return (
    <main style={{ minHeight: "calc(100vh - 200px)", background: "#F7F1E5", padding: "3rem 1.5rem", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📦</div>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "2rem", color: "#4A5D3A", fontWeight: 400, margin: "0 0 0.5rem" }}>
            Sigue tu <em style={{ color: "#C97B5C" }}>pedido</em>
          </h1>
          <p style={{ color: "#4A4F45", fontSize: "0.95rem" }}>
            Ingresa el número que recibiste por email o WhatsApp
          </p>
        </div>

        <div style={{ background: "#FDFAF3", borderRadius: 20, padding: "2rem 1.5rem", border: "1px solid #EDE3CD" }}>
          <input
            type="text"
            placeholder="IGS-2026-XXXXXX"
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            style={{
              width: "100%",
              padding: "1.1rem 1.25rem",
              borderRadius: 100,
              border: "1px solid #EDE3CD",
              fontSize: "1rem",
              marginBottom: "1rem",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              textAlign: "center",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          />
          {error && <p style={{ color: "#C9533D", fontSize: "0.85rem", textAlign: "center", margin: "0 0 1rem" }}>{error}</p>}
          <button onClick={search} style={{
            width: "100%",
            background: "#4A5D3A",
            color: "#F7F1E5",
            border: "none",
            padding: "1.1rem",
            borderRadius: 100,
            fontSize: "0.95rem",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}>
            Buscar mi pedido
          </button>

          <p style={{ marginTop: "1.5rem", fontSize: "0.78rem", color: "#4A4F45", textAlign: "center" }}>
            ¿No encuentras tu número? <a href="https://wa.me/573054223600" style={{ color: "#C97B5C", fontWeight: 600 }}>Escríbenos por WhatsApp</a>
          </p>
        </div>
      </div>
    </main>
  );
}
