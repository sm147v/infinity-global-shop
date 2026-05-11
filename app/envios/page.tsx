
export const metadata = {
  title: "Política de envíos · Infinity Global Shop",
  description: "Conoce nuestra política de envíos, tiempos de entrega y costos para pedidos en Medellín y Colombia.",
};

export default function EnviosPage() {
  return (
    <main style={{ background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif", padding: "2.5rem 1.5rem 3rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        <div style={{ marginBottom: "2rem" }}>
          <span style={{
            fontSize: "0.7rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#C97B5C",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}>
            <span style={{ width: 20, height: 1, background: "#C97B5C" }} />
            Información de envío
          </span>

          <h1 style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#4A5D3A",
            fontWeight: 400,
            lineHeight: 1.1,
            margin: "0 0 1rem",
          }}>
            Política de <em style={{ color: "#C97B5C" }}>envíos</em>
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "#4A5D3A", borderRadius: 18, padding: "1.25rem", color: "#F7F1E5", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🚚</div>
            <p style={{ fontSize: "0.7rem", color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.3rem", fontWeight: 600 }}>Envío</p>
            <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.4rem", margin: 0, fontWeight: 500 }}>$8.000</p>
          </div>
          <div style={{ background: "#C97B5C", borderRadius: 18, padding: "1.25rem", color: "#F7F1E5", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✨</div>
            <p style={{ fontSize: "0.7rem", color: "#FDFAF3", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.3rem", fontWeight: 600 }}>Gratis desde</p>
            <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.4rem", margin: 0, fontWeight: 500 }}>$150.000</p>
          </div>
        </div>

        <div style={{ background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1rem" }}>
          <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 1rem" }}>
            🌎 Zonas de cobertura
          </h3>
          <p style={{ color: "#4A4F45", lineHeight: 1.7, fontSize: "0.95rem", margin: "0 0 0.85rem" }}>
            <strong style={{ color: "#4A5D3A" }}>Actualmente entregamos en toda el área metropolitana de Medellín:</strong>
          </p>
          <p style={{ color: "#4A4F45", lineHeight: 1.7, fontSize: "0.9rem", margin: 0 }}>
            Medellín · Envigado · Itagüí · Sabaneta · La Estrella · Bello · Caldas · Copacabana · Girardota · Barbosa
          </p>
          <p style={{ color: "#C97B5C", fontSize: "0.85rem", marginTop: "0.85rem", fontWeight: 500 }}>
            🚛 ¿Estás fuera del área metropolitana? Escríbenos por WhatsApp para coordinar envíos especiales.
          </p>
        </div>

        <div style={{ background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1rem" }}>
          <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 1rem" }}>
            ⏰ Tiempos de entrega
          </h3>
          {[
            { time: "24 horas", desc: "Pedidos confirmados antes de las 5 PM se entregan al día siguiente." },
            { time: "Mismo día", desc: "Para pedidos urgentes en zonas centrales, escríbenos por WhatsApp." },
            { time: "48 horas", desc: "Pedidos hechos el viernes después de las 5 PM se entregan el lunes." },
          ].map(item => (
            <div key={item.time} style={{ padding: "0.85rem 0", borderBottom: "1px solid #EDE3CD" }}>
              <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1rem", color: "#C97B5C", fontWeight: 600, margin: "0 0 0.3rem" }}>{item.time}</p>
              <p style={{ color: "#4A4F45", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1rem" }}>
          <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 1rem" }}>
            📦 Cómo funciona el envío
          </h3>
          {[
            { num: "1", title: "Confirmas tu pedido", desc: "Realizas el pago seguro con Wompi (tarjeta, PSE, Nequi)." },
            { num: "2", title: "Te confirmamos por WhatsApp", desc: "Recibes mensaje con el tiempo estimado y los detalles." },
            { num: "3", title: "Empacamos con cariño", desc: "Cada pedido se prepara y verifica para que llegue perfecto." },
            { num: "4", title: "Entrega a tu puerta", desc: "Nuestro mensajero te entrega y recibe el pago contra entrega o virtual." },
          ].map(item => (
            <div key={item.num} style={{ display: "flex", gap: "0.85rem", padding: "0.6rem 0", alignItems: "flex-start" }}>
              <div style={{
                width: 30, height: 30,
                borderRadius: "50%",
                background: "#4A5D3A",
                color: "#F7F1E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.85rem",
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {item.num}
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "#4A5D3A", margin: "0 0 0.2rem", fontSize: "0.95rem" }}>{item.title}</p>
                <p style={{ color: "#4A4F45", fontSize: "0.85rem", margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.5rem" }}>
          <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 0.85rem" }}>
            💳 Métodos de pago
          </h3>
          <p style={{ color: "#4A4F45", lineHeight: 1.6, fontSize: "0.92rem", margin: "0 0 0.5rem" }}>
            Aceptamos pagos seguros vía Wompi:
          </p>
          <ul style={{ color: "#4A4F45", lineHeight: 1.8, fontSize: "0.9rem", margin: 0, paddingLeft: "1.25rem" }}>
            <li>Tarjeta de crédito (Visa, Mastercard, American Express)</li>
            <li>Tarjeta débito</li>
            <li>PSE (todos los bancos colombianos)</li>
            <li>Nequi</li>
            <li>Bancolombia QR</li>
          </ul>
        </div>

        <div style={{ background: "#EDE3CD", borderRadius: 18, padding: "1.5rem", textAlign: "center" }}>
          <p style={{ color: "#4A4F45", marginBottom: "0.85rem", fontSize: "0.95rem" }}>
            ¿Tienes dudas sobre tu envío?
          </p>
          <a href="https://wa.me/573054223600" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#25D366",
            color: "white",
            padding: "0.95rem 1.5rem",
            borderRadius: 100,
            textDecoration: "none",
            fontSize: "0.92rem",
            fontWeight: 600,
          }}>
            💬 Escríbenos por WhatsApp
          </a>
        </div>

      </div>
    </main>
  );
}
