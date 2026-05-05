"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { saveCart } from "@/lib/cart";

function GraciasContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "";

  useEffect(() => {
    saveCart([]);
    window.dispatchEvent(new Event("igs-cart-updated"));
  }, []);

  return (
    <main style={{ minHeight: "calc(100vh - 200px)", background: "#F7F1E5", padding: "3rem 1.5rem", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>
      <div style={{ maxWidth: 540, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🌿</div>

        <h1 style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: "clamp(2rem, 5vw, 2.8rem)",
          color: "#4A5D3A",
          fontWeight: 400,
          margin: "0 0 1rem",
          lineHeight: 1.1,
        }}>
          ¡Gracias por tu <em style={{ color: "#C97B5C" }}>compra</em>!
        </h1>

        <p style={{ fontSize: "1.05rem", color: "#4A4F45", marginBottom: "2rem", lineHeight: 1.6 }}>
          Tu pedido fue recibido y muy pronto empezaremos a prepararlo con cariño.
        </p>

        {orderNumber && (
          <div style={{ background: "#FDFAF3", borderRadius: 20, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.78rem", color: "#C97B5C", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.4rem", fontWeight: 600 }}>
              Tu número de pedido
            </p>
            <p style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "1.6rem",
              color: "#4A5D3A",
              margin: "0 0 1rem",
              fontWeight: 500,
            }}>
              {orderNumber}
            </p>
            <p style={{ fontSize: "0.85rem", color: "#4A4F45", margin: 0 }}>
              Guárdalo para hacer seguimiento de tu pedido en cualquier momento.
            </p>
          </div>
        )}

        <div style={{ background: "#4A5D3A", borderRadius: 18, padding: "1.5rem", color: "#F7F1E5", marginBottom: "2rem", textAlign: "left" }}>
          <p style={{ fontSize: "0.78rem", color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.85rem", fontWeight: 600 }}>
            ¿Qué sigue?
          </p>
          {[
            { num: "1", text: "Recibirás un email de confirmación con todos los detalles" },
            { num: "2", text: "Preparamos tu pedido con cariño en menos de 24 horas" },
            { num: "3", text: "Te contactaremos por WhatsApp para coordinar la entrega" },
          ].map(s => (
            <div key={s.num} style={{ display: "flex", gap: "0.85rem", padding: "0.5rem 0", alignItems: "flex-start" }}>
              <div style={{
                width: 28, height: 28,
                borderRadius: "50%",
                background: "#C9A96E",
                color: "#2A2E26",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.85rem",
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {s.num}
              </div>
              <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.5, paddingTop: "0.2rem" }}>{s.text}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          {orderNumber && (
            <Link href={"/pedido/" + orderNumber} style={{
              padding: "1rem 1.75rem",
              background: "#4A5D3A",
              color: "#F7F1E5",
              borderRadius: 100,
              textDecoration: "none",
              fontSize: "0.92rem",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              Ver estado de mi pedido →
            </Link>
          )}
          <Link href="/products" style={{
            padding: "1rem 1.75rem",
            background: "transparent",
            color: "#4A5D3A",
            border: "1px solid #4A5D3A",
            borderRadius: 100,
            textDecoration: "none",
            fontSize: "0.92rem",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}>
            Seguir comprando
          </Link>
        </div>

        <p style={{ marginTop: "2.5rem", fontSize: "0.85rem", color: "#4A4F45" }}>
          ¿Tienes preguntas? <a href="https://wa.me/573054223600" style={{ color: "#C97B5C", fontWeight: 600 }}>Escríbenos por WhatsApp</a>
        </p>
      </div>
    </main>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={<div style={{ padding: "3rem", textAlign: "center" }}>Cargando...</div>}>
      <GraciasContent />
    </Suspense>
  );
}
