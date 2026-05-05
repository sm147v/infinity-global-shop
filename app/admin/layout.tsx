"use client";
import { AdminNotifications } from "@/components/admin-notifications";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/orders", label: "Pedidos", icon: "📦" },
  { href: "/admin/products", label: "Productos", icon: "🛍️" },
  { href: "/admin/coupons", label: "Cupones", icon: "🎟️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("adminToken");
    if (saved) { setAuthed(true); setToken(saved); }
    setChecking(false);
  }, []);

  async function login() {
    if (!token) return;
    setError("");
    
    // Llamar ambos endpoints: verify (legacy) y session (cookie httpOnly)
    const [verifyRes, sessionRes] = await Promise.all([
      fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }),
      fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }),
    ]);
    
    if (verifyRes.ok && sessionRes.ok) {
      localStorage.setItem("adminToken", token);
      setAuthed(true);
    } else {
      setError("Token incorrecto, intenta de nuevo");
    }
  }

  async function logout() {
    localStorage.removeItem("adminToken");
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
    setAuthed(false);
    setToken("");
    router.push("/");
  }

  if (checking) {
    return <div style={{ minHeight: "100vh", background: "#F7F1E5", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#4A5D3A", fontFamily: "Georgia, serif" }}>Cargando...</p></div>;
  }

  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", background: "#F7F1E5", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>
        <div style={{ background: "#FDFAF3", borderRadius: 24, padding: "2.5rem 2rem", border: "1px solid #EDE3CD", width: "100%", maxWidth: 400, boxShadow: "0 20px 50px rgba(74, 93, 58, 0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🌿</div>
            <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.7rem", color: "#4A5D3A", fontWeight: 400, margin: "0 0 0.4rem" }}>
              Infinity <em style={{ color: "#C97B5C" }}>Admin</em>
            </h2>
            <p style={{ color: "#4A4F45", fontSize: "0.9rem", margin: 0 }}>Centro de operaciones</p>
          </div>

          <input
            type="password"
            placeholder="Ingresa tu token de acceso"
            value={token}
            onChange={e => setToken(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{ width: "100%", padding: "1rem 1.25rem", borderRadius: 100, border: "1px solid #EDE3CD", fontSize: "0.95rem", marginBottom: "1rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
          />
          {error && <p style={{ color: "#C9533D", fontSize: "0.85rem", textAlign: "center", margin: "0 0 1rem" }}>⚠️ {error}</p>}
          <button onClick={login} style={{ width: "100%", background: "#4A5D3A", color: "#F7F1E5", border: "none", padding: "1.1rem", borderRadius: 100, fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            Iniciar sesión
          </button>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <Link href="/" style={{ color: "#4A4F45", fontSize: "0.85rem", textDecoration: "none" }}>
              ← Volver a la tienda
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="admin-mobile-toggle"
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 200,
          background: "#4A5D3A",
          color: "#F7F1E5",
          border: "none",
          width: 44,
          height: 44,
          borderRadius: "50%",
          cursor: "pointer",
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        ☰
      </button>

      <div style={{ display: "flex" }}>
        <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
          <div style={{ padding: "1.25rem", borderBottom: "1px solid #EDE3CD" }}>
            <Link href="/admin" style={{ textDecoration: "none" }}>
              <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.3rem", color: "#4A5D3A", fontWeight: 400, margin: 0 }}>
                Infinity <em style={{ color: "#C97B5C" }}>Admin</em>
              </h2>
            </Link>
          </div>

          <nav style={{ padding: "1rem 0.75rem", flex: 1 }}>
            {menuItems.map(item => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.85rem 1rem",
                    borderRadius: 12,
                    marginBottom: "0.25rem",
                    background: active ? "#4A5D3A" : "transparent",
                    color: active ? "#F7F1E5" : "#4A4F45",
                    textDecoration: "none",
                    fontSize: "0.92rem",
                    fontWeight: active ? 600 : 400,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #EDE3CD" }}>
            <Link href="/" style={{
              display: "block",
              textAlign: "center",
              padding: "0.6rem",
              fontSize: "0.8rem",
              color: "#4A4F45",
              textDecoration: "none",
              marginBottom: "0.5rem",
            }}>
              ← Ir a la tienda
            </Link>
            <button onClick={logout} style={{
              width: "100%",
              background: "transparent",
              border: "1px solid #EDE3CD",
              color: "#C9533D",
              padding: "0.7rem",
              borderRadius: 100,
              fontSize: "0.85rem",
              cursor: "pointer",
              fontFamily: "inherit",
            }}>
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main style={{ flex: 1, minHeight: "100vh", overflow: "auto", display: "flex", flexDirection: "column" }}>
          <header style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "#FDFAF3",
            borderBottom: "1px solid #EDE3CD",
            padding: "0.6rem 1.5rem",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}>
            <AdminNotifications />
          </header>
          <div style={{ flex: 1 }}>
            {children}
          </div>
        </main>
      </div>

      <style>{`
        .admin-sidebar {
          width: 240px;
          min-height: 100vh;
          position: sticky;
          top: 0;
          background: #FDFAF3;
          border-right: 1px solid #EDE3CD;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 768px) {
          .admin-mobile-toggle {
            display: flex !important;
          }
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: -260px;
            transition: left 0.3s;
            z-index: 150;
            box-shadow: 4px 0 20px rgba(0,0,0,0.1);
          }
          .admin-sidebar.open {
            left: 0;
          }
        }
      `}</style>
    </div>
  );
}
