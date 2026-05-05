"use client";

import { Truck, ShieldCheck, MessageCircle, Sparkles } from "lucide-react";

const features = [
  { icon: Truck, title: "Envío 24h", desc: "En toda Medellín, sin excusas." },
  { icon: ShieldCheck, title: "Pago seguro", desc: "Wompi, Visa, PSE, Nequi." },
  { icon: MessageCircle, title: "Soporte directo", desc: "Por WhatsApp todo el día." },
  { icon: Sparkles, title: "100% originales", desc: "Importados directamente." },
];

export function FeaturesSection() {
  return (
    <section style={{ padding: "3rem 1.5rem", background: "#4A5D3A", color: "#F7F1E5", textAlign: "center" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 400, marginBottom: "0.5rem", lineHeight: 1.2 }}>
          Tu <em style={{ color: "#C9A96E", fontStyle: "italic", fontWeight: 300 }}>tranquilidad</em><br />es nuestro compromiso
        </h2>
        <p style={{ fontSize: "0.95rem", opacity: 0.85, marginBottom: "2rem", maxWidth: "560px", margin: "0 auto 2rem" }}>
          Compra fácil, envío rápido, productos de confianza.
        </p>

        <div className="trust-grid">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201, 169, 110, 0.2)", padding: "1.5rem 1.25rem", borderRadius: 14, textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(201, 169, 110, 0.15)", border: "1px solid rgba(201, 169, 110, 0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "0.85rem" }}>
                <Icon size={22} strokeWidth={1.75} color="#C9A96E" aria-hidden="true" />
              </div>
              <h4 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1rem", fontWeight: 500, marginBottom: "0.35rem", color: "#F7F1E5" }}>{title}</h4>
              <p style={{ fontSize: "0.8rem", opacity: 0.75, lineHeight: 1.5, margin: 0, color: "#F7F1E5" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .trust-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; max-width: 880px; margin: 0 auto; }
        @media (min-width: 1024px) {
          .trust-grid { grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
        }
      `}</style>
    </section>
  );
}
