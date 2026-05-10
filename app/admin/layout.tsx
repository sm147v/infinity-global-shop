"use client";
import { AdminNotifications } from "@/components/admin-notifications";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: "Casa" },
  { href: "/admin/orders", label: "Pedidos", icon: "Caja" },
  { href: "/admin/products", label: "Productos", icon: "Tienda" },
  { href: "/admin/coupons", label: "Cupones", icon: "Ticket" },
  { href: "/admin/discounts", label: "Descuentos", icon: "Tag" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAuthed(true);
    } else if (!isLoginPage) {
      router.replace("/admin/login");
    }
    setMounted(true);
  }, [router, isLoginPage]);

  async function logout() {
    localStorage.removeItem("adminToken");
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
    router.push("/admin/login");
  }

  if (!mounted) return null;
  if (isLoginPage) return <>{children}</>;
  if (!authed) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>
      <button onClick={() => setMobileOpen(!mobileOpen)} className="admin-mobile-toggle"
        style={{ position: "fixed", top: "1rem", left: "1rem", zIndex: 200, background: "#4A5D3A", color: "#F7F1E5", border: "none", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "none", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
        menu
      </button>
      <div style={{ display: "flex" }}>
        <aside className={"admin-sidebar" + (mobileOpen ? " open" : "")}>
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
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1rem", borderRadius: 12, marginBottom: "0.25rem", background: active ? "#4A5D3A" : "transparent", color: active ? "#F7F1E5" : "#4A4F45", textDecoration: "none", fontSize: "0.92rem", fontWeight: active ? 600 : 400 }}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #EDE3CD" }}>
            <Link href="/" style={{ display: "block", textAlign: "center", padding: "0.6rem", fontSize: "0.8rem", color: "#4A4F45", textDecoration: "none", marginBottom: "0.5rem" }}>
              Ir a la tienda
            </Link>
            <button onClick={logout} style={{ width: "100%", background: "transparent", border: "1px solid #EDE3CD", color: "#C9533D", padding: "0.7rem", borderRadius: 100, fontSize: "0.85rem", cursor: "pointer", fontFamily: "inherit" }}>
              Cerrar sesion
            </button>
          </div>
        </aside>
        <main style={{ flex: 1, minHeight: "100vh", overflow: "auto", display: "flex", flexDirection: "column" }}>
          <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#FDFAF3", borderBottom: "1px solid #EDE3CD", padding: "0.6rem 1.5rem", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <AdminNotifications />
          </header>
          <div style={{ flex: 1 }}>{children}</div>
        </main>
      </div>
      <style>{`
        .admin-sidebar { width: 240px; min-height: 100vh; position: sticky; top: 0; background: #FDFAF3; border-right: 1px solid #EDE3CD; display: flex; flex-direction: column; }
        @media (max-width: 768px) {
          .admin-mobile-toggle { display: flex !important; }
          .admin-sidebar { position: fixed; top: 0; left: -260px; transition: left 0.3s; z-index: 150; }
          .admin-sidebar.open { left: 0; }
        }
      `}</style>
    </div>
  );
}
