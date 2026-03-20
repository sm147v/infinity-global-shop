"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/admin/session", {
        method: "DELETE",
      });
    } finally {
      router.push("/admin/login");
      router.refresh();
      setLoading(false);
    }
  }

  return (
    <button className="btn" type="button" disabled={loading} onClick={handleLogout}>
      {loading ? "Saliendo..." : "Cerrar sesion"}
    </button>
  );
}
