import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-7">
      <div className="hero-shell p-6 sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <span className="eyebrow">Bienestar diario para toda la familia</span>
          <h1 className="display-title mt-4">
            Vitaminas, belleza y cuidado capilar con entrega rapida y compra segura
          </h1>
          <p className="mt-4 max-w-2xl text-base muted sm:text-lg">
            Seleccion curada para una tienda online pequena: productos de salud,
            piel y cabello con experiencia clara, confiable y lista para convertir.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/products">
              Comprar ahora
            </Link>
            <Link className="btn" href="/checkout">
              Ver checkout
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <article className="soft-panel p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Vitaminas y suplementos
            </p>
            <p className="mt-2 text-sm muted">Energia, defensas y soporte diario.</p>
          </article>
          <article className="soft-panel p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Belleza y cuidado personal
            </p>
            <p className="mt-2 text-sm muted">Rutinas de piel con productos de alta rotacion.</p>
          </article>
          <article className="soft-panel p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Cuidado del cabello
            </p>
            <p className="mt-2 text-sm muted">Limpieza, nutricion y reparacion capilar.</p>
          </article>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="card stagger-in p-5">
          <h2 className="text-lg font-semibold">Catalogo visual y ordenado</h2>
          <p className="mt-2 text-sm muted">
            Fotos destacadas, precio visible y acceso rapido al detalle de cada producto.
          </p>
        </article>
        <article className="card stagger-in p-5">
          <h2 className="text-lg font-semibold">Pago y seguridad</h2>
          <p className="mt-2 text-sm muted">
            Flujo de pago Wompi integrado con confirmacion y actualizacion de orden.
          </p>
        </article>
        <article className="card stagger-in p-5">
          <h2 className="text-lg font-semibold">Control administrativo</h2>
          <p className="mt-2 text-sm muted">
            Seguimiento de pedidos para gestionar despacho y entrega sin complejidad.
          </p>
        </article>
      </div>
    </section>
  );
}
