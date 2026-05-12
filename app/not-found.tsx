import Link from "next/link";

export const metadata = {
  title: "Página no encontrada · Infinity Global Shop",
  description: "La página que buscas no existe. Vuelve a la tienda.",
};

export default function NotFound() {
  return (
    <main style={{ minHeight: "60vh", background: "#F7F1E5", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🌿</div>
        <h1 style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: "2.4rem",
          color: "#4A5D3A",
          fontWeight: 400,
          margin: "0 0 0.5rem",
        }}>
          Página no <em style={{ color: "#C97B5C" }}>encontrada</em>
        </h1>
        <p style={{ color: "#4A4F45", fontSize: "1rem", marginBottom: "2rem", lineHeight: 1.6 }}>
          La página que buscas no existe o se ha movido. Vuelve a la tienda y descubre nuestros productos.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{
            padding: "1rem 1.75rem",
            background: "#4A5D3A",
            color: "#F7F1E5",
            borderRadius: 100,
            textDecoration: "none",
            fontSize: "0.92rem",
            fontWeight: 500,
          }}>
            Volver al inicio
          </Link>
          <Link href="/productos" style={{
            padding: "1rem 1.75rem",
            background: "transparent",
            color: "#4A5D3A",
            border: "1px solid #4A5D3A",
            borderRadius: 100,
            textDecoration: "none",
            fontSize: "0.92rem",
            fontWeight: 500,
          }}>
            Ver productos
          </Link>
        </div>
      </div>
    </main>
  );
}
