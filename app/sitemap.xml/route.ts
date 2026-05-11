import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export const dynamic = "force-static";
export const revalidate = 3600;

const SITE_URL = "https://www.infinityglobalshop.com";

/** Escapa caracteres XML peligrosos */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      updatedAt: true,
      image: true,
      images: true,
      description: true,
    },
    orderBy: { id: "asc" },
  });

  const staticPages = [
    { url: "", priority: "1.0", changefreq: "daily" },
    { url: "/products", priority: "0.9", changefreq: "daily" },
    { url: "/products?category=Vitaminas", priority: "0.85", changefreq: "weekly" },
    { url: "/products?category=Belleza", priority: "0.85", changefreq: "weekly" },
    { url: "/products?category=Cabello", priority: "0.85", changefreq: "weekly" },
    { url: "/products?category=Salud", priority: "0.8", changefreq: "weekly" },
    { url: "/products?category=Hogar", priority: "0.7", changefreq: "weekly" },
    { url: "/products?category=Herramientas", priority: "0.7", changefreq: "weekly" },
    { url: "/nosotros", priority: "0.6", changefreq: "monthly" },
    { url: "/envios", priority: "0.5", changefreq: "monthly" },
    { url: "/devoluciones", priority: "0.5", changefreq: "monthly" },
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

  // Sitemap de productos CON imágenes (Google Images SEO)
  const productUrls = products
    .map((p) => {
      const slug = p.slug || slugify(p.name);
      const lastmod = p.updatedAt.toISOString().split("T")[0];
      const url = `${SITE_URL}/products/${slug}`;

      const imageList = [p.image, ...(p.images || [])]
        .filter((img): img is string => Boolean(img && img.startsWith("http")))
        .slice(0, 5);

      const imagesBlock = imageList
        .map(
          (img) => `    <image:image>
      <image:loc>${escapeXml(img)}</image:loc>
      <image:title>${escapeXml(p.name)}</image:title>
      <image:caption>${escapeXml((p.description || p.name).substring(0, 200))}</image:caption>
    </image:image>`
        )
        .join("\n");

      return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
${imagesBlock}
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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
