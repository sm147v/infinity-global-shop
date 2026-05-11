import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FavoritesClient } from "@/components/favorites-client";

export const metadata: Metadata = {
  title: "Mis favoritos",
  description: "Productos guardados en tu lista de favoritos.",
};

export const dynamic = "force-dynamic";

export default async function FavoritosPage() {
  const products = await prisma.product.findMany({ orderBy: { id: "desc" } });
  return <FavoritesClient allProducts={products.map(p => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    image: p.image,
    stock: p.stock,
    category: p.category,
    description: p.description,
    createdAt: p.createdAt,
  }))} />;
}
