export const metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de uso y compra en Infinity Global Shop, tienda en línea de productos importados en Medellín, Colombia.",
};

const card = { background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1rem" } as const;
const h3 = { fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 0.75rem" } as const;
const p = { color: "#4A4F45", lineHeight: 1.7, fontSize: "0.92rem", margin: "0 0 0.6rem" } as const;
const strong = { color: "#4A5D3A" } as const;

export default function TerminosPage() {
  return (
    <main style={{ background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif", padding: "2.5rem 1.5rem 3rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#A85A3C", display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ width: 20, height: 1, background: "#A85A3C" }} />
            Reglas claras
          </span>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#4A5D3A", fontWeight: 400, lineHeight: 1.1, margin: "0 0 0.5rem" }}>
            Términos y <em style={{ color: "#A85A3C" }}>condiciones</em>
          </h1>
          <p style={{ color: "#4A4F45", fontSize: "0.85rem", margin: 0, opacity: 0.8 }}>Última actualización: junio de 2026</p>
        </div>

        <div style={card}>
          <h3 style={h3}>1. Quiénes somos</h3>
          <p style={{ ...p, margin: 0 }}>Infinity Global Shop (infinityglobalshop.com) es una tienda en línea operada como persona natural comerciante, con domicilio en Medellín, Colombia. Contacto: contacto@infinityglobalshop.com · WhatsApp +57 305 422 3600.</p>
        </div>

        <div style={card}>
          <h3 style={h3}>2. Objeto y aceptación</h3>
          <p style={{ ...p, margin: 0 }}>Estos términos regulan la compra de productos a través de nuestro sitio. Al realizar un pedido, aceptas estas condiciones. Vendemos productos de salud, belleza, cuidado personal y suplementos importados, principalmente para entrega en Medellín y su área metropolitana.</p>
        </div>

        <div style={card}>
          <h3 style={h3}>3. Precios, productos y disponibilidad</h3>
          <p style={{ ...p, margin: 0 }}>Todos los precios están expresados en pesos colombianos (COP) e incluyen los impuestos aplicables. Las imágenes son ilustrativas. La disponibilidad depende del inventario; si un producto se agota tras tu compra, te contactaremos para reponerlo o reembolsarte.</p>
        </div>

        <div style={card}>
          <h3 style={h3}>4. Pagos y confirmación</h3>
          <p style={{ ...p, margin: 0 }}>Los pagos se procesan de forma segura a través de Wompi (tarjeta, PSE, Nequi, Bancolombia). Tu pedido se confirma una vez aprobado el pago y te avisamos por WhatsApp con los detalles de entrega.</p>
        </div>

        <div style={card}>
          <h3 style={h3}>5. Envíos, devoluciones y garantía</h3>
          <p style={{ ...p, margin: 0 }}>Los tiempos, costos y zonas de entrega se detallan en nuestra Política de envíos. El derecho de retracto, la garantía legal y el proceso de devolución se rigen por la Ley 1480 de 2011 y se explican en nuestra página de Cambios y devoluciones.</p>
        </div>

        <div style={card}>
          <h3 style={h3}>6. Naturaleza de los productos</h3>
          <p style={{ ...p, margin: 0 }}>Los suplementos dietarios y productos cosméticos que comercializamos no son medicamentos y no están destinados a diagnosticar, tratar, curar ni prevenir enfermedades. La información del sitio es de carácter informativo y no reemplaza la consulta con un profesional de la salud. Consulta a tu médico antes de iniciar cualquier suplemento.</p>
        </div>

        <div style={card}>
          <h3 style={h3}>7. Propiedad intelectual</h3>
          <p style={{ ...p, margin: 0 }}>Las marcas de los productos (como Nature&apos;s Bounty, Spring Valley, Vitafusion, GNC, entre otras) son propiedad de sus respectivos titulares. Infinity Global Shop las comercializa como productos importados originales y no representa ni es representante oficial de dichas marcas.</p>
        </div>

        <div style={card}>
          <h3 style={h3}>8. Ley aplicable y contacto</h3>
          <p style={{ ...p, margin: 0 }}>Estos términos se rigen por las leyes de la República de Colombia. Para cualquier consulta, reclamo o solicitud, escríbenos a contacto@infinityglobalshop.com.</p>
        </div>
      </div>
    </main>
  );
}
