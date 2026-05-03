"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "PENDING" | "PAID" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type Props = {
  orderId: number;
  status: Status;
};

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "PENDING",   label: "Pendiente" },
  { value: "PAID",      label: "Pagado" },
  { value: "PREPARING", label: "Preparando" },
  { value: "SHIPPED",   label: "En camino" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
];

export function AdminOrderActions({ orderId, status: initialStatus }: Props) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function updateStatus(nextStatus: Status) {
    try {
      setSaving(true);
      setMessage(null);
      const token = localStorage.getItem("adminToken") || "";
      const response = await fetch("/api/orders/" + orderId + "/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "No se pudo actualizar");
      }
      setStatus(nextStatus);
      setMessage("✅ Guardado");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="select"
        value={status}
        disabled={saving}
        onChange={(e) => updateStatus(e.target.value as Status)}
        style={{
          padding: "0.5rem 0.85rem",
          borderRadius: 100,
          border: "1px solid #EDE3CD",
          background: "#FDFAF3",
          color: "#4A5D3A",
          fontSize: "0.85rem",
          fontFamily: "inherit",
          cursor: saving ? "wait" : "pointer",
        }}
      >
        {STATUS_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {message && <span style={{ fontSize: "0.78rem", color: message.startsWith("✅") ? "#5C8A5E" : "#C9533D" }}>{message}</span>}
    </div>
  );
}
