import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F7F1E5", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>
      <div style={{ background: "#FDFAF3", borderRadius: 24, padding: "2.5rem 2rem", border: "1px solid #EDE3CD", width: "100%", maxWidth: 400, boxShadow: "0 20px 50px rgba(74,93,58,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🌿</div>
          <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.7rem", color: "#4A5D3A", fontWeight: 400, margin: "0 0 0.4rem" }}>
            Infinity <em style={{ color: "#C97B5C" }}>Admin</em>
          </h2>
          <p style={{ color: "#4A4F45", fontSize: "0.9rem", margin: 0 }}>Centro de operaciones</p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
