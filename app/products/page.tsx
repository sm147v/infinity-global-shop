import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductsClient } from "@/components/products-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de productos · Vitaminas, belleza y cuidado importados de USA",
  description: "Descubre +60 productos importados de Estados Unidos: vitaminas, productos de belleza, cuidado capilar y más. Envío gratis +$150.000 en Medellín.",
  openGraph: {
    title: "Catálogo · Infinity Global Shop",
    description: "+60 productos importados de USA con entrega en 24h en Medellín.",
    url: "https://www.infinityglobalshop.com/products",
    siteName: "Infinity Global Shop",
    locale: "es_CO",
    type: "website",
  },
};

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
