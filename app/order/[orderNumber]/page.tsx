import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const STATUS_LABELS: Record<string, { label: string; emoji: string; color: string; step: number }> = {
  PENDING:   { label: "Pendiente de pago", emoji: "📋", color: "#C9A96E", step: 1 },
  PAID:      { label: "Pago confirmado",   emoji: "✅", color: "#5C8A5E", step: 2 },
  PREPARING: { label: "Preparando pedido", emoji: "📦", color: "#6B7B4F", step: 3 },
  SHIPPED:   { label: "En camino",         emoji: "🚚", color: "#4A5D3A", step: 4 },
  DELIVERED: { label: "Entregado",         emoji: "🌿", color: "#4A5D3A", step: 5 },
  CANCELLED: { label: "Cancelado",         emoji: "❌", color: "#C9533D", step: 0 },
};

const fmt = (n: number) => "$" + Math.round(Number(n)).toLocaleString("es-CO");

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  if (!orderNumber) notFound();

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!order) notFound();

  const currentStatus = STATUS_LABELS[order.status] || STATUS_LABELS.PENDING;
  const currentStep = currentStatus.step;

  const steps = [
    { num: 1, label: "Pendiente", emoji: "📋" },
    { num: 2, label: "Pagado", emoji: "✅" },
    { num: 3, label: "Preparando", emoji: "📦" },
    { num: 4, label: "En camino", emoji: "🚚" },
    { num: 5, label: "Entregado", emoji: "🌿" },
  ];

  return (
    <main style={{ minHeight: "calc(100vh - 200px)", background: "#F7F1E5", padding: "2rem 1.25rem", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        <div style={{ marginBottom: "1.5rem" }}>
          <Link href="/order" style={{ fontSize: "0.85rem", color: "#4A4F45", textDecoration: "none" }}>
            ← Buscar otro pedido
          </Link>
        </div>

        <div style={{ background: "#FDFAF3", borderRadius: 24, padding: "2rem 1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.78rem", color: "#C97B5C", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.4rem", fontWeight: 600 }}>
            Tu pedido
          </p>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.8rem", color: "#4A5D3A", fontWeight: 400, margin: "0 0 1.5rem" }}>
            {order.orderNumber}
          </h1>

          <div style={{
            background: currentStatus.color + "15",
            border: "1px solid " + currentStatus.color + "40",
            borderRadius: 16,
            padding: "1.25rem",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "0.78rem", color: currentStatus.color, textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.4rem", fontWeight: 600 }}>
              Estado actual
            </p>
            <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.4rem", color: currentStatus.color, margin: 0, fontWeight: 500 }}>
              {currentStatus.emoji} {currentStatus.label}
            </h2>
          </div>

          {order.status !== "CANCELLED" && (
            <div style={{ marginBottom: "0.5rem" }}>
              {steps.map((step, i) => {
                const done = step.num <= currentStep;
                const isLast = i === steps.length - 1;
                return (
                  <div key={step.num} style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", paddingBottom: isLast ? 0 : "0.85rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 32, height: 32,
                        borderRadius: "50%",
                        background: done ? "#4A5D3A" : "#EDE3CD",
                        color: done ? "#F7F1E5" : "#4A4F45",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                      }}>
                        {done ? "✓" : step.num}
                      </div>
                      {!isLast && (
                        <div style={{
                          width: 2,
                          height: 24,
                          background: done ? "#4A5D3A" : "#EDE3CD",
                          marginTop: "0.25rem",
                        }} />
                      )}
                    </div>
                    <div style={{ paddingTop: "0.4rem" }}>
                      <p style={{ margin: 0, fontSize: "0.92rem", fontWeight: done ? 600 : 400, color: done ? "#4A5D3A" : "#4A4F45" }}>
                        {step.emoji} {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ background: "#FDFAF3", borderRadius: 20, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1rem" }}>
          <p style={{ fontSize: "0.78rem", color: "#C97B5C", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.85rem", fontWeight: 600 }}>
            Productos
          </p>
          {order.items.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid #EDE3CD", fontSize: "0.9rem" }}>
              <span style={{ color: "#4A4F45" }}>{item.quantity}× {item.product?.name || "Producto"}</span>
              <span style={{ color: "#4A5D3A", fontWeight: 600 }}>{fmt(Number(item.subtotal))}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.85rem", marginTop: "0.4rem" }}>
            <strong style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.1rem", color: "#4A5D3A" }}>Total</strong>
            <strong style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 600 }}>{fmt(Number(order.total))}</strong>
          </div>
        </div>

        <div style={{ background: "#FDFAF3", borderRadius: 20, padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.78rem", color: "#C97B5C", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.85rem", fontWeight: 600 }}>
            Datos de entrega
          </p>
          <p style={{ color: "#4A5D3A", fontWeight: 600, margin: "0 0 0.3rem", fontSize: "1rem" }}>{order.customerName}</p>
          <p style={{ color: "#4A4F45", fontSize: "0.88rem", margin: "0 0 0.2rem" }}>📞 {order.customerPhone}</p>
          <p style={{ color: "#4A4F45", fontSize: "0.88rem", margin: 0 }}>📍 {order.customerAddress}</p>
        </div>

        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <p style={{ color: "#4A4F45", fontSize: "0.88rem", marginBottom: "0.85rem" }}>
            ¿Alguna pregunta sobre tu pedido?
          </p>
          <a href={"https://wa.me/573054223600?text=" + encodeURIComponent("Hola, quiero saber sobre mi pedido " + order.orderNumber)} target="_blank" rel="noreferrer" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.85rem 1.5rem",
            background: "#25D366",
            color: "white",
            borderRadius: 100,
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}>
            💬 Escríbenos por WhatsApp
          </a>
        </div>

      </div>
    </main>
  );
}
