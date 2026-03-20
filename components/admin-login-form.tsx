"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo iniciar sesion");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="text-sm font-medium" htmlFor="admin-token">
        Token de administrador
      </label>
      <input
        id="admin-token"
        className="field"
        type="password"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Ingresa tu token"
        autoComplete="off"
        required
      />

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button className="btn btn-primary w-full" type="submit" disabled={loading}>
        {loading ? "Validando..." : "Entrar"}
      </button>
    </form>
  );
}
