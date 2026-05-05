"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pendientes",  color: "#C9A96E" },
  PAID:      { label: "Pagados",     color: "#5C8A5E" },
  PREPARING: { label: "Preparando",  color: "#6B7B4F" },
  SHIPPED:   { label: "En camino",   color: "#4A5D3A" },
  DELIVERED: { label: "Entregados",  color: "#4A5D3A" },
  CANCELLED: { label: "Cancelados",  color: "#C9533D" },
};

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, unknown>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("adminToken") || "";
      const res = await fetch("/api/admin/dashboard", {
        headers: { "x-admin-token": token },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <p style={{ color: "#4A5D3A" }}>Cargando dashboard...</p>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div style={{ padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.85rem", color: "#C97B5C", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.4rem", fontWeight: 600 }}>
          {today}
        </p>
        <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "2rem", color: "#4A5D3A", fontWeight: 400, margin: 0 }}>
          Bienvenida de vuelta 🌿
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "#FDFAF3", borderRadius: 16, padding: "1.25rem", border: "1px solid #EDE3CD" }}>
          <p style={{ fontSize: "0.75rem", color: "#4A4F45", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.4rem" }}>Pedidos hoy</p>
          <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.8rem", color: "#4A5D3A", margin: 0, fontWeight: 500 }}>
            {stats?.todayCount ?? 0}
          </p>
        </div>
        <div style={{ background: "#FDFAF3", borderRadius: 16, padding: "1.25rem", border: "1px solid #EDE3CD" }}>
          <p style={{ fontSize: "0.75rem", color: "#4A4F45", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.4rem" }}>Ventas hoy</p>
          <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.8rem", color: "#4A5D3A", margin: 0, fontWeight: 500 }}>
            {fmt(stats?.todayRevenue ?? 0)}
          </p>
        </div>
        <div style={{ background: "#FDFAF3", borderRadius: 16, padding: "1.25rem", border: "1px solid #EDE3CD" }}>
          <p style={{ fontSize: "0.75rem", color: "#4A4F45", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.4rem" }}>Pedidos del mes</p>
          <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.8rem", color: "#4A5D3A", margin: 0, fontWeight: 500 }}>
            {stats?.monthCount ?? 0}
          </p>
        </div>
        <div style={{ background: "#4A5D3A", borderRadius: 16, padding: "1.25rem", color: "#F7F1E5" }}>
          <p style={{ fontSize: "0.75rem", color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.4rem", fontWeight: 600 }}>Ventas del mes</p>
          <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.8rem", margin: 0, fontWeight: 500 }}>
            {fmt(stats?.monthRevenue ?? 0)}
          </p>
        </div>
      </div>

      <div style={{ background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.3rem", color: "#4A5D3A", fontWeight: 500, margin: 0 }}>
            Estado de pedidos
          </h2>
          <Link href="/admin/orders" style={{ color: "#C97B5C", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
            Ver todos →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem" }}>
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <Link key={key} href={"/admin/orders?status=" + key} style={{
              background: "#F7F1E5",
              padding: "0.85rem",
              borderRadius: 12,
              textDecoration: "none",
              border: "2px solid " + val.color + "30",
              display: "block",
            }}>
              <p style={{ fontSize: "0.7rem", color: "#4A4F45", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.3rem" }}>
                {val.label}
              </p>
              <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.5rem", color: val.color, margin: 0, fontWeight: 600 }}>
                {stats?.byStatus?.[key] ?? 0}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <Link href="/admin/orders" style={{
          background: "#4A5D3A",
          color: "#F7F1E5",
          padding: "1.25rem",
          borderRadius: 16,
          textDecoration: "none",
          display: "block",
        }}>
          <p style={{ margin: "0 0 0.4rem", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#C9A96E" }}>Acción rápida</p>
          <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", margin: 0, fontWeight: 400 }}>
            Ver pedidos pendientes →
          </p>
        </Link>
        <Link href="/admin/products" style={{
          background: "#FDFAF3",
          border: "1px solid #EDE3CD",
          color: "#4A5D3A",
          padding: "1.25rem",
          borderRadius: 16,
          textDecoration: "none",
          display: "block",
        }}>
          <p style={{ margin: "0 0 0.4rem", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#C97B5C" }}>Catálogo</p>
          <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", margin: 0, fontWeight: 400 }}>
            Subir imágenes de productos →
          </p>
        </Link>
      </div>
    </div>
  );
}
