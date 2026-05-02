"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const STATUS_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  PENDING:   { label: "Pendiente de pago", emoji: "📋", color: "#C9A96E" },
  PAID:      { label: "Pagado",            emoji: "✅", color: "#5C8A5E" },
  PREPARING: { label: "Preparando",        emoji: "📦", color: "#6B7B4F" },
  SHIPPED:   { label: "En camino",         emoji: "🚚", color: "#4A5D3A" },
  DELIVERED: { label: "Entregado",         emoji: "🌿", color: "#4A5D3A" },
  CANCELLED: { label: "Cancelado",         emoji: "❌", color: "#C9533D" },
};

const fmt = (n: number) => "$" + n.toLocaleString("es-CO");

export default function AdminOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [waLink, setWaLink] = useState("");

  async function login() {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (res.ok) {
      setAuthed(true);
      loadOrder();
    } else {
      setError("Token incorrecto");
    }
  }

  async function loadOrder() {
    const res = await fetch(`/api/orders/${params.id}`, {
      headers: { "x-admin-token": token || localStorage.getItem("adminToken") || "" },
    });
    if (res.ok) {
      const data = await res.json();
      setOrder(data.order);
    }
    setLoading(false);
  }

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    setSuccessMsg("");
    setWaLink("");
    const t = token || localStorage.getItem("adminToken") || "";
    const res = await fetch(`/api/orders/${params.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": t,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const data = await res.json();
      setOrder(data.order);
      setWaLink(data.whatsappLink);
      setSuccessMsg(`✅ Estado actualizado a ${STATUS_LABELS[newStatus].emoji} ${STATUS_LABELS[newStatus].label}`);
      localStorage.setItem("adminToken", t);
    } else {
      setError("Error al actualizar");
    }
    setUpdating(false);
  }

  useEffect(() => {
    const saved = localStorage.getItem("adminToken");
    if (saved) {
      setToken(saved);
      setAuthed(true);
      loadOrder();
    } else {
      setLoading(false);
    }
  }, []);

  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", background: "#F7F1E5", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#FDFAF3", borderRadius: "20px", padding: "2rem", border: "1px solid #EDE3CD", width: "100%", maxWidth: "360px" }}>
          <h2 style={{ fontFamily: "Georgia, serif", color: "#4A5D3A", margin: "0 0 1.5rem", textAlign: "center" }}>Admin · Infinity Global</h2>
          <input
            type="password"
            placeholder="Token de acceso"
            value={token}
            onChange={e => setToken(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "100px", border: "1px solid #EDE3CD", fontFamily: "inherit", fontSize: "0.95rem", marginBottom: "1rem", outline: "none" }}
          />
          {error && <p style={{ color: "#C9533D", fontSize: "0.85rem", margin: "0 0 1rem", textAlign: "center" }}>{error}</p>}
          <button onClick={login} style={{ width: "100%", background: "#4A5D3A", color: "#F7F1E5", border: "none", padding: "1rem", borderRadius: "100px", fontSize: "0.95rem", fontWeight: 500, cursor: "pointer" }}>
            Entrar
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "#F7F1E5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#4A5D3A", fontFamily: "Georgia, serif", fontSize: "1.2rem" }}>Cargando pedido...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main style={{ minHeight: "100vh", background: "#F7F1E5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#C9533D" }}>Pedido no encontrado</p>
      </main>
    );
  }

  const currentStatus = STATUS_LABELS[order.status];

  return (
    <main style={{ minHeight: "100vh", background: "#F7F1E5", fontFamily: "Inter, sans-serif", padding: "2rem 1.25rem", maxWidth: "600px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", color: "#4A5D3A", fontWeight: 400, margin: 0 }}>
            Infinity <em style={{ color: "#C97B5C" }}>Admin</em>
          </h1>
          <p style={{ color: "#6B7B4F", fontSize: "12px", margin: 0 }}>Gestión de pedido</p>
        </div>
        <button onClick={() => router.push("/admin")} style={{ background: "transparent", border: "1px solid #EDE3CD", padding: "0.5rem 1rem", borderRadius: "100px", fontSize: "0.8rem", cursor: "pointer", color: "#4A4F45" }}>
          ← Volver
        </button>
      </div>

      {/* Order number + status */}
      <div style={{ background: "#4A5D3A", borderRadius: "16px", padding: "1.25rem", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: "#C9A96E", fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 4px" }}>Pedido</p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", color: "#F7F1E5", fontWeight: 400, margin: 0 }}>{order.orderNumber}</h2>
        </div>
        <div style={{ background: "rgba(255,255,255,0.1)", padding: "0.5rem 1rem", borderRadius: "100px", textAlign: "center" }}>
          <span style={{ fontSize: "1.2rem" }}>{currentStatus.emoji}</span>
          <p style={{ color: "#F7F1E5", fontSize: "0.78rem", margin: "2px 0 0", fontWeight: 600 }}>{currentStatus.label}</p>
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div style={{ background: "rgba(92,138,94,0.1)", border: "1px solid #5C8A5E", borderRadius: "12px", padding: "0.85rem 1rem", marginBottom: "1rem", color: "#5C8A5E", fontSize: "0.88rem", fontWeight: 500 }}>
          {successMsg}
        </div>
      )}

      {/* WhatsApp link */}
      {waLink && (
        <a href={waLink} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#25D366", color: "white", textDecoration: "none", padding: "0.85rem 1.25rem", borderRadius: "12px", marginBottom: "1rem", fontSize: "0.88rem", fontWeight: 500 }}>
          💬 Enviar WhatsApp al cliente
        </a>
      )}

      {/* Cambiar estado */}
      <div style={{ background: "#FDFAF3", borderRadius: "20px", padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.25rem" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#C97B5C", margin: "0 0 1rem", fontWeight: 600 }}>Cambiar estado</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => updateStatus(key)}
              disabled={updating || order.status === key}
              style={{
                padding: "0.75rem",
                borderRadius: "12px",
                border: order.status === key ? `2px solid ${val.color}` : "1px solid #EDE3CD",
                background: order.status === key ? `${val.color}15` : "#white",
                color: order.status === key ? val.color : "#4A4F45",
                fontWeight: order.status === key ? 700 : 400,
                cursor: updating || order.status === key ? "default" : "pointer",
                fontSize: "0.82rem",
                opacity: updating ? 0.6 : 1,
                fontFamily: "inherit",
              }}
            >
              {val.emoji} {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info cliente */}
      <div style={{ background: "#FDFAF3", borderRadius: "20px", padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.25rem" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#C97B5C", margin: "0 0 1rem", fontWeight: 600 }}>Cliente</p>
        <p style={{ color: "#4A5D3A", fontWeight: 600, margin: "0 0 4px", fontSize: "1rem" }}>{order.customerName}</p>
        <p style={{ color: "#4A4F45", fontSize: "0.88rem", margin: "0 0 4px" }}>📞 {order.customerPhone}</p>
        <p style={{ color: "#4A4F45", fontSize: "0.88rem", margin: "0 0 4px" }}>📧 {order.customerEmail}</p>
        <p style={{ color: "#4A4F45", fontSize: "0.88rem", margin: 0 }}>📍 {order.customerAddress}</p>
      </div>

      {/* Productos */}
      <div style={{ background: "#FDFAF3", borderRadius: "20px", padding: "1.5rem", border: "1px solid #EDE3CD" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#C97B5C", margin: "0 0 1rem", fontWeight: 600 }}>Productos</p>
        {order.items.map((item: any) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid #EDE3CD" }}>
            <span style={{ fontSize: "0.9rem", color: "#4A4F45" }}>{item.quantity}× {item.product.name}</span>
            <span style={{ fontSize: "0.9rem", color: "#4A5D3A", fontWeight: 600 }}>{fmt(Number(item.subtotal))}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.75rem" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem", color: "#4A5D3A" }}>Total</span>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 600 }}>{fmt(Number(order.total))}</span>
        </div>
      </div>

    </main>
  );
}
