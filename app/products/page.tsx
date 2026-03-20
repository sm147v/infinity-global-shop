import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/add-to-cart-button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { id: "desc" } });

  return (
    <section className="space-y-6">
      <div className="hero-shell p-6 sm:p-7">
        <span className="eyebrow">Catalogo curado</span>
        <h1 className="display-title mt-3">Encuentra tu rutina ideal de salud, piel y cabello</h1>
        <p className="mt-3 max-w-2xl muted">
          Explora productos seleccionados para una tienda especializada, con stock visible,
          precios claros y compra en pocos pasos.
        </p>
      </div>

      {products.length === 0 && (
        <div className="card p-5">
          <p className="muted">No hay productos cargados. Ejecuta el seed para poblar catalogo.</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="card flex h-full flex-col p-4">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full rounded-lg border border-line object-cover"
              />
            ) : (
              <div className="h-48 w-full rounded-lg border border-line bg-slate-50" />
            )}

            <div className="mt-3 inline-flex w-fit rounded-full border border-line px-2 py-1 text-xs font-semibold text-emerald-800">
              En tendencia
            </div>
            <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
            <p className="mt-1 line-clamp-2 text-sm muted">{product.description}</p>
            <div className="mt-3 flex items-end justify-between gap-2">
              <p className="text-xl font-bold">${Number(product.price).toFixed(2)}</p>
              <p className="text-sm muted">Stock: {product.stock}</p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Link className="btn" href={`/products/${product.id}`}>
                Ver detalle
              </Link>
              <AddToCartButton
                productId={product.id}
                name={product.name}
                price={Number(product.price)}
                image={product.image}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
