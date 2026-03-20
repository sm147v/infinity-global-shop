import { prisma } from "@/lib/prisma";
import { AdminOrderActions } from "@/components/admin-order-actions";
import { AdminLogoutButton } from "@/components/admin-logout-button";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
    },
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Admin de domicilios</h1>
        <AdminLogoutButton />
      </div>

      {orders.length === 0 && <p className="muted">No hay ordenes registradas.</p>}

      <div className="space-y-3">
        {orders.map((order) => (
          <article key={order.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Orden #{order.id}</h2>
                <p className="text-sm muted">Cliente: {order.customerName}</p>
                <p className="text-sm muted">Telefono: {order.customerPhone}</p>
                <p className="text-sm muted">Direccion: {order.customerAddress}</p>
                <p className="text-sm muted">
                  Pago: {order.paymentStatus} | Estado orden: {order.status}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold">Total: ${Number(order.total).toFixed(2)}</p>
                <AdminOrderActions
                  orderId={order.id}
                  deliveryStatus={order.deliveryStatus}
                />
              </div>
            </div>

            <div className="mt-3 border-t border-line pt-3 text-sm">
              {order.items.map((item) => (
                <p key={item.id} className="muted">
                  {item.product.name} x {item.quantity} = ${Number(item.subtotal).toFixed(2)}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
