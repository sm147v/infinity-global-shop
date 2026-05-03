"use client";
import { useEffect, useState } from "react";
import { AdminImageUpload } from "@/components/admin-image-upload";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (res.ok) {
      localStorage.setItem("adminToken", token);
      setAuthed(true);
      loadProducts();
    } else {
      setError("Token incorrecto");
    }
  }

  async function loadProducts() {
    const res = await fetch("/api/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    const saved = localStorage.getItem("adminToken");
    if (saved) {
      setToken(saved);
      setAuthed(true);
      loadProducts();
    } else {
      setLoading(false);
    }
  }, []);

  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", background: "#F7F1E5", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#FDFAF3", borderRadius: 20, padding: "2rem", border: "1px solid #EDE3CD", width: "100%", maxWidth: 360 }}>
          <h2 style={{ fontFamily: "Georgia, serif", color: "#4A5D3A", margin: "0 0 1.5rem", textAlign: "center" }}>Admin · Imágenes</h2>
          <input
            type="password"
            placeholder="Token de acceso"
            value={token}
            onChange={e => setToken(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: 100, border: "1px solid #EDE3CD", fontSize: "0.95rem", marginBottom: "1rem", outline: "none" }}
          />
          {error && <p style={{ color: "#C9533D", fontSize: "0.85rem", textAlign: "center", margin: "0 0 1rem" }}>{error}</p>}
          <button onClick={login} style={{ width: "100%", background: "#4A5D3A", color: "#F7F1E5", border: "none", padding: "1rem", borderRadius: 100, fontSize: "0.95rem", fontWeight: 500, cursor: "pointer" }}>
            Entrar
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "#F7F1E5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#4A5D3A", fontFamily: "Georgia, serif", fontSize: "1.2rem" }}>Cargando...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F7F1E5", padding: "2rem 1.25rem", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.8rem", color: "#4A5D3A", fontWeight: 400, margin: "0 0 0.4rem" }}>
          Imágenes de productos
        </h1>
        <p style={{ color: "#4A4F45", fontSize: "0.9rem" }}>
          Sube una imagen para cada producto. Se guarda automáticamente en Cloudinary.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "1.25rem",
      }}>
        {products.map(p => (
          <div key={p.id}>
            <div style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.95rem",
              color: "#4A5D3A",
              marginBottom: "0.5rem",
              fontWeight: 500,
            }}>
              {p.name}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#4A4F45", marginBottom: "0.5rem" }}>
              ${Number(p.price).toLocaleString("es-CO")}
            </div>
            <AdminImageUpload productId={p.id} currentImage={p.image} />
          </div>
        ))}
      </div>
    </main>
  );
}
