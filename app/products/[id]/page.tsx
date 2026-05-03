import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "@/components/product-detail-client";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { id: { not: product.id }, category: product.category },
    take: 4,
    orderBy: { id: "desc" },
  });

  return (
    <ProductDetailClient
      product={{
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        image: product.image,
        images: product.images || [],
        stock: product.stock,
        category: product.category,
      }}
      related={related.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image: p.image,
        stock: p.stock,
      }))}
    />
  );
}
