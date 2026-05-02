import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

const statusSteps = [
  { key: "PENDING",   label: "Pedido recibido",      emoji: "📋" },
  { key: "PAID",      label: "Pago confirmado",       emoji: "✅" },
  { key: "PREPARING", label: "Preparando tu paquete", emoji: "📦" },
  { key: "SHIPPED",   label: "En camino",             emoji: "🚚" },
  { key: "DELIVERED", label: "Entregado",             emoji: "🌿" },
];

function getStepIndex(status: string) {
  return statusSteps.findIndex(s => s.key === status);
}

function formatPrice(n: number) {
  return "$" + n.toLocaleString("es-CO");
}

export default async function OrderTrackingPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order || order.status === "CANCELLED") {
    notFound();
  }

  const currentStep = getStepIndex(order.status);

  return (
    <main style={{ minHeight: "100vh", background: "#F7F1E5", fontFamily: "Inter, sans-serif", padding: "2rem 1.25rem", maxWidth: "480px", margin: "0 auto" }}>
      
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.8rem", color: "#4A5D3A", fontWeight: 400, margin: "0 0 4px" }}>
          Infinity <em style={{ color: "#C97B5C" }}>Global</em>
        </h1>
        <p style={{ color: "#6B7B4F", fontSize: "13px", margin: 0 }}>Seguimiento de pedido</p>
      </div>

      <div style={{ background: "#4A5D3A", borderRadius: "16px", padding: "1.25rem", textAlign: "center", marginBottom: "1.25rem" }}>
        <p style={{ color: "#C9A96E", fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 4px" }}>Tu pedido</p>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.6rem", color: "#F7F1E5", fontWeight: 400, margin: 0 }}>
          {order.orderNumber}
        </h2>
      </div>

      <div style={{ background: "#FDFAF3", borderRadius: "20px", padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.25rem" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#C97B5C", margin: "0 0 1.25rem", fontWeight: 600 }}>
          Estado actual
        </p>
        <div style={{ position: "relative", paddingLeft: "1.75rem" }}>
          <div style={{ position: "absolute", left: "10px", top: "8px", bottom: "8px", width: "2px", background: "#EDE3CD" }} />
          {statusSteps.map((step, i) => {
            const isDone = i <= currentStep;
            const isActive = i === currentStep;
            return (
              <div key={step.key} style={{ position: "relative", paddingBottom: i < statusSteps.length - 1 ? "1.25rem" : 0 }}>
                <div style={{
                  position: "absolute", left: "-1.75rem", top: "3px",
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: isDone ? (isActive ? "#C97B5C" : "#4A5D3A") : "#EDE3CD",
                  border: "3px solid #FDFAF3",
                  boxShadow: isActive ? "0 0 0 4px rgba(201,123,92,0.2)" : "none",
                  zIndex: 1,
                }} />
                <div style={{ opacity: isDone ? 1 : 0.4 }}>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem", color: isDone ? "#4A5D3A" : "#4A4F45", fontWeight: isActive ? 600 : 400, margin: "0 0 2px" }}>
                    {step.emoji} {step.label}
                  </p>
                  {isActive && (
                    <p style={{ fontSize: "0.75rem", color: "#C97B5C", margin: 0, fontWeight: 600 }}>← Estado actual</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: "#FDFAF3", borderRadius: "20px", padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.25rem" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#C97B5C", margin: "0 0 1rem", fontWeight: 600 }}>Tu compra</p>
        {order.items.map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid #EDE3CD" }}>
            <span style={{ fontSize: "0.9rem", color: "#4A4F45" }}>{item.quantity}× {item.product.name}</span>
            <span style={{ fontSize: "0.9rem", color: "#4A5D3A", fontWeight: 600 }}>{formatPrice(Number(item.subtotal))}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.75rem" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem", color: "#4A5D3A" }}>Total</span>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "1.2rem", color: "#4A5D3A", fontWeight: 600 }}>{formatPrice(Number(order.total))}</span>
        </div>
      </div>

      <div style={{ background: "#FDFAF3", borderRadius: "20px", padding: "1.5rem", border: "1px solid #EDE3CD", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#C97B5C", margin: "0 0 1rem", fontWeight: 600 }}>Datos de entrega</p>
        <p style={{ color: "#4A5D3A", fontWeight: 600, margin: "0 0 4px" }}>{order.customerName}</p>
        <p style={{ color: "#4A4F45", fontSize: "0.88rem", margin: "0 0 4px" }}>📞 {order.customerPhone}</p>
        <p style={{ color: "#4A4F45", fontSize: "0.88rem", margin: 0 }}>📍 {order.customerAddress}</p>
      </div>

      <div style={{ textAlign: "center" }}>
        <a href="https://wa.me/573054223600" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#25D366", color: "white", textDecoration: "none", padding: "0.9rem 1.5rem", borderRadius: "100px", fontSize: "0.9rem", fontWeight: 500 }}>
          💬 ¿Dudas? Escríbenos por WhatsApp
        </a>
      </div>

    </main>
  );
}
