"use client";

import { useState } from "react";

type Props = {
  orderId: number;
  deliveryStatus: "PENDING" | "ON_ROUTE" | "DELIVERED";
};

export function AdminOrderActions({ orderId, deliveryStatus }: Props) {
  const [status, setStatus] = useState(deliveryStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function updateStatus(nextStatus: "PENDING" | "ON_ROUTE" | "DELIVERED") {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryStatus: nextStatus }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo actualizar");
      }

      setStatus(nextStatus);
      setMessage("Guardado");
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
        onChange={(e) => updateStatus(e.target.value as "PENDING" | "ON_ROUTE" | "DELIVERED")}
      >
        <option value="PENDING">pendiente</option>
        <option value="ON_ROUTE">en camino</option>
        <option value="DELIVERED">entregado</option>
      </select>
      {message && <span className="text-xs muted">{message}</span>}
    </div>
  );
}
