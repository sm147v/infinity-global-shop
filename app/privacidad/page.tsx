export const metadata = {
  title: "Política de privacidad",
  description: "Cómo Infinity Global Shop recolecta, usa y protege tus datos personales conforme a la Ley 1581 de 2012 (Habeas Data).",
};

const card = { background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1rem" } as const;
const h3 = { fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 0.75rem" } as const;
const p = { color: "#4A4F45", lineHeight: 1.7, fontSize: "0.92rem", margin: "0 0 0.6rem" } as const;
const strong = { color: "#4A5D3A" } as const;

export default function PrivacidadPage() {
  return (
    <main style={{ background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif", padding: "2.5rem 1.5rem 3rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#A85A3C", display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ width: 20, height: 1, background: "#A85A3C" }} />
            Tus datos protegidos
          </span>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#4A5D3A", fontWeight: 400, lineHeight: 1.1, margin: "0 0 0.5rem" }}>
            Política de <em style={{ color: "#A85A3C" }}>privacidad</em>
          </h1>
          <p style={{ color: "#4A4F45", fontSize: "0.85rem", margin: 0, opacity: 0.8 }}>Última actualización: junio de 2026</p>
        </div>

        <div style={card}>
          <h3 style={h3}>1. Responsable del tratamiento</h3>
          <p style={p}>Infinity Global Shop es una tienda en línea operada como persona natural comerciante, con domicilio en Medellín, Colombia. Responsable del tratamiento de datos: <strong style={strong}>Samuel Villa Mejía</strong>.</p>
          <p style={{ ...p, margin: 0 }}>Correo de contacto para asuntos de datos personales: <strong style={strong}>contacto@infinityglobalshop.com</strong> · WhatsApp: +57 305 422 3600.</p>
        </div>

        <div style={card}>
          <h3 style={h3}>2. Datos que recolectamos</h3>
          <p style={{ ...p, margin: 0 }}>Recolectamos los datos que nos entregas al comprar o contactarnos: nombre, número de contacto, correo electrónico, dirección de entrega y los datos necesarios para procesar tu pago. Los datos de tarjetas son procesados directamente por nuestra pasarela de pagos (Wompi); nosotros no almacenamos números de tarjeta.</p>
        </div>

        <div style={card}>
          <h3 style={h3}>3. Para qué usamos tus datos</h3>
          <p style={{ ...p, margin: 0 }}>Usamos tus datos para procesar y entregar tus pedidos, brindarte soporte, gestionar devoluciones, emitir comprobantes y, solo si lo autorizas, enviarte novedades y promociones. No vendemos tus datos a terceros.</p>
        </div>

        <div style={card}>
          <h3 style={h3}>4. Con quién compartimos tus datos</h3>
          <p style={{ ...p, margin: 0 }}>Compartimos únicamente lo necesario con: la pasarela de pagos (Wompi) para procesar tus transacciones, y el servicio de mensajería o transportadora para entregar tu pedido. También usamos herramientas de analítica web (Google Analytics) que recopilan datos de navegación de forma anónima.</p>
        </div>

        <div style={card}>
          <h3 style={h3}>5. Tus derechos (Ley 1581 de 2012)</h3>
          <p style={p}>Como titular de tus datos tienes derecho a conocer, actualizar, rectificar y suprimir tu información, así como a revocar la autorización otorgada. Para ejercer cualquiera de estos derechos, escríbenos a <strong style={strong}>contacto@infinityglobalshop.com</strong> y atenderemos tu solicitud conforme a la ley.</p>
          <p style={{ ...p, margin: 0 }}>Conservamos tus datos solo mientras sean necesarios para las finalidades descritas o mientras lo exija la ley.</p>
        </div>

        <div style={card}>
          <h3 style={h3}>6. Seguridad y cookies</h3>
          <p style={p}>Aplicamos medidas razonables para proteger tu información y todo el sitio opera bajo conexión segura (SSL). Nuestro sitio usa cookies para mejorar tu experiencia de navegación y medir el rendimiento; puedes desactivarlas desde tu navegador.</p>
          <p style={{ ...p, margin: 0 }}>Esta política puede actualizarse; publicaremos la versión vigente en esta misma página. Para cualquier duda, contáctanos.</p>
        </div>
      </div>
    </main>
  );
}
