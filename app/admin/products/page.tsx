"use client";
import { useEffect, useState } from "react";
import { AdminImageUpload } from "@/components/admin-image-upload";
import { ProductEditModal } from "@/components/product-edit-modal";

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  async function loadProducts() {
    const token = localStorage.getItem("adminToken") || "";
    const res = await fetch("/api/admin/products", { headers: { "x-admin-token": token } });
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products || []);
    }
    setLoading(false);
  }

  async function deleteProduct(id: number, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    const token = localStorage.getItem("adminToken") || "";
    const res = await fetch("/api/admin/products/" + id, {
      method: "DELETE",
      headers: { "x-admin-token": token },
    });
    if (res.ok) loadProducts();
    else alert("Error al eliminar el producto");
  }

  function openEdit(product: any) {
    setEditingProduct(product);
    setShowModal(true);
  }

  function openCreate() {
    setEditingProduct(null);
    setShowModal(true);
  }

  useEffect(() => { loadProducts(); }, []);

  const categories = Array.from(new Set(products.map(p => p.category))).sort();
  const filtered = products.filter(p => {
    const matchSearch = !search.trim() || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "ALL" || p.category === filterCategory;
    return matchSearch && matchCat;
  });
  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visible.length;

  if (loading) {
    return (
      <main style={{ minHeight: "calc(100vh - 100px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#4A5D3A", fontFamily: "Georgia, serif", fontSize: "1.2rem" }}>Cargando...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem 1.5rem", maxWidth: 1280, margin: "0 auto" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.8rem", color: "#4A5D3A", fontWeight: 400, margin: "0 0 0.3rem" }}>
            Productos
          </h1>
          <p style={{ color: "#4A4F45", fontSize: "0.9rem", margin: 0 }}>
            {products.length} productos en total · Gestiona el catálogo completo
          </p>
        </div>
        <button onClick={openCreate} style={{
          background: "#4A5D3A",
          color: "#F7F1E5",
          border: "none",
          padding: "0.85rem 1.5rem",
          borderRadius: 100,
          fontSize: "0.88rem",
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}>
          + Nuevo producto
        </button>
      </div>

      <div style={{ marginBottom: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setVisibleCount(12); }}
          style={{
            flex: 1,
            minWidth: 200,
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
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={{
            padding: "0.85rem 1rem",
            borderRadius: 100,
            border: "1px solid #EDE3CD",
            background: "#FDFAF3",
            fontSize: "0.9rem",
            outline: "none",
            fontFamily: "inherit",
            color: "#4A5D3A",
            cursor: "pointer",
          }}
        >
          <option value="ALL">Todas las categorías</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <p style={{ fontSize: "0.85rem", color: "#4A4F45", marginBottom: "1rem" }}>
        Mostrando {filtered.length} productos
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
        {visible.map(p => (
          <div key={p.id} style={{
            background: "#FDFAF3",
            borderRadius: 18,
            padding: "1rem",
            border: "1px solid #EDE3CD",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{
                display: "inline-block",
                fontSize: "0.65rem",
                color: "#C97B5C",
                background: "rgba(201, 123, 92, 0.1)",
                padding: "0.2rem 0.6rem",
                borderRadius: 100,
                marginBottom: "0.4rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                {p.category}
              </span>
              <p style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "0.95rem",
                color: "#4A5D3A",
                margin: "0 0 0.3rem",
                fontWeight: 500,
                lineHeight: 1.25,
              }}>
                {p.name}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#4A4F45" }}>
                <span style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "0.95rem", color: "#4A5D3A", fontWeight: 600 }}>
                  {fmt(Number(p.price))}
                </span>
                <span style={{ color: p.stock > 5 ? "#5C8A5E" : "#C9533D", fontWeight: 600 }}>
                  Stock: {p.stock}
                </span>
              </div>
            </div>

            <AdminImageUpload
              productId={p.id}
              currentImage={p.image}
              currentImages={p.images || []}
            />

            <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.75rem" }}>
              <button onClick={() => openEdit(p)} style={{
                flex: 1,
                background: "transparent",
                border: "1px solid #4A5D3A",
                color: "#4A5D3A",
                padding: "0.5rem",
                borderRadius: 100,
                fontSize: "0.78rem",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}>
                ✏️ Editar
              </button>
              <button onClick={() => deleteProduct(p.id, p.name)} style={{
                background: "transparent",
                border: "1px solid rgba(201,83,61,0.3)",
                color: "#C9533D",
                padding: "0.5rem 0.85rem",
                borderRadius: 100,
                fontSize: "0.78rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button onClick={() => setVisibleCount(c => c + 12)} style={{
            background: "#4A5D3A",
            color: "#F7F1E5",
            border: "none",
            padding: "1rem 2rem",
            borderRadius: 100,
            fontSize: "0.92rem",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}>
            Cargar más productos ({filtered.length - visible.length} restantes)
          </button>
        </div>
      )}

      <ProductEditModal
        product={editingProduct}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSaved={loadProducts}
      />
    </main>
  );
}
