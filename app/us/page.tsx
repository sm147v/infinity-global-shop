import Link from "next/link";

export const metadata = {
  title: "Sobre nosotros · Infinity Global Shop",
  description: "Conoce la historia de Infinity Global Shop, importadores de productos de salud y belleza desde Estados Unidos.",
};

export default function NosotrosPage() {
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
            Nuestra historia
          </span>

          <h1 style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#4A5D3A",
            fontWeight: 400,
            lineHeight: 1.1,
            margin: "0 0 1rem",
            letterSpacing: "-0.02em",
          }}>
            Sobre <em style={{ color: "#C97B5C", fontStyle: "italic", fontWeight: 300 }}>nosotros</em>
          </h1>
        </div>

        <div style={{ background: "#FDFAF3", borderRadius: 24, padding: "2rem 1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.4rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 1rem" }}>
            Bienvenida a Infinity Global Shop 🌿
          </h2>
          <p style={{ color: "#4A4F45", lineHeight: 1.7, fontSize: "1rem", margin: "0 0 1rem" }}>
            Somos un emprendimiento familiar nacido en Medellín con un propósito claro: <strong style={{ color: "#4A5D3A" }}>acercar a Colombia los mejores productos de salud, belleza y bienestar importados desde Estados Unidos</strong>, sin las complicaciones de comprar en línea desde el exterior.
          </p>
          <p style={{ color: "#4A4F45", lineHeight: 1.7, fontSize: "1rem", margin: 0 }}>
            Nuestra historia comenzó cuando notamos lo difícil y costoso que era acceder a vitaminas, productos para el cabello y artículos de cuidado personal de calidad sin pagar tarifas absurdas o esperar semanas. Decidimos hacer las cosas distintas.
          </p>
        </div>

        <div style={{ background: "#4A5D3A", borderRadius: 24, padding: "2rem 1.5rem", color: "#F7F1E5", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.78rem", color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.85rem", fontWeight: 600 }}>
            Lo que nos mueve
          </p>
          <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.5rem", fontWeight: 400, margin: "0 0 1rem", lineHeight: 1.3 }}>
            Productos auténticos, atención cercana, entrega rápida.
          </h3>
          <p style={{ opacity: 0.9, lineHeight: 1.6, fontSize: "0.95rem", margin: 0 }}>
            Creemos que cuidarte no debería ser un lujo ni una espera eterna. Por eso seleccionamos cada producto con cuidado, los traemos directamente desde Estados Unidos y te los entregamos en menos de 24 horas en toda Medellín.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.85rem", marginBottom: "1.5rem" }}>
          {[
            { icon: "🇺🇸", title: "Importamos directamente", desc: "Trabajamos con proveedores autorizados en Estados Unidos. Cada producto es 100% original y auténtico." },
            { icon: "💛", title: "Atención personal", desc: "No somos un call center. Cada mensaje, cada pedido, cada duda la atendemos personalmente con cariño." },
            { icon: "📦", title: "Empaque cuidado", desc: "Cada pedido lo preparamos con detalle, como si fuera para nuestra propia familia." },
            { icon: "🌿", title: "Crecemos contigo", desc: "Cada cliente nos ayuda a crecer y nos motiva a traer más productos que mejoren tu día a día." },
          ].map(item => (
            <div key={item.title} style={{ background: "#FDFAF3", border: "1px solid #EDE3CD", borderRadius: 18, padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ fontSize: "1.8rem", flexShrink: 0 }}>{item.icon}</div>
              <div>
                <h4 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.05rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 0.3rem" }}>{item.title}</h4>
                <p style={{ color: "#4A4F45", fontSize: "0.9rem", lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#EDE3CD", borderRadius: 24, padding: "2rem 1.5rem", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.78rem", color: "#C97B5C", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.85rem", fontWeight: 600 }}>
            Nuestra promesa
          </p>
          <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.3rem", color: "#4A5D3A", fontWeight: 400, lineHeight: 1.4, margin: 0, fontStyle: "italic" }}>
            &ldquo;Cuidar de ti no es solo nuestro trabajo, es nuestro propósito. Cada producto que recibes en tu puerta es nuestra forma de decirte: <span style={{ color: "#C97B5C", fontStyle: "normal", fontWeight: 600 }}>te cuidamos como nos gustaría que nos cuidaran a nosotros</span>.&rdquo;
          </p>
        </div>

        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <p style={{ color: "#4A4F45", marginBottom: "1rem", fontSize: "0.95rem" }}>
            ¿Lista para descubrir nuestros productos?
          </p>
          <Link href="/products" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#4A5D3A",
            color: "#F7F1E5",
            padding: "1rem 1.75rem",
            borderRadius: 100,
            textDecoration: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
          }}>
            Explorar tienda →
          </Link>
        </div>

      </div>
    </main>
  );
}
