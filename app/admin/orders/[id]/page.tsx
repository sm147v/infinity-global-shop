"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Order } from "@/lib/types";

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
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [waLink, setWaLink] = useState("");

  const loadOrder = useCallback(async () => {
    const token = localStorage.getItem("adminToken") || "";
    const res = await fetch("/api/orders/" + orderId, {
      headers: { "x-admin-token": token },
    });
    if (res.ok) {
      const data = await res.json();
      setOrder(data.order);
    }
    setLoading(false);
  }, [orderId]);

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    setSuccessMsg("");
    setWaLink("");
    setError("");
    const token = localStorage.getItem("adminToken") || "";
    const res = await fetch("/api/orders/" + orderId + "/status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const data = await res.json();
      setOrder(data.order);
      setWaLink(data.whatsappLink);
      setSuccessMsg("✅ Estado actualizado a " + STATUS_LABELS[newStatus].emoji + " " + STATUS_LABELS[newStatus].label);
    } else {
      setError("Error al actualizar");
    }
    setUpdating(false);
  }

  useEffect(() => {
    loadOrder(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadOrder]);

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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", color: "#4A5D3A", fontWeight: 400, margin: 0 }}>
          Pedido <em style={{ color: "#C97B5C" }}>{order.orderNumber || ("#" + order.id)}</em>
        </h1>
        <button onClick={() => router.push("/admin/orders")} style={{ background: "transparent", border: "1px solid #EDE3CD", padding: "0.5rem 1rem", borderRadius: 100, fontSize: "0.8rem", cursor: "pointer", color: "#4A4F45" }}>
          ← Volver
        </button>
      </div>

      <div style={{ background: "#4A5D3A", borderRadius: 16, padding: "1.25rem", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: "#C9A96E", fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 4px" }}>Estado actual</p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", color: "#F7F1E5", fontWeight: 400, margin: 0 }}>
            {currentStatus.emoji} {currentStatus.label}
          </h2>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: "rgba(92,138,94,0.1)", border: "1px solid #5C8A5E", borderRadius: 12, padding: "0.85rem 1rem", marginBottom: "1rem", color: "#5C8A5E", fontSize: "0.88rem", fontWeight: 500 }}>
          {successMsg}
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(201,83,61,0.1)", border: "1px solid #C9533D", borderRadius: 12, padding: "0.85rem 1rem", marginBottom: "1rem", color: "#C9533D", fontSize: "0.88rem" }}>
          {error}
        </div>
      )}

      {waLink && (
        <a href={waLink} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#25D366", color: "white", textDecoration: "none", padding: "0.85rem 1.25rem", borderRadius: 12, marginBottom: "1rem", fontSize: "0.88rem", fontWeight: 500 }}>
          💬 Enviar WhatsApp al cliente
        </a>
      )}

      <div style={{ background: "#FDFAF3", borderRadius: 20, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.25rem" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#C97B5C", margin: "0 0 1rem", fontWeight: 600 }}>Cambiar estado</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => updateStatus(key)}
              disabled={updating || order.status === key}
              style={{
                padding: "0.75rem",
                borderRadius: 12,
                border: order.status === key ? "2px solid " + val.color : "1px solid #EDE3CD",
                background: order.status === key ? val.color + "15" : "#FDFAF3",
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

      <div style={{ background: "#FDFAF3", borderRadius: 20, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.25rem" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#C97B5C", margin: "0 0 1rem", fontWeight: 600 }}>Cliente</p>
        <p style={{ color: "#4A5D3A", fontWeight: 600, margin: "0 0 4px", fontSize: "1rem" }}>{order.customerName}</p>
        <p style={{ color: "#4A4F45", fontSize: "0.88rem", margin: "0 0 4px" }}>📞 {order.customerPhone}</p>
        <p style={{ color: "#4A4F45", fontSize: "0.88rem", margin: "0 0 4px" }}>📧 {order.customerEmail || "—"}</p>
        <p style={{ color: "#4A4F45", fontSize: "0.88rem", margin: 0 }}>📍 {order.customerAddress}</p>
      </div>

      <div style={{ background: "#FDFAF3", borderRadius: 20, padding: "1.5rem", border: "1px solid #EDE3CD" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#C97B5C", margin: "0 0 1rem", fontWeight: 600 }}>Productos</p>
        {order.items.map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid #EDE3CD" }}>
            <span style={{ fontSize: "0.9rem", color: "#4A4F45" }}>{item.quantity}× {item.name}</span>
            <span style={{ fontSize: "0.9rem", color: "#4A5D3A", fontWeight: 600 }}>{fmt(item.quantity * item.price)}</span>
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
