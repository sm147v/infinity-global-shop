import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/add-to-cart-button";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    notFound();
  }

  return (
    <section className="card grid gap-5 p-5 md:grid-cols-2 md:p-8">
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image}
          alt={product.name}
          className="h-80 w-full rounded-lg border border-line object-cover"
        />
      ) : (
        <div className="h-80 w-full rounded-lg border border-line bg-slate-50" />
      )}

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 muted">{product.description}</p>
        <p className="mt-4 text-2xl font-bold">${Number(product.price).toFixed(2)}</p>
        <p className="mt-1 text-sm muted">Stock disponible: {product.stock}</p>

        <div className="mt-4">
          <AddToCartButton
            productId={product.id}
            name={product.name}
            price={Number(product.price)}
            image={product.image}
          />
        </div>
      </div>
    </section>
  );
}
