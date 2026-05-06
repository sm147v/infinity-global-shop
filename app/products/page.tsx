import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductsClient } from "@/components/products-client";
import { Suspense } from "react";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Catálogo · Vitaminas, belleza y cuidado importados de USA en Medellín",
  description: "Más de 60 productos importados originales de Estados Unidos: vitaminas Nature's Bounty, Spring Valley, Vitafusion, melatonina, biotina, omega 3, productos de belleza y cuidado capilar. Envío gratis +$150.000 y entrega 24h en Medellín.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Catálogo · Infinity Global Shop",
    description: "+60 productos importados de USA con entrega 24h en Medellín.",
    url: "https://www.infinityglobalshop.com/products",
    siteName: "Infinity Global Shop",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Catálogo de Infinity Global Shop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catálogo · Infinity Global Shop",
    description: "+60 productos importados de USA con entrega 24h en Medellín.",
    images: ["/og-image.png"],
  },
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { id: "desc" } });
  const CATEGORY_ORDER = ["Vitaminas", "Belleza", "Cabello", "Salud", "Hogar", "Herramientas", "Más productos"];
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];
  categories.sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Catálogo Infinity Global Shop",
    "description": "Productos importados originales de USA en Medellín",
    "url": "https://www.infinityglobalshop.com/products",
    "isPartOf": { "@id": "https://www.infinityglobalshop.com/#website" },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://www.infinityglobalshop.com/products/${p.slug || p.id}`,
        "name": p.name,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.infinityglobalshop.com" },
      { "@type": "ListItem", "position": 2, "name": "Productos", "item": "https://www.infinityglobalshop.com/products" },
    ],
  };

  const mappedProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    image: p.image,
    stock: p.stock,
    category: p.category,
    description: p.description,
    createdAt: p.createdAt,
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Suspense fallback={<div style={{ background: "#F7F1E5", minHeight: "100vh" }} />}>
        <ProductsClient products={mappedProducts} categories={categories} />
      </Suspense>
    </>
  );
}
