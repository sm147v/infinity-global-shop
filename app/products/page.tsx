import { prisma } from "@/lib/prisma";
import { ProductsClient } from "@/components/products-client";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { id: "desc" } });

  const categories = Array.from(new Set(products.map(p => p.category))).sort();

  return (
    <ProductsClient
      products={products.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image: p.image,
        stock: p.stock,
        category: p.category,
      }))}
      categories={categories}
    />
  );
}
