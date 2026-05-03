import { prisma } from "@/lib/prisma";
import { HomeProductCard } from "@/components/home-product-card";
import { ResponsiveGrid } from "@/components/responsive-grid";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { id: "desc" } });

  return (
    <div style={{ background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif", paddingBottom: "3rem" }}>

      <section style={{ padding: "2rem 1.5rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.7rem",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "#C97B5C",
          marginBottom: "0.75rem",
        }}>
          <span style={{ width: 20, height: 1, background: "#C97B5C" }} />
          Catálogo curado
        </div>

        <h1 style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: "clamp(1.85rem, 4vw, 2.8rem)",
          lineHeight: 1.1,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: "#4A5D3A",
          marginBottom: "0.75rem",
        }}>
          Todos nuestros <em style={{ fontStyle: "italic", fontWeight: 300, color: "#C97B5C" }}>productos</em>
        </h1>

        <p style={{ fontSize: "0.95rem", color: "#4A4F45", maxWidth: "560px" }}>
          {products.length} productos importados desde EE.UU., con stock disponible y entrega rápida en Medellín.
        </p>
      </section>

      <section style={{ padding: "0 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        {products.length === 0 ? (
          <div style={{
            background: "#FDFAF3",
            borderRadius: 18,
            padding: "2rem 1.25rem",
            border: "1px solid rgba(74, 93, 58, 0.08)",
            textAlign: "center",
          }}>
            <p style={{ color: "#4A4F45" }}>No hay productos cargados todavía.</p>
          </div>
        ) : (
          <ResponsiveGrid>
            {products.map((product) => (
              <HomeProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image: product.image,
                  stock: product.stock,
                }}
              />
            ))}
          </ResponsiveGrid>
        )}
      </section>

    </div>
  );
}
