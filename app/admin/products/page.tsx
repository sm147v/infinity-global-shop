"use client";
import { useEffect, useState } from "react";
import { AdminImageUpload } from "@/components/admin-image-upload";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadProducts() {
    const res = await fetch("/api/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products || []);
    }
    setLoading(false);
  }

  useEffect(() => { loadProducts(); }, []);

  const filtered = products.filter(p =>
    !search.trim() || p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <main style={{ minHeight: "calc(100vh - 100px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#4A5D3A", fontFamily: "Georgia, serif", fontSize: "1.2rem" }}>Cargando...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem 1.5rem", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.8rem", color: "#4A5D3A", fontWeight: 400, margin: "0 0 0.4rem" }}>
          Imágenes de productos
        </h1>
        <p style={{ color: "#4A4F45", fontSize: "0.9rem", marginBottom: "1rem" }}>
          Sube varias imágenes por producto. La primera o la que selecciones será la principal.
        </p>

        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "0.85rem 1rem",
            borderRadius: 100,
            border: "1px solid #EDE3CD",
            background: "#FDFAF3",
            fontSize: "0.9rem",
            outline: "none",
            fontFamily: "inherit",
            color: "#4A5D3A",
          }}
        />
      </div>

      <p style={{ fontSize: "0.85rem", color: "#4A4F45", marginBottom: "1rem" }}>
        Mostrando {filtered.length} de {products.length} productos
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "1.25rem",
      }}>
        {filtered.map(p => (
          <div key={p.id}>
            <div style={{ marginBottom: "0.5rem" }}>
              <p style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "0.92rem",
                color: "#4A5D3A",
                margin: "0 0 0.2rem",
                fontWeight: 500,
                lineHeight: 1.2,
              }}>
                {p.name}
              </p>
              <p style={{ fontSize: "0.78rem", color: "#4A4F45", margin: 0 }}>
                ${Number(p.price).toLocaleString("es-CO")} · Stock: {p.stock}
              </p>
            </div>
            <AdminImageUpload
              productId={p.id}
              currentImage={p.image}
              currentImages={p.images || []}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
