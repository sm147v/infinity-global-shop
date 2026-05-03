"use client";

import { useState, useEffect } from "react";

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES = ["Vitaminas", "Belleza", "Cabello", "Salud", "Hogar", "Herramientas", "Más productos", "General"];

export function ProductEditModal({ product, isOpen, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("General");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!product?.id;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(String(product.price));
      setStock(String(product.stock));
      setCategory(product.category);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("General");
    }
    setError("");
  }, [product, isOpen]);

  async function save() {
    setError("");
    if (!name.trim()) { setError("El nombre es obligatorio"); return; }
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock);
    if (isNaN(priceNum) || priceNum < 0) { setError("Precio inválido"); return; }
    if (isNaN(stockNum) || stockNum < 0) { setError("Stock inválido"); return; }

    setSaving(true);
    const token = localStorage.getItem("adminToken") || "";
    const url = isEditing ? "/api/admin/products/" + product?.id : "/api/admin/products";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          price: priceNum,
          stock: stockNum,
          category,
        }),
      });

      if (res.ok) {
        onSaved();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || "Error al guardar");
      }
    } catch {
      setError("Error de conexión");
    }
    setSaving(false);
  }

  if (!isOpen) return null;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(42,46,38,0.6)",
      backdropFilter: "blur(4px)",
      zIndex: 300,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#FDFAF3",
        borderRadius: 24,
        padding: "2rem 1.5rem",
        maxWidth: 480,
        width: "100%",
        maxHeight: "90vh",
        overflow: "auto",
        fontFamily: "var(--font-dm-sans), Inter, sans-serif",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.5rem", color: "#4A5D3A", fontWeight: 500, margin: 0 }}>
            {isEditing ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button onClick={onClose} style={{
            width: 36, height: 36,
            borderRadius: "50%",
            background: "#EDE3CD",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            color: "#4A5D3A",
          }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Nombre del producto *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Vitaminas Nature's Bounty" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Describe los beneficios y características" style={{ ...inputStyle, borderRadius: 16, resize: "vertical" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={labelStyle}>Precio (COP) *</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="50000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Stock *</label>
              <input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="10" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Categoría</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {error && (
            <div style={{ background: "rgba(201,83,61,0.1)", border: "1px solid rgba(201,83,61,0.3)", padding: "0.75rem", borderRadius: 12, color: "#C9533D", fontSize: "0.85rem" }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button onClick={onClose} style={{
              flex: 1,
              background: "transparent",
              border: "1px solid #EDE3CD",
              color: "#4A4F45",
              padding: "0.95rem",
              borderRadius: 100,
              fontSize: "0.9rem",
              cursor: "pointer",
              fontFamily: "inherit",
            }}>
              Cancelar
            </button>
            <button onClick={save} disabled={saving} style={{
              flex: 2,
              background: "#4A5D3A",
              color: "#F7F1E5",
              border: "none",
              padding: "0.95rem",
              borderRadius: 100,
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: saving ? "wait" : "pointer",
              opacity: saving ? 0.6 : 1,
              fontFamily: "inherit",
            }}>
              {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  color: "#4A4F45",
  marginBottom: "0.4rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.85rem 1rem",
  borderRadius: 100,
  border: "1px solid #EDE3CD",
  background: "#F7F1E5",
  fontSize: "0.92rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  color: "#4A5D3A",
};
