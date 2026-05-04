import Link from "next/link";

export const metadata = {
  title: "Política de devoluciones · Infinity Global Shop",
  description: "Conoce nuestra política de cambios y devoluciones. Te garantizamos productos auténticos y de calidad.",
};

export default function DevolucionesPage() {
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
            Garantía total
          </span>

          <h1 style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#4A5D3A",
            fontWeight: 400,
            lineHeight: 1.1,
            margin: "0 0 1rem",
          }}>
            Cambios y <em style={{ color: "#C97B5C" }}>devoluciones</em>
          </h1>
        </div>

        <div style={{ background: "#4A5D3A", borderRadius: 24, padding: "2rem 1.5rem", color: "#F7F1E5", marginBottom: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🛡️</div>
          <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.6rem", fontWeight: 400, margin: "0 0 0.5rem" }}>
            Tu satisfacción <em style={{ color: "#C9A96E" }}>garantizada</em>
          </h2>
          <p style={{ opacity: 0.9, fontSize: "0.95rem", margin: 0, lineHeight: 1.5 }}>
            Si no estás 100% satisfecha con tu compra, te ayudamos a resolverlo.
          </p>
        </div>

        <div style={{ background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1rem" }}>
          <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 1rem" }}>
            ✅ Cuándo aceptamos devoluciones
          </h3>
          <ul style={{ color: "#4A4F45", lineHeight: 1.8, fontSize: "0.92rem", paddingLeft: "1.25rem", margin: 0 }}>
            <li>Producto llegó dañado o con defecto de fábrica</li>
            <li>Recibiste un producto distinto al que compraste</li>
            <li>El producto está vencido o cerca de vencer</li>
            <li>Empaque sellado y producto sin abrir, dentro de los primeros 5 días</li>
          </ul>
        </div>

        <div style={{ background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1rem" }}>
          <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 1rem" }}>
            ❌ Cuándo no podemos aceptar devoluciones
          </h3>
          <ul style={{ color: "#4A4F45", lineHeight: 1.8, fontSize: "0.92rem", paddingLeft: "1.25rem", margin: 0 }}>
            <li>Productos abiertos o con sellos de seguridad rotos (por temas de salud)</li>
            <li>Cremas, vitaminas o cosméticos ya usados</li>
            <li>Después de 5 días de recibido el pedido</li>
            <li>Productos personalizados o de pedido especial</li>
          </ul>
        </div>

        <div style={{ background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1rem" }}>
          <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 1rem" }}>
            🔄 Cómo solicitar una devolución
          </h3>
          {[
            { num: "1", title: "Escríbenos por WhatsApp", desc: "Cuéntanos qué pasó con tu pedido y envíanos fotos del producto." },
            { num: "2", title: "Revisamos tu caso", desc: "En menos de 24 horas te confirmamos si aplica para devolución." },
            { num: "3", title: "Coordinamos la recogida", desc: "Pasamos por el producto sin costo adicional." },
            { num: "4", title: "Recibes tu reembolso", desc: "Te devolvemos el dinero, te enviamos uno nuevo o te damos crédito en tienda." },
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

        <div style={{ background: "#EDE3CD", borderRadius: 18, padding: "1.5rem", textAlign: "center" }}>
          <p style={{ color: "#4A4F45", marginBottom: "0.85rem", fontSize: "0.95rem" }}>
            ¿Necesitas hacer una devolución?
          </p>
          <a href="https://wa.me/573054223600?text=Hola%21%20Vi%20su%20tienda%20Infinity%20Global%20Shop%20y%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20productos,%20quiero%20solicitar%20una%20devolucion%20o%20cambio" style={{
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
