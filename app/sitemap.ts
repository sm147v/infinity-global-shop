import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE = "https://www.infinityglobalshop.com";

  const products = await prisma.product.findMany({ select: { id: true, updatedAt: true } });

  const productUrls = products.map(p => ({
    url: SITE + "/products/" + p.id,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: SITE, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: SITE + "/products", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: SITE + "/nosotros", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: SITE + "/envios", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: SITE + "/devoluciones", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: SITE + "/pedido", lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    ...productUrls,
  ];
}
