"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CartItem, loadCart, saveCart } from "@/lib/cart";

export function CheckoutClient() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const isMockPaid = searchParams.get("mockPaid") === "1";
    const orderId = Number(searchParams.get("orderId"));
    const transactionId = searchParams.get("transactionId");

    if (!isMockPaid || !Number.isInteger(orderId) || !transactionId) {
      return;
    }

    const key = `mock_confirmed_${orderId}`;
    if (sessionStorage.getItem(key)) {
      return;
    }

    sessionStorage.setItem(key, "1");
    void (async () => {
      try {
        await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            transactionId,
            status: "APPROVED",
          }),
        });

        setMessage(`Pago confirmado para la orden #${orderId}`);
        setItems([]);
        saveCart([]);
      } catch {
        setError("No se pudo confirmar el pago mock.");
      }
    })();
  }, [searchParams]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  function setQuantity(productId: number, quantity: number) {
    const normalized = Math.min(20, Math.max(1, quantity));
    const updated = items.map((item) =>
      item.productId === productId ? { ...item, quantity: normalized } : item,
    );
    setItems(updated);
    saveCart(updated);
  }

  function increaseQuantity(productId: number) {
    const item = items.find((entry) => entry.productId === productId);
    if (!item) return;
    setQuantity(productId, item.quantity + 1);
  }

  function decreaseQuantity(productId: number) {
    const item = items.find((entry) => entry.productId === productId);
    if (!item) return;
    setQuantity(productId, item.quantity - 1);
  }

  function removeItem(productId: number) {
    const updated = items.filter((item) => item.productId !== productId);
    setItems(updated);
    saveCart(updated);
  }

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (items.length === 0) {
      setError("El carrito esta vacio.");
      return;
    }

    try {
      setLoading(true);

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerAddress,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const orderJson = (await orderResponse.json()) as {
        orderId?: number;
        error?: string;
      };

      if (!orderResponse.ok || !orderJson.orderId) {
        throw new Error(orderJson.error ?? "No se pudo crear la orden");
      }

      const paymentResponse = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderJson.orderId }),
      });

      const paymentJson = (await paymentResponse.json()) as {
        paymentUrl?: string;
        error?: string;
      };

      if (!paymentResponse.ok || !paymentJson.paymentUrl) {
        throw new Error(paymentJson.error ?? "No se pudo iniciar el pago");
      }

      window.location.href = paymentJson.paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card p-5 sm:p-6">
        <h2 className="text-2xl font-semibold">Resumen de compra</h2>
        <div className="mt-4 space-y-3">
          {items.length === 0 && (
            <div className="soft-panel p-4">
              <p className="muted">No hay productos en carrito.</p>
              <Link className="btn mt-3" href="/products">
                Explorar productos
              </Link>
            </div>
          )}
          {items.map((item) => (
            <article key={item.productId} className="soft-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg border border-line object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg border border-line bg-white" />
                  )}

                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm muted">${item.price.toFixed(2)} c/u</p>
                  </div>
                </div>
                <button
                  className="btn btn-danger px-3"
                  type="button"
                  onClick={() => removeItem(item.productId)}
                >
                  Eliminar
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-lg border border-line bg-white p-1">
                  <button
                    className="btn px-3 py-1"
                    type="button"
                    onClick={() => decreaseQuantity(item.productId)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="min-w-7 text-center font-semibold">{item.quantity}</span>
                  <button
                    className="btn px-3 py-1"
                    type="button"
                    onClick={() => increaseQuantity(item.productId)}
                    disabled={item.quantity >= 20}
                  >
                    +
                  </button>
                </div>

                <input
                  className="field max-w-20"
                  type="number"
                  min={1}
                  max={20}
                  value={item.quantity}
                  aria-label={`Cantidad de ${item.name}`}
                  onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                />

                <p className="text-sm font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-5 rounded-xl bg-slate-900 p-4 text-white">
          <p className="text-sm text-slate-300">Total a pagar</p>
          <p className="mt-1 text-2xl font-bold">${total.toFixed(2)}</p>
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-2xl font-semibold">Datos del cliente</h2>
        <form className="mt-4 space-y-3" onSubmit={handleCheckout}>
          <input
            className="field"
            placeholder="Nombre"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <input
            className="field"
            placeholder="Telefono"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
          <textarea
            className="field"
            placeholder="Direccion"
            rows={3}
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-700">{error}</p>}
          {message && <p className="text-sm text-emerald-700">{message}</p>}

          <button className="btn btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Procesando..." : "Crear orden y pagar"}
          </button>
        </form>
      </section>
    </div>
  );
}
