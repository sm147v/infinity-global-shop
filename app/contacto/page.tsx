export const metadata = {
  title: "Contacto",
  description: "Contáctanos por WhatsApp o correo. Atención personal de Infinity Global Shop en Medellín, Colombia.",
};

export default function ContactoPage() {
  const card = { background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD" } as const;
  return (
    <main style={{ background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif", padding: "2.5rem 1.5rem 3rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#A85A3C", display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ width: 20, height: 1, background: "#A85A3C" }} />
            Estamos para ayudarte
          </span>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#4A5D3A", fontWeight: 400, lineHeight: 1.1, margin: "0 0 0.75rem" }}>
            <em style={{ color: "#A85A3C" }}>Contáctanos</em>
          </h1>
          <p style={{ color: "#4A4F45", fontSize: "0.95rem", lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
            No somos un call center. Cada mensaje lo atendemos personalmente. Escríbenos por el medio que prefieras y te respondemos lo antes posible.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem", marginBottom: "1rem" }}>
          <a href="https://wa.me/573054223600?text=Hola%21%20Vengo%20de%20la%20p%C3%A1gina%20de%20contacto%20de%20Infinity%20Global%20Shop" style={{ ...card, textDecoration: "none", display: "block" }}>
            <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 0.4rem" }}>💬 WhatsApp</h3>
            <p style={{ color: "#4A4F45", fontSize: "0.95rem", margin: 0 }}>+57 305 422 3600 — la forma más rápida de hablar con nosotros.</p>
          </a>
          <a href="mailto:contacto@infinityglobalshop.com" style={{ ...card, textDecoration: "none", display: "block" }}>
            <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 0.4rem" }}>✉️ Correo</h3>
            <p style={{ color: "#4A4F45", fontSize: "0.95rem", margin: 0 }}>contacto@infinityglobalshop.com</p>
          </a>
        </div>

        <div style={card}>
          <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 0.75rem" }}>📍 Información del negocio</h3>
          <p style={{ color: "#4A4F45", lineHeight: 1.8, fontSize: "0.92rem", margin: 0 }}>
            Infinity Global Shop — tienda en línea operada como persona natural comerciante.<br />
            Medellín, Colombia · Entrega a domicilio en el área metropolitana.<br />
            Horario de atención: lunes a sábado, 9:00 a.m. – 7:00 p.m.
          </p>
        </div>
      </div>
    </main>
  );
}
