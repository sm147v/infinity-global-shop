"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const STATUS_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  PENDING:   { label: "Pendiente",  emoji: "📋", color: "#C9A96E" },
  PAID:      { label: "Pagado",     emoji: "✅", color: "#5C8A5E" },
  PREPARING: { label: "Preparando", emoji: "📦", color: "#6B7B4F" },
  SHIPPED:   { label: "En camino",  emoji: "🚚", color: "#4A5D3A" },
  DELIVERED: { label: "Entregado",  emoji: "🌿", color: "#4A5D3A" },
  CANCELLED: { label: "Cancelado",  emoji: "❌", color: "#C9533D" },
};

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterStatus = searchParams.get("status") || "ALL";

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  async function loadOrders() {
    const token = localStorage.getItem("adminToken") || "";
    const res = await fetch("/api/admin/orders", {
      headers: { "x-admin-token": token },
    });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, []);

  async function changeStatus(orderId: number, newStatus: string) {
    setUpdating(orderId);
    const token = localStorage.getItem("adminToken") || "";
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) await loadOrders();
    setUpdating(null);
  }

  const filtered = filterStatus === "ALL" ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div style={{ padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "2rem", color: "#4A5D3A", fontWeight: 400, margin: "0 0 0.3rem" }}>Pedidos</h1>
        <p style={{ color: "#4A4F45", fontSize: "0.9rem", margin: 0 }}>{orders.length} pedidos en total</p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", marginBottom: "1.5rem", paddingBottom: "0.5rem" }}>
        <button
          onClick={() => router.push("/admin/orders")}
          style={{
            flexShrink: 0,
            padding: "0.55rem 1.1rem",
            background: filterStatus === "ALL" ? "#4A5D3A" : "#FDFAF3",
            color: filterStatus === "ALL" ? "#F7F1E5" : "#4A4F45",
            border: "1px solid " + (filterStatus === "ALL" ? "#4A5D3A" : "#EDE3CD"),
            borderRadius: 100,
            fontSize: "0.85rem",
            fontWeight: filterStatus === "ALL" ? 600 : 400,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Todos ({orders.length})
        </button>
        {Object.entries(STATUS_LABELS).map(([key, val]) => {
          const count = orders.filter(o => o.status === key).length;
          const active = filterStatus === key;
          return (
            <button
              key={key}
              onClick={() => router.push(`/admin/orders?status=${key}`)}
              style={{
                flexShrink: 0,
                padding: "0.55rem 1.1rem",
                background: active ? val.color : "#FDFAF3",
                color: active ? "white" : "#4A4F45",
                border: "1px solid " + (active ? val.color : "#EDE3CD"),
                borderRadius: 100,
                fontSize: "0.85rem",
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {val.emoji} {val.label} ({count})
            </button>
          );
        })}
      </div>

      {loading && (
        <p style={{ textAlign: "center", color: "#4A5D3A", padding: "2rem" }}>Cargando pedidos...</p>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ background: "#FDFAF3", borderRadius: 18, padding: "3rem 2rem", textAlign: "center", border: "1px solid #EDE3CD" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📭</div>
          <p style={{ color: "#4A4F45" }}>No hay pedidos con este estado</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {filtered.map(order => {
            const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.PENDING;
            const phone = (order.customerPhone || "").replace(/\D/g, "");
            const waNumber = phone.startsWith("57") ? phone : "57" + phone;
            const waMessage = encodeURIComponent("Hola " + order.customerName + ", te escribo de Infinity Global Shop sobre tu pedido " + (order.orderNumber || "#" + order.id) + " 💛");

            return (
              <div key={order.id} style={{ background: "#FDFAF3", borderRadius: 16, padding: "1.25rem", border: "1px solid #EDE3CD" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.1rem", color: "#4A5D3A", margin: "0 0 0.2rem", fontWeight: 500 }}>
                      {order.orderNumber || ("#" + order.id)}
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "#4A4F45", margin: 0 }}>
                      {order.customerName} · {new Date(order.createdAt).toLocaleString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div style={{
                    background: statusInfo.color + "20",
                    color: statusInfo.color,
                    padding: "0.35rem 0.85rem",
                    borderRadius: 100,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                  }}>
                    {statusInfo.emoji} {statusInfo.label}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.85rem", fontSize: "0.82rem", color: "#4A4F45" }}>
                  <div>📞 {order.customerPhone}</div>
                  <div>📧 {order.customerEmail || "—"}</div>
                  <div style={{ gridColumn: "1 / -1" }}>📍 {order.customerAddress}</div>
                </div>

                <div style={{ background: "#F7F1E5", borderRadius: 12, padding: "0.85rem", marginBottom: "0.85rem" }}>
                  {(order.items || []).map((item: any) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", padding: "0.2rem 0" }}>
                      <span style={{ color: "#4A4F45" }}>{item.quantity}× {item.product?.name || "—"}</span>
                      <span style={{ color: "#4A5D3A", fontWeight: 600 }}>{fmt(Number(item.subtotal))}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.5rem", marginTop: "0.4rem", borderTop: "1px solid #EDE3CD" }}>
                    <strong style={{ color: "#4A5D3A", fontSize: "0.9rem" }}>Total</strong>
                    <strong style={{ color: "#4A5D3A", fontSize: "1rem", fontFamily: "var(--font-fraunces), Georgia, serif" }}>{fmt(Number(order.total))}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {Object.entries(STATUS_LABELS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => changeStatus(order.id, key)}
                      disabled={updating === order.id || order.status === key}
                      style={{
                        padding: "0.5rem 0.85rem",
                        borderRadius: 100,
                        border: "1px solid " + (order.status === key ? val.color : "#EDE3CD"),
                        background: order.status === key ? val.color + "20" : "#FDFAF3",
                        color: order.status === key ? val.color : "#4A4F45",
                        fontSize: "0.75rem",
                        fontWeight: order.status === key ? 600 : 400,
                        cursor: updating === order.id || order.status === key ? "default" : "pointer",
                        fontFamily: "inherit",
                        opacity: updating === order.id ? 0.5 : 1,
                      }}
                    >
                      {val.emoji} {val.label}
                    </button>
                  ))}
                  <a href={"https://wa.me/" + waNumber + "?text=" + waMessage} target="_blank" rel="noreferrer" style={{
                    padding: "0.5rem 0.85rem",
                    borderRadius: 100,
                    background: "#25D366",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    marginLeft: "auto",
                  }}>
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
