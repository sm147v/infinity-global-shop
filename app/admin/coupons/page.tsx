"use client";
import { useEffect, useState, useCallback } from "react";

interface Coupon { id: number; code: string; description?: string; type: string; value: number; minPurchase: number; maxUses?: number; currentUses: number; validUntil?: string; active: boolean; }

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("PERCENTAGE");
  const [value, setValue] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  function getToken() { return localStorage.getItem("adminToken") || ""; }

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/coupons", { headers: { "x-admin-token": getToken() } });
    if (res.ok) {
      const data = await res.json();
      setCoupons(data.coupons || []);
    }
    setLoading(false);
  }, []);

  async function create() {
    setError("");
    if (!code.trim()) { setError("Ingresa un código"); return; }
    if (type !== "FREE_SHIPPING" && !value) { setError("Ingresa el valor"); return; }

    setCreating(true);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": getToken() },
      body: JSON.stringify({
        code: code.trim().toUpperCase(),
        description: description.trim() || null,
        type,
        value: parseFloat(value) || 0,
        minPurchase: parseFloat(minPurchase) || 0,
        maxUses: maxUses ? parseInt(maxUses) : null,
        validUntil: validUntil || null,
      }),
    });

    if (res.ok) {
      setCode(""); setDescription(""); setValue(""); setMinPurchase(""); setMaxUses(""); setValidUntil("");
      setShowForm(false);
      load();
    } else {
      const data = await res.json();
      setError(data.error || "Error al crear");
    }
    setCreating(false);
  }

  async function toggleActive(id: number, currentActive: boolean) {
    await fetch("/api/admin/coupons/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": getToken() },
      body: JSON.stringify({ active: !currentActive }),
    });
    load();
  }

  async function deleteCoupon(id: number, code: string) {
    if (!confirm("¿Eliminar el cupón " + code + "?")) return;
    await fetch("/api/admin/coupons/" + id, { method: "DELETE", headers: { "x-admin-token": getToken() } });
    load();
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  if (loading) return <div style={{ padding: "3rem", textAlign: "center" }}><p style={{ color: "#4A5D3A" }}>Cargando...</p></div>;

  return (
    <main style={{ padding: "2rem 1.5rem", maxWidth: 1280, margin: "0 auto", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.8rem", color: "#4A5D3A", fontWeight: 400, margin: "0 0 0.3rem" }}>
            Cupones de descuento
          </h1>
          <p style={{ color: "#4A4F45", fontSize: "0.9rem", margin: 0 }}>
            {coupons.length} cupones en total · {coupons.filter(c => c.active).length} activos
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: showForm ? "transparent" : "#4A5D3A",
          color: showForm ? "#4A5D3A" : "#F7F1E5",
          border: showForm ? "1px solid #4A5D3A" : "none",
          padding: "0.85rem 1.5rem",
          borderRadius: 100,
          fontSize: "0.88rem",
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "inherit",
        }}>
          {showForm ? "Cancelar" : "+ Nuevo cupón"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.5rem" }}>
          <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 500, margin: "0 0 1rem" }}>
            Crear nuevo cupón
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
            <div>
              <label style={labelStyle}>Código *</label>
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="DESCUENTO20" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tipo *</label>
              <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
                <option value="PERCENTAGE">Porcentaje (%)</option>
                <option value="FIXED">Monto fijo ($)</option>
                <option value="FREE_SHIPPING">Envío gratis</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "0.85rem" }}>
            <label style={labelStyle}>Descripción</label>
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej: 20% de descuento en toda la tienda" style={inputStyle} />
          </div>

          {type !== "FREE_SHIPPING" && (
            <div style={{ marginBottom: "0.85rem" }}>
              <label style={labelStyle}>{type === "PERCENTAGE" ? "Porcentaje de descuento" : "Monto del descuento (COP)"}</label>
              <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder={type === "PERCENTAGE" ? "20" : "10000"} style={inputStyle} />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
            <div>
              <label style={labelStyle}>Compra mínima (COP)</label>
              <input type="number" value={minPurchase} onChange={e => setMinPurchase(e.target.value)} placeholder="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Máximo de usos</label>
              <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="Ilimitado" style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: "0.85rem" }}>
            <label style={labelStyle}>Válido hasta (opcional)</label>
            <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} style={inputStyle} />
          </div>

          {error && <p style={{ color: "#C9533D", fontSize: "0.85rem", margin: "0 0 0.85rem" }}>⚠️ {error}</p>}

          <button onClick={create} disabled={creating} style={{
            width: "100%",
            background: "#4A5D3A",
            color: "#F7F1E5",
            border: "none",
            padding: "0.95rem",
            borderRadius: 100,
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: creating ? "wait" : "pointer",
            opacity: creating ? 0.6 : 1,
            fontFamily: "inherit",
          }}>
            {creating ? "Creando..." : "Crear cupón"}
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
        {coupons.map(c => {
          const expired = c.validUntil && new Date(c.validUntil) < new Date();
          const usedUp = c.maxUses && c.currentUses >= c.maxUses;
          const isUsable = c.active && !expired && !usedUp;
          
          return (
            <div key={c.id} style={{
              background: "#FDFAF3",
              borderRadius: 18,
              padding: "1.25rem",
              border: isUsable ? "1px solid #4A5D3A" : "1px solid #EDE3CD",
              opacity: c.active ? 1 : 0.6,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div style={{
                  fontFamily: "monospace",
                  background: "#4A5D3A",
                  color: "#F7F1E5",
                  padding: "0.4rem 0.85rem",
                  borderRadius: 8,
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}>
                  {c.code}
                </div>
                <span style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: 100,
                  background: isUsable ? "rgba(92,138,94,0.15)" : "rgba(201,83,61,0.15)",
                  color: isUsable ? "#5C8A5E" : "#C9533D",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}>
                  {!c.active ? "Pausado" : expired ? "Vencido" : usedUp ? "Agotado" : "Activo"}
                </span>
              </div>

              <p style={{ fontSize: "0.85rem", color: "#4A4F45", marginBottom: "0.75rem", lineHeight: 1.5, minHeight: "2.5em" }}>
                {c.description || "Sin descripción"}
              </p>

              <div style={{ background: "#F7F1E5", padding: "0.75rem", borderRadius: 10, marginBottom: "0.75rem" }}>
                <div style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.4rem", color: "#C97B5C", fontWeight: 600 }}>
                  {c.type === "PERCENTAGE" && Number(c.value) + "% OFF"}
                  {c.type === "FIXED" && fmt(Number(c.value)) + " OFF"}
                  {c.type === "FREE_SHIPPING" && "🚚 Envío gratis"}
                </div>
                {Number(c.minPurchase) > 0 && (
                  <p style={{ fontSize: "0.7rem", color: "#4A4F45", margin: "0.2rem 0 0" }}>
                    Mínimo: {fmt(Number(c.minPurchase))}
                  </p>
                )}
              </div>

              <div style={{ fontSize: "0.7rem", color: "#4A4F45", marginBottom: "0.85rem" }}>
                <div>📊 Usos: {c.currentUses}{c.maxUses ? "/" + c.maxUses : " (ilimitado)"}</div>
                {c.validUntil && (
                  <div>📅 Vence: {new Date(c.validUntil).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}</div>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button onClick={() => toggleActive(c.id, c.active)} style={{
                  flex: 1,
                  background: "transparent",
                  border: "1px solid " + (c.active ? "#C97B5C" : "#5C8A5E"),
                  color: c.active ? "#C97B5C" : "#5C8A5E",
                  padding: "0.5rem",
                  borderRadius: 100,
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}>
                  {c.active ? "⏸️ Pausar" : "▶️ Activar"}
                </button>
                <button onClick={() => deleteCoupon(c.id, c.code)} style={{
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
          );
        })}
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  color: "#4A4F45",
  marginBottom: "0.3rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: 100,
  border: "1px solid #EDE3CD",
  background: "#F7F1E5",
  fontSize: "0.88rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  color: "#4A5D3A",
};
