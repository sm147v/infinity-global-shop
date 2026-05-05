"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

interface Notification {
  id: string;
  type: "order" | "stock";
  title: string;
  body: string;
  time: Date;
  read: boolean;
  link: string;
}

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Track state without triggering re-renders
  const lastOrderIdRef = useRef<number | null>(null);
  const lastStockCheckRef = useRef<number>(0);

  const unread = notifications.filter(n => !n.read).length;

  const fetchUpdates = useCallback(async () => {
    const token = localStorage.getItem("adminToken") || "";
    try {
      // Nuevos pedidos
      const ordersRes = await fetch("/api/admin/orders?limit=5", {
        headers: { "x-admin-token": token },
      });
      if (ordersRes.ok) {
        const { orders } = await ordersRes.json();
        if (orders?.length > 0) {
          const newest = orders[0];
          if (lastOrderIdRef.current !== null && newest.id > lastOrderIdRef.current) {
            const newOrders = orders.filter((o: {id: number; customerName: string; total: number; createdAt: string}) => o.id > lastOrderIdRef.current!);
            setNotifications(prev => [
              ...newOrders.map((o: {id: number; customerName: string; total: number; createdAt: string}) => ({
                id: `order-${o.id}`,
                type: "order" as const,
                title: "🛒 Nuevo pedido",
                body: `${o.customerName} · $${Math.round(Number(o.total)).toLocaleString("es-CO")}`,
                time: new Date(o.createdAt),
                read: false,
                link: "/admin/orders",
              })),
              ...prev,
            ].slice(0, 20));
            // Vibrar/sonar si el browser lo permite
            if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
          }
          lastOrderIdRef.current = newest.id;
        }
      }

      // Stock bajo (cada 5 minutos)
      const now = Date.now();
      if (now - lastStockCheckRef.current > 300_000) {
        const productsRes = await fetch("/api/admin/products", {
          headers: { "x-admin-token": token },
        });
        if (productsRes.ok) {
          const { products } = await productsRes.json();
          const lowStock = products.filter((p: {id: number; name: string; stock: number}) => p.stock <= 2 && p.stock > 0);
          const outOfStock = products.filter((p: {id: number; name: string; stock: number}) => p.stock === 0);
          if (lowStock.length > 0) {
            setNotifications(prev => {
              const ids = new Set(prev.map(n => n.id));
              const newOnes = lowStock
                .filter((p: {id: number; name: string; stock: number}) => !ids.has(`stock-${p.id}-${p.stock}`))
                .map((p: {id: number; name: string; stock: number}) => ({
                  id: `stock-${p.id}-${p.stock}`,
                  type: "stock" as const,
                  title: "⚠️ Stock bajo",
                  body: `${p.name} — solo ${p.stock} unidad${p.stock === 1 ? "" : "es"}`,
                  time: new Date(),
                  read: false,
                  link: "/admin/products",
                }));
              return [...newOnes, ...prev].slice(0, 20);
            });
          }
          if (outOfStock.length > 0) {
            setNotifications(prev => {
              const ids = new Set(prev.map(n => n.id));
              const newOnes = outOfStock
                .filter((p: {id: number; name: string; stock: number}) => !ids.has(`out-${p.id}`))
                .map((p: {id: number; name: string; stock: number}) => ({
                  id: `out-${p.id}`,
                  type: "stock" as const,
                  title: "🚨 Sin stock",
                  body: `${p.name} — agotado`,
                  time: new Date(),
                  read: false,
                  link: "/admin/products",
                }));
              return [...newOnes, ...prev].slice(0, 20);
            });
          }
        }
        lastStockCheckRef.current = now;
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 30_000);
    return () => clearInterval(interval);
  }, [fetchUpdates]);

  // Cerrar al click fuera
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  if (!pathname?.startsWith("/admin")) return null;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000); // eslint-disable-line react-hooks/purity
  if (diff < 60) return "ahora";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
}

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => { setOpen(o => !o); if (!open) markAllRead(); }}
        style={{
          position: "relative",
          background: unread > 0 ? "#4A5D3A" : "transparent",
          border: unread > 0 ? "none" : "1px solid #EDE3CD",
          borderRadius: "50%",
          width: 40,
          height: 40,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: unread > 0 ? "#F7F1E5" : "#4A5D3A",
          transition: "all 0.2s",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{
            position: "absolute",
            top: -2,
            right: -2,
            background: "#C9533D",
            color: "#fff",
            borderRadius: "50%",
            width: 18,
            height: 18,
            fontSize: "0.65rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #F7F1E5",
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          width: 340,
          maxHeight: "calc(100vh - 120px)",
          background: "#FDFAF3",
          border: "1px solid #EDE3CD",
          borderRadius: 18,
          boxShadow: "0 12px 48px rgba(74,93,58,0.18)",
          zIndex: 9999,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ padding: "1rem 1.25rem 0.75rem", borderBottom: "1px solid #EDE3CD", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1rem", color: "#4A5D3A", margin: 0, fontWeight: 500 }}>
              Notificaciones
            </h3>
            {notifications.length > 0 && (
              <button onClick={() => setNotifications([])} style={{ background: "none", border: "none", fontSize: "0.75rem", color: "#C97B5C", cursor: "pointer", fontFamily: "inherit" }}>
                Limpiar
              </button>
            )}
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌿</div>
                <p style={{ color: "#4A4F45", fontSize: "0.85rem", margin: 0 }}>Todo tranquilo por ahora</p>
              </div>
            ) : (
              notifications.map(n => (
                <a key={n.id} href={n.link} onClick={() => setOpen(false)} style={{
                  display: "block",
                  padding: "0.85rem 1.25rem",
                  borderBottom: "1px solid rgba(237,227,205,0.5)",
                  textDecoration: "none",
                  background: n.read ? "transparent" : "rgba(74,93,58,0.04)",
                  transition: "background 0.15s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#4A5D3A", margin: "0 0 0.2rem" }}>{n.title}</p>
                      <p style={{ fontSize: "0.78rem", color: "#4A4F45", margin: 0, lineHeight: 1.4 }}>{n.body}</p>
                    </div>
                    <span style={{ fontSize: "0.68rem", color: "#6B7B4F", whiteSpace: "nowrap", marginTop: "0.1rem" }}>
                      {timeAgo(n.time)}
                    </span>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
