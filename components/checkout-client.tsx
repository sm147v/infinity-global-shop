"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CartItem, loadCart, saveCart } from "@/lib/cart";
import { useCart } from "./cart-context";
import { CouponInput } from "@/components/coupon-input";

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");

export function CheckoutClient() {
  const searchParams = useSearchParams();
  const { appliedCoupon, applyCoupon } = useCart();
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setItems(loadCart());
  }, []);

  // Cuando regresa del mock pago, confirmar y redirigir a gracias
  useEffect(() => {
    const isMockPaid = searchParams.get("mockPaid") === "1";
    const orderId = Number(searchParams.get("orderId"));
    const orderNumber = searchParams.get("orderNumber") || "";
    const transactionId = searchParams.get("transactionId");
    if (!isMockPaid || !Number.isInteger(orderId) || !transactionId) return;
    const key = "mock_confirmed_" + orderId;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    void (async () => {
      try {
        await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, transactionId, status: "APPROVED" }),
        });
        saveCart([]);
        window.dispatchEvent(new Event("igs-cart-updated"));
        window.location.href = "/gracias?orderNumber=" + orderNumber;
      } catch {
        setError("No se pudo confirmar el pago.");
      }
    })();
  }, [searchParams]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const baseFreeShipping = subtotal >= 150000;
  const couponFreeShipping = appliedCoupon ? appliedCoupon.freeShipping : false;
  const isFreeShipping = baseFreeShipping || couponFreeShipping;
  const shipping = isFreeShipping ? 0 : 8000;
  const couponDiscount = (appliedCoupon && !appliedCoupon.freeShipping) ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal + shipping - couponDiscount);

  function setQuantity(productId: number, quantity: number) {
    const normalized = Math.min(20, Math.max(1, quantity));
    const updated = items.map((item) =>
      item.productId === productId ? { ...item, quantity: normalized } : item,
    );
    setItems(updated);
    saveCart(updated);
  }

  function removeItem(productId: number) {
    const updated = items.filter((item) => item.productId !== productId);
    setItems(updated);
    saveCart(updated);
  }

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("El carrito está vacío.");
      return;
    }

    try {
      setLoading(true);
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const orderJson = await orderResponse.json();
      if (!orderResponse.ok || !orderJson.orderId) {
        throw new Error(orderJson.error || "No se pudo crear la orden");
      }

      // Llamar al payment para crear la URL del mock o de Wompi real
      const paymentResponse = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderJson.orderId }),
      });

      const paymentJson = await paymentResponse.json();
      if (!paymentResponse.ok || !paymentJson.paymentUrl) {
        throw new Error(paymentJson.error || "No se pudo iniciar el pago");
      }

      // Si es mock, agregar el orderNumber a la URL
      let paymentUrl = paymentJson.paymentUrl;
      if (paymentUrl.includes("mockPaid=1")) {
        paymentUrl += "&orderNumber=" + (orderJson.orderNumber || "");
      } else {
        // Es Wompi real - limpiar carrito ya, porque la persona se va a otra página
        saveCart([]);
        window.dispatchEvent(new Event("igs-cart-updated"));
      }

      window.location.href = paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: "1.5rem", maxWidth: 1100, margin: "0 auto", padding: "1rem" }} className="checkout-grid">

      <section style={{ background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD" }}>
        <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.4rem", color: "#4A5D3A", margin: "0 0 1.25rem", fontWeight: 500 }}>
          Resumen de compra
        </h2>

        {items.length === 0 && (
          <div style={{ background: "#F7F1E5", padding: "1.5rem", borderRadius: 12, textAlign: "center" }}>
            <p style={{ color: "#4A4F45", marginBottom: "1rem" }}>No hay productos en carrito.</p>
            <Link href="/products" style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              background: "#4A5D3A",
              color: "#F7F1E5",
              borderRadius: 100,
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}>
              Explorar productos
            </Link>
          </div>
        )}

        {items.map((item) => (
          <div key={item.productId} style={{
            display: "flex",
            gap: "0.85rem",
            padding: "1rem 0",
            borderBottom: "1px solid #EDE3CD",
          }}>
            <div style={{
              width: 70, height: 70,
              borderRadius: 10,
              flexShrink: 0,
              overflow: "hidden",
              background: "linear-gradient(135deg, #EDE3CD, #A8B584)",
            }}>
              {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}  loading="lazy" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "0.95rem", color: "#4A5D3A", margin: 0, fontWeight: 500 }}>
                  {item.name}
                </h3>
                <button onClick={() => removeItem(item.productId)} style={{
                  background: "rgba(201,83,61,0.08)",
                  border: "1px solid rgba(201,83,61,0.2)",
                  color: "#C9533D",
                  width: 36, height: 36,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  flexShrink: 0,
                }}>
                  ✕
                </button>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#4A4F45", margin: "0 0 0.5rem" }}>
                {fmt(item.price)} c/u
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#F7F1E5",
                  borderRadius: 100,
                  padding: "0.2rem",
                  border: "1px solid #EDE3CD",
                }}>
                  <button type="button" onClick={() => setQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1} style={qtyBtnStyle}>−</button>
                  <span style={{ minWidth: 28, textAlign: "center", fontSize: "0.85rem", fontWeight: 600, color: "#4A5D3A" }}>{item.quantity}</span>
                  <button type="button" onClick={() => setQuantity(item.productId, item.quantity + 1)} disabled={item.quantity >= 20} style={qtyBtnStyle}>+</button>
                </div>
                <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1rem", fontWeight: 600, color: "#4A5D3A", margin: 0 }}>
                  {fmt(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <div style={{ paddingTop: "1rem" }}>
            <div style={{ marginBottom: "0.85rem" }}>
              <CouponInput subtotal={subtotal} appliedCoupon={appliedCoupon} onApply={applyCoupon} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", fontSize: "0.88rem", color: "#4A4F45" }}>
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            {appliedCoupon && !appliedCoupon.freeShipping && couponDiscount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", fontSize: "0.88rem", color: "#5C8A5E", fontWeight: 600 }}>
                <span>🎟️ Descuento ({appliedCoupon.code})</span>
                <span>−{fmt(couponDiscount)}</span>
              </div>
            )}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.4rem 0",
              fontSize: "0.88rem",
              color: isFreeShipping ? "#5C8A5E" : "#4A4F45",
              fontWeight: isFreeShipping ? 600 : 400,
            }}>
              <span>Envío</span>
              <span>{isFreeShipping ? "GRATIS ✨" : fmt(shipping)}</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "#4A5D3A",
              borderTop: "2px solid #4A5D3A",
              marginTop: "0.5rem",
              paddingTop: "0.75rem",
            }}>
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>
        )}
      </section>

      <section style={{ background: "#FDFAF3", borderRadius: 18, padding: "1.5rem", border: "1px solid #EDE3CD" }}>
        <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.4rem", color: "#4A5D3A", margin: "0 0 0.4rem", fontWeight: 500 }}>
          Tus datos
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#4A4F45", marginBottom: "1.25rem" }}>
          Necesitamos estos datos para enviarte el pedido y mantenerte al tanto.
        </p>

        <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <input placeholder="Nombre completo" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required style={inputStyle} />
          <input type="email" placeholder="Tu email (para enviarte el seguimiento)" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required style={inputStyle} />
          <input placeholder="Teléfono / WhatsApp" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required style={inputStyle} />
          <textarea placeholder="Dirección completa con barrio" rows={3} value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} required style={{ ...inputStyle, resize: "vertical", borderRadius: 16 }} />

          {error && (
            <div style={{ background: "rgba(201,83,61,0.1)", border: "1px solid rgba(201,83,61,0.3)", padding: "0.85rem", borderRadius: 12, color: "#C9533D", fontSize: "0.85rem" }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading || items.length === 0} style={{
            width: "100%",
            background: "#4A5D3A",
            color: "#F7F1E5",
            border: "none",
            padding: "1.1rem",
            borderRadius: 100,
            fontSize: "1rem",
            fontWeight: 500,
            cursor: loading || items.length === 0 ? "not-allowed" : "pointer",
            opacity: loading || items.length === 0 ? 0.6 : 1,
            fontFamily: "inherit",
            marginTop: "0.5rem",
          }}>
            {loading ? "Procesando..." : "Pagar con Wompi · " + fmt(total)}
          </button>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginTop: "0.5rem", fontSize: "0.7rem", color: "#4A4F45", alignItems: "center", flexWrap: "wrap" }}>
            <span>Aceptamos:</span>
            {["Visa", "Master", "PSE", "Nequi"].map(m => (
              <span key={m} style={{ background: "#F7F1E5", padding: "0.2rem 0.5rem", borderRadius: 6, fontWeight: 600, border: "1px solid rgba(74, 93, 58, 0.1)", fontSize: "0.65rem" }}>{m}</span>
            ))}
          </div>
        </form>
      </section>

      <style>{`
        @media (min-width: 1024px) {
          .checkout-grid {
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.95rem 1rem",
  borderRadius: 100,
  border: "1px solid #EDE3CD",
  background: "#F7F1E5",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  color: "#4A5D3A",
};

const qtyBtnStyle: React.CSSProperties = {
  width: 36, height: 36,
  borderRadius: "50%",
  border: "none",
  background: "#FDFAF3",
  color: "#4A5D3A",
  fontSize: "0.95rem",
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
