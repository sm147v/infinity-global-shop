import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "@/components/product-detail-client";
import { slugify, isLegacyId } from "@/lib/slug";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.infinityglobalshop.com";

/**
 * Busca un producto por slug, y si no encuentra, intenta por id.
 * Retorna { product, shouldRedirect } — si shouldRedirect tiene
 * valor, hay que hacer redirect 301 a la URL canónica.
 */
async function findProduct(idOrSlug: string) {
  // Si es un ID numérico viejo, busca por ID y prepara redirect
  if (isLegacyId(idOrSlug)) {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(idOrSlug) },
    });
    if (!product) return { product: null, redirectTo: null };

    const canonicalSlug = product.slug || slugify(product.name);
    return {
      product,
      redirectTo: `/products/${canonicalSlug}`,
    };
  }

  // Si es un slug, busca directamente
  const product = await prisma.product.findFirst({
    where: { slug: idOrSlug },
  });

  return { product, redirectTo: null };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { product } = await findProduct(id);

  if (!product) {
    return { title: "Producto no encontrado · Infinity Global Shop" };
  }

  const description = (product.description || "").substring(0, 155);
  const title = `${product.name}${product.category ? ` · ${product.category}` : ""} · Infinity Global Shop`;
  const slug = product.slug || slugify(product.name);
  const canonicalUrl = `${SITE_URL}/products/${slug}`;

  return {
    title,
    description: `${description} · Importado de USA · Envío gratis +$150.000 en Medellín.`,
    keywords: [
      product.name,
      product.brand || "",
      product.category || "",
      "vitaminas Medellín",
      "productos importados USA",
      "comprar " + (product.name.toLowerCase()),
    ].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product.name,
      description,
      url: canonicalUrl,
      siteName: "Infinity Global Shop",
      images: product.image
        ? [{ url: product.image, width: 800, height: 800, alt: product.name }]
        : [],
      locale: "es_CO",
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { product, redirectTo } = await findProduct(id);

  if (!product) notFound();

  // Si llegó por ID legacy, redirect 301 a slug canónico
  if (redirectTo) {
    redirect(redirectTo);
  }

  // Reviews REALES (no hardcodeadas)
  const reviews = await prisma.review.findMany({
    where: { productId: product.id, approved: true },
    select: { rating: true, customerName: true, comment: true, location: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const reviewCount = reviews.length;
  const ratingValue =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : null;

  const related = await prisma.product.findMany({
    where: { id: { not: product.id }, category: product.category },
    take: 4,
    orderBy: { id: "desc" },
  });

  const slug = product.slug || slugify(product.name);
  const canonicalUrl = `${SITE_URL}/products/${slug}`;

  // Schema Product COMPLETO para Google Merchant
  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image || "",
    "sku": product.sku || `IGS-${product.id}`,
    "mpn": product.sku || `IGS-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Infinity Global Shop",
    },
    "category": product.category || "Vitaminas",
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "COP",
      "price": Number(product.price),
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability":
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Infinity Global Shop",
        "url": SITE_URL,
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "COP",
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "CO",
          "addressRegion": "Antioquia",
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "DAY",
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "DAY",
          },
        },
      },
    },
  };

  // Solo incluye GTIN si existe
  if (product.gtin) {
    productSchema.gtin = product.gtin;
  }

  // Solo incluye aggregateRating si hay reviews REALES
  if (reviewCount > 0 && ratingValue !== null) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toFixed(1),
      "reviewCount": reviewCount,
      "bestRating": 5,
      "worstRating": 1,
    };

    // Incluye los reviews individuales (top 3)
    productSchema.review = reviews.slice(0, 3).map((r) => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating,
        "bestRating": 5,
      },
      "author": { "@type": "Person", "name": r.customerName },
      "reviewBody": r.comment,
      "datePublished": r.createdAt
        ? new Date(r.createdAt).toISOString().split("T")[0]
        : undefined,
    }));
  }

  // Schema BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": SITE_URL,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Productos",
        "item": `${SITE_URL}/products`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category || "Vitaminas",
        "item": `${SITE_URL}/products?category=${encodeURIComponent(product.category || "Vitaminas")}`,
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.name,
        "item": canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
          createdAt: product.createdAt,
        }}
        related={related.map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          image: p.image,
          stock: p.stock,
        }))}
      />
    </>
  );
}
