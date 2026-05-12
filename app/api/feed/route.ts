import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // refresca cada hora

const SITE_URL = "https://www.infinityglobalshop.com";

/**
 * Feed XML para Google Merchant Center.
 *
 * Para conectarlo:
 * 1. Ve a https://merchants.google.com
 * 2. Crea una cuenta (o entra a la existente)
 * 3. Productos → Feeds → Crear nuevo feed
 * 4. País: Colombia, Idioma: Español
 * 5. Tipo: "Programar recuperación"
 * 6. URL del feed: https://www.infinityglobalshop.com/api/feed
 * 7. Frecuencia: Diaria
 */
export async function GET() {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { id: "asc" },
  });

  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const items = products
    .map((p) => {
      const slug = p.slug || slugify(p.name);
      const url = `${SITE_URL}/productos/${slug}`;
      const desc = (p.description || p.name).substring(0, 5000);
      const brand = p.brand || "Infinity Global Shop";
      const sku = p.sku || `IGS-${p.id}`;

      return `
    <item>
      <g:id>${sku}</g:id>
      <g:title>${escape(p.name)}</g:title>
      <g:description>${escape(desc)}</g:description>
      <g:link>${url}</g:link>
      <g:image_link>${escape(p.image || "")}</g:image_link>
      <g:availability>in stock</g:availability>
      <g:price>${Number(p.price)} COP</g:price>
      <g:brand>${escape(brand)}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>${p.gtin ? "yes" : "no"}</g:identifier_exists>
      ${p.gtin ? `<g:gtin>${p.gtin}</g:gtin>` : ""}
      <g:google_product_category>Health &amp; Beauty &gt; Health Care &gt; Fitness &amp; Nutrition &gt; Nutritional Supplements</g:google_product_category>
      <g:product_type>${escape(p.category || "Vitaminas")}</g:product_type>
      <g:shipping>
        <g:country>CO</g:country>
        <g:region>Antioquia</g:region>
        <g:service>Standard</g:service>
        <g:price>0 COP</g:price>
      </g:shipping>
      <g:shipping_weight>0.5 kg</g:shipping_weight>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Infinity Global Shop</title>
    <link>${SITE_URL}</link>
    <description>Productos importados de USA en Medellín. Vitaminas, belleza y bienestar.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
