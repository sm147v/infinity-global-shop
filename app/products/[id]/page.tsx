import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/add-to-cart-button";
import Link from "next/link";

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
    <section className="space-y-4">
      <Link href="/products" className="btn">
        Volver al catalogo
      </Link>

      <div className="card grid gap-5 p-5 md:grid-cols-2 md:p-8">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-80 w-full rounded-lg border border-line object-cover lg:h-[30rem]"
          />
        ) : (
          <div className="h-80 w-full rounded-lg border border-line bg-slate-50 lg:h-[30rem]" />
        )}

        <div className="flex flex-col">
          <span className="eyebrow w-fit">Producto recomendado</span>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-3 muted">{product.description}</p>
          <p className="mt-6 text-3xl font-bold">${Number(product.price).toFixed(2)}</p>
          <p className="mt-1 text-sm muted">Stock disponible: {product.stock}</p>

          <div className="soft-panel mt-6 space-y-2 p-4 text-sm muted">
            <p>Compra protegida con pasarela segura.</p>
            <p>Gestion de orden y confirmacion posterior al pago.</p>
            <p>Ideal para vitaminas, cuidado personal y cabello.</p>
          </div>

          <div className="mt-6">
            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={Number(product.price)}
              image={product.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
