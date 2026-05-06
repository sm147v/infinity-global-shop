import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const SITE_URL = "https://www.infinityglobalshop.com";

export async function GET() {
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, name: true, updatedAt: true },
    orderBy: { id: "asc" },
  });

  const staticPages = [
    { url: "", priority: "1.0", changefreq: "daily" },
    { url: "/products", priority: "0.9", changefreq: "daily" },
    { url: "/products?category=Vitaminas", priority: "0.8", changefreq: "weekly" },
    { url: "/products?category=Belleza", priority: "0.8", changefreq: "weekly" },
    { url: "/products?category=Cabello", priority: "0.8", changefreq: "weekly" },
    { url: "/products?category=Salud", priority: "0.8", changefreq: "weekly" },
    { url: "/us", priority: "0.6", changefreq: "monthly" },
    { url: "/sends", priority: "0.5", changefreq: "monthly" },
    { url: "/returns", priority: "0.5", changefreq: "monthly" },
    { url: "/order", priority: "0.4", changefreq: "monthly" },
  ];

  const staticUrls = staticPages
    .map(
      (p) => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n");

  const productUrls = products
    .map((p) => {
      const slug = p.slug || slugify(p.name);
      const lastmod = p.updatedAt.toISOString().split("T")[0];
      return `  <url>
    <loc>${SITE_URL}/products/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${productUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
