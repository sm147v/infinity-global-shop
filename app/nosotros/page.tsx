import Link from "next/link";

export const metadata = {
  title: "Sobre nosotros · Infinity Global Shop",
  description:
    "Conoce la historia de Infinity Global Shop, importadores de productos de salud, belleza y bienestar desde Estados Unidos a Colombia. Calidad, transparencia y atención cercana desde Medellín.",
};

const COLORS = {
  bg: "#F7F1E5",
  card: "#FDFAF3",
  border: "#EDE3CD",
  green: "#4A5D3A",
  greenSoft: "#6B7F58",
  terracotta: "#C97B5C",
  text: "#4A4F45",
  textSoft: "#6B6F62",
};

const FONT_SERIF = "var(--font-fraunces), Georgia, serif";
const FONT_SANS = "var(--font-dm-sans), Inter, sans-serif";

export default function NosotrosPage() {
  return (
    <main
      style={{
        background: COLORS.bg,
        fontFamily: FONT_SANS,
        padding: "2.5rem 1.5rem 4rem",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* ─────────── HERO ─────────── */}
        <header style={{ marginBottom: "2.5rem" }}>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: COLORS.terracotta,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <span style={{ width: 20, height: 1, background: COLORS.terracotta }} />
            Nuestra historia
          </span>
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: COLORS.green,
              fontWeight: 400,
              lineHeight: 1.1,
              margin: "0 0 1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Sobre{" "}
            <em
              style={{
                color: COLORS.terracotta,
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              nosotros
            </em>
          </h1>
          <p
            style={{
              color: COLORS.textSoft,
              lineHeight: 1.6,
              fontSize: "1.05rem",
              margin: 0,
            }}
          >
            Un emprendimiento familiar colombiano que acerca a tu hogar productos
            originales de salud, belleza y bienestar importados desde Estados Unidos.
          </p>
        </header>

        {/* ─────────── BIENVENIDA ─────────── */}
        <section
          style={{
            background: COLORS.card,
            borderRadius: 24,
            padding: "2rem 1.5rem",
            border: `1px solid ${COLORS.border}`,
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "1.4rem",
              color: COLORS.green,
              fontWeight: 500,
              margin: "0 0 1rem",
            }}
          >
            Bienvenida a Infinity Global Shop 🌿
          </h2>
          <p style={{ color: COLORS.text, lineHeight: 1.7, fontSize: "1rem", margin: "0 0 1rem" }}>
            Somos un emprendimiento familiar nacido en Medellín, Colombia, con un
            propósito claro:{" "}
            <strong style={{ color: COLORS.green }}>
              acercar a Colombia los mejores productos de salud, belleza y
              bienestar importados desde Estados Unidos
            </strong>
            , sin las complicaciones de comprar en línea desde el exterior.
          </p>
          <p style={{ color: COLORS.text, lineHeight: 1.7, fontSize: "1rem", margin: "0 0 1rem" }}>
            Nuestra historia comenzó cuando notamos lo difícil y costoso que era
            acceder a vitaminas, productos para el cabello y artículos de cuidado
            personal de calidad sin pagar tarifas absurdas o esperar semanas.
            Decidimos hacer las cosas distintas: importar nosotros mismos, con
            cuidado, y ofrecerlos a precios justos a familias colombianas.
          </p>
          <p style={{ color: COLORS.text, lineHeight: 1.7, fontSize: "1rem", margin: 0 }}>
            Hoy, cada producto que llega a tus manos pasó antes por las nuestras.
            Y eso, para nosotros, lo es todo.
          </p>
        </section>

        {/* ─────────── MISIÓN, VISIÓN, VALORES ─────────── */}
        <section style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr", marginBottom: "1.5rem" }}>
          <div style={{ background: COLORS.card, borderRadius: 20, padding: "1.5rem", border: `1px solid ${COLORS.border}` }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: COLORS.terracotta }}>
              Misión
            </span>
            <h3 style={{ fontFamily: FONT_SERIF, fontSize: "1.2rem", color: COLORS.green, fontWeight: 500, margin: "0.5rem 0 0.75rem" }}>
              Lo que nos mueve
            </h3>
            <p style={{ color: COLORS.text, lineHeight: 1.7, fontSize: "0.95rem", margin: 0 }}>
              Facilitar el acceso de las familias colombianas a productos originales
              de salud, belleza y bienestar, con precios honestos, atención cercana
              y la tranquilidad de saber que lo que reciben es auténtico.
            </p>
          </div>

          <div style={{ background: COLORS.card, borderRadius: 20, padding: "1.5rem", border: `1px solid ${COLORS.border}` }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: COLORS.terracotta }}>
              Visión
            </span>
            <h3 style={{ fontFamily: FONT_SERIF, fontSize: "1.2rem", color: COLORS.green, fontWeight: 500, margin: "0.5rem 0 0.75rem" }}>
              A dónde vamos
            </h3>
            <p style={{ color: COLORS.text, lineHeight: 1.7, fontSize: "0.95rem", margin: 0 }}>
              Convertirnos en la tienda online de confianza para productos
              importados de bienestar en Colombia, reconocida por su transparencia,
              cercanía con el cliente y compromiso con la calidad de cada envío.
            </p>
          </div>

          <div style={{ background: COLORS.card, borderRadius: 20, padding: "1.5rem", border: `1px solid ${COLORS.border}` }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: COLORS.terracotta }}>
              Valores
            </span>
            <h3 style={{ fontFamily: FONT_SERIF, fontSize: "1.2rem", color: COLORS.green, fontWeight: 500, margin: "0.5rem 0 0.75rem" }}>
              Lo que nos define
            </h3>
            <ul style={{ color: COLORS.text, lineHeight: 1.8, fontSize: "0.95rem", margin: 0, paddingLeft: "1.1rem" }}>
              <li><strong style={{ color: COLORS.green }}>Autenticidad:</strong> solo vendemos productos originales, comprados directamente en EE. UU.</li>
              <li><strong style={{ color: COLORS.green }}>Transparencia:</strong> precios claros, sin costos sorpresa.</li>
              <li><strong style={{ color: COLORS.green }}>Cercanía:</strong> te atendemos personalmente, no somos un call center.</li>
              <li><strong style={{ color: COLORS.green }}>Responsabilidad:</strong> respondemos por cada pedido como si fuera para nuestra familia.</li>
            </ul>
          </div>
        </section>

        {/* ─────────── CÓMO TRABAJAMOS ─────────── */}
        <section style={{ background: COLORS.card, borderRadius: 24, padding: "2rem 1.5rem", border: `1px solid ${COLORS.border}`, marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: COLORS.terracotta }}>
            Nuestro proceso
          </span>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: "1.5rem", color: COLORS.green, fontWeight: 500, margin: "0.5rem 0 1.25rem" }}>
            Así trabajamos
          </h2>

          <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {[
              { n: "01", t: "Selección cuidadosa", d: "Investigamos y elegimos productos con buena reputación, ingredientes confiables y demanda real entre nuestros clientes." },
              { n: "02", t: "Compra directa en EE. UU.", d: "Adquirimos los productos en tiendas oficiales y distribuidores autorizados en Estados Unidos. Nada de intermediarios sospechosos." },
              { n: "03", t: "Importación legal", d: "Todos nuestros envíos ingresan a Colombia cumpliendo las normas aduaneras vigentes." },
              { n: "04", t: "Revisión y empaque", d: "Antes de enviarte tu pedido, revisamos personalmente que esté en perfecto estado y lo empacamos con cuidado." },
              { n: "05", t: "Envío a todo Colombia", d: "Despachamos por transportadoras de confianza con número de guía para que sigas tu pedido en tiempo real." },
            ].map((step) => (
              <li key={step.n} style={{ display: "flex", gap: "1rem", paddingBottom: "1.25rem", marginBottom: "1.25rem", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: FONT_SERIF, fontSize: "1.5rem", color: COLORS.terracotta, fontWeight: 400, minWidth: "2.5rem", lineHeight: 1 }}>
                  {step.n}
                </span>
                <div>
                  <h3 style={{ fontFamily: FONT_SERIF, fontSize: "1.05rem", color: COLORS.green, fontWeight: 500, margin: "0 0 0.4rem" }}>
                    {step.t}
                  </h3>
                  <p style={{ color: COLORS.text, lineHeight: 1.7, fontSize: "0.95rem", margin: 0 }}>
                    {step.d}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p style={{ color: COLORS.textSoft, lineHeight: 1.6, fontSize: "0.9rem", margin: 0, fontStyle: "italic" }}>
            Cada paso lo hacemos nosotros mismos. Por eso podemos responderte por
            lo que vendemos.
          </p>
        </section>

        {/* ─────────── POR QUÉ CONFIAR ─────────── */}
        <section style={{ background: COLORS.card, borderRadius: 24, padding: "2rem 1.5rem", border: `1px solid ${COLORS.border}`, marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: COLORS.terracotta }}>
            Garantías
          </span>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: "1.5rem", color: COLORS.green, fontWeight: 500, margin: "0.5rem 0 1.25rem" }}>
            ¿Por qué comprar con nosotros?
          </h2>

          <div style={{ display: "grid", gap: "1rem" }}>
            {[
              { t: "Productos 100% originales", d: "Garantizamos la autenticidad de cada artículo. Si recibes algo que no corresponde, te devolvemos el dinero." },
              { t: "Pago seguro", d: "Aceptamos los principales métodos de pago en Colombia con plataformas reconocidas y protocolos seguros." },
              { t: "Envíos rastreables", d: "Recibirás el número de guía de tu pedido para que sepas dónde está en cada momento." },
              { t: "Atención humana", d: "Te respondemos por WhatsApp y correo. Hablas con personas reales, no con bots." },
              { t: "Política de cambios clara", d: "Si hay un problema con tu pedido, lo solucionamos. Tenemos políticas de devolución publicadas y claras." },
            ].map((item) => (
              <div key={item.t} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ minWidth: 8, height: 8, borderRadius: "50%", background: COLORS.terracotta, marginTop: "0.55rem" }} />
                <div>
                  <strong style={{ color: COLORS.green, fontSize: "0.98rem", display: "block", marginBottom: "0.25rem" }}>
                    {item.t}
                  </strong>
                  <span style={{ color: COLORS.text, lineHeight: 1.6, fontSize: "0.93rem" }}>
                    {item.d}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────── PREGUNTAS FRECUENTES ─────────── */}
        <section style={{ background: COLORS.card, borderRadius: 24, padding: "2rem 1.5rem", border: `1px solid ${COLORS.border}`, marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: COLORS.terracotta }}>
            Dudas comunes
          </span>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: "1.5rem", color: COLORS.green, fontWeight: 500, margin: "0.5rem 0 1.25rem" }}>
            Preguntas frecuentes
          </h2>

          {[
            { q: "¿Los productos son originales?", a: "Sí. Compramos directamente en tiendas oficiales y distribuidores autorizados en Estados Unidos. No trabajamos con productos genéricos, falsificados ni de procedencia dudosa." },
            { q: "¿Cuánto demora un pedido?", a: "En Medellín entregamos en 24 horas. Para el resto de Colombia, entre 2 y 5 días hábiles según la ciudad. Te confirmamos los tiempos exactos en cada compra." },
            { q: "¿Envían a todo el país?", a: "Sí, despachamos a todo el territorio colombiano mediante transportadoras reconocidas. Te entregamos el número de guía para que rastrees tu pedido." },
            { q: "¿Qué pasa si mi pedido llega dañado o no es lo que pedí?", a: "Nos contactas de inmediato por WhatsApp y solucionamos. Tenemos política de cambios y devoluciones publicada en nuestra web." },
            { q: "¿Tienen tienda física?", a: "Operamos principalmente online desde Medellín. Si necesitas coordinar una entrega o tienes una consulta, escríbenos por WhatsApp." },
          ].map((faq) => (
            <details key={faq.q} style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "1rem 0" }}>
              <summary style={{ fontFamily: FONT_SERIF, color: COLORS.green, fontWeight: 500, fontSize: "1rem", cursor: "pointer", listStyle: "none" }}>
                {faq.q}
              </summary>
              <p style={{ color: COLORS.text, lineHeight: 1.7, fontSize: "0.95rem", margin: "0.75rem 0 0" }}>
                {faq.a}
              </p>
            </details>
          ))}
        </section>

        {/* ─────────── CONTACTO ─────────── */}
        <section style={{ background: COLORS.green, borderRadius: 24, padding: "2rem 1.5rem", marginBottom: "1.5rem", color: "#FDFAF3" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: "#E8B89E" }}>
            Hablemos
          </span>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: "1.5rem", fontWeight: 500, margin: "0.5rem 0 1rem", color: "#FDFAF3" }}>
            Estamos para ti
          </h2>
          <p style={{ lineHeight: 1.7, fontSize: "0.98rem", margin: "0 0 1.25rem", color: "#EFE8D4" }}>
            ¿Tienes una duda, una sugerencia o quieres saber si tenemos algún
            producto en particular? Escríbenos. Te respondemos rápido y de forma
            personal.
          </p>

          <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#E8B89E", display: "block", marginBottom: "0.25rem" }}>
                Correo
              </span>
              <a href="mailto:infinityshop147@gmail.com" style={{ color: "#FDFAF3", textDecoration: "none", fontSize: "1rem", fontWeight: 500 }}>
                infinityshop147@gmail.com
              </a>
            </div>

            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#E8B89E", display: "block", marginBottom: "0.25rem" }}>
                WhatsApp
              </span>
              <a href="https://wa.me/573054223600" style={{ color: "#FDFAF3", textDecoration: "none", fontSize: "1rem", fontWeight: 500 }}>
                +57 305 422 3600
              </a>
            </div>

            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#E8B89E", display: "block", marginBottom: "0.25rem" }}>
                Ubicación
              </span>
              <span style={{ color: "#FDFAF3", fontSize: "1rem" }}>
                Medellín, Antioquia, Colombia
              </span>
            </div>

            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#E8B89E", display: "block", marginBottom: "0.25rem" }}>
                Horario de atención
              </span>
              <span style={{ color: "#FDFAF3", fontSize: "1rem" }}>
                Lunes a sábado · 8:00 a. m. – 6:00 p. m.
              </span>
            </div>
          </div>

          <Link href="https://wa.me/573054223600" style={{ display: "inline-block", background: COLORS.terracotta, color: "#FDFAF3", padding: "0.85rem 1.75rem", borderRadius: 999, fontWeight: 500, fontSize: "0.95rem", textDecoration: "none", letterSpacing: "0.02em" }}>
            Escribir por WhatsApp →
          </Link>
        </section>

        {/* ─────────── COMPROMISO FINAL ─────────── */}
        <section style={{ textAlign: "center", padding: "1.5rem 1rem 0" }}>
          <p style={{ fontFamily: FONT_SERIF, fontSize: "1.15rem", color: COLORS.green, lineHeight: 1.6, fontStyle: "italic", fontWeight: 400, margin: "0 0 0.5rem" }}>
            “Cuidamos cada pedido como si fuera para nuestra propia familia.”
          </p>
          <span style={{ fontSize: "0.85rem", color: COLORS.textSoft, letterSpacing: "0.05em" }}>
            — Equipo Infinity Global Shop
          </span>
        </section>
      </div>
    </main>
  );
}
