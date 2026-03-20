import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-6">
      <div className="card p-6 sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Tienda online simple, segura y lista para crecer
        </h1>
        <p className="mt-3 max-w-2xl muted">
          Base eCommerce para vitaminas, suplementos, belleza y cuidado personal.
          Incluye catalogo, carrito, checkout, ordenes, panel admin basico y
          flujo de pago Wompi (real o mock).
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn btn-primary" href="/products">
            Ver productos
          </Link>
          <Link className="btn" href="/checkout">
            Ir a checkout
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="card p-4">
          <h2 className="font-semibold">Catalogo</h2>
          <p className="mt-1 text-sm muted">
            Productos con stock y detalle individual.
          </p>
        </article>
        <article className="card p-4">
          <h2 className="font-semibold">Pagos</h2>
          <p className="mt-1 text-sm muted">
            Endpoint para transaccion y webhook firmado.
          </p>
        </article>
        <article className="card p-4">
          <h2 className="font-semibold">Logistica</h2>
          <p className="mt-1 text-sm muted">
            Admin manual para cambiar estados de domicilio.
          </p>
        </article>
      </div>
    </section>
  );
}
