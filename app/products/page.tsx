import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/add-to-cart-button";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { id: "desc" } });

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-bold tracking-tight">Catalogo de productos</h1>

      {products.length === 0 && (
        <div className="card p-5">
          <p className="muted">No hay productos cargados. Ejecuta el seed para poblar catalogo.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="card p-4">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className="h-44 w-full rounded-lg border border-line object-cover"
              />
            ) : (
              <div className="h-44 w-full rounded-lg border border-line bg-slate-50" />
            )}

            <h2 className="mt-3 text-lg font-semibold">{product.name}</h2>
            <p className="mt-1 line-clamp-2 text-sm muted">{product.description}</p>
            <p className="mt-2 text-lg font-bold">${Number(product.price).toFixed(2)}</p>
            <p className="text-sm muted">Stock: {product.stock}</p>

            <div className="mt-3 flex items-center gap-2">
              <a className="btn" href={`/products/${product.id}`}>
                Ver detalle
              </a>
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
