/**
 * Google Merchant Center Feed (Google Shopping)
 *
 * Endpoint: /merchant-feed.xml
 *
 * Para conectar:
 *  1. Ir a https://merchants.google.com
 *  2. Crear una cuenta (si no la tienes) y verificar el dominio
 *  3. Productos → Feeds → Crear feed primario
 *  4. País: Colombia · Idioma: Español
 *  5. Método: "Recuperación programada"
 *  6. URL del feed: https://www.infinityglobalshop.com/merchant-feed.xml
 *  7. Frecuencia: Diaria
 *
 * El feed cumple con la spec de Google Merchant:
 *  https://support.google.com/merchants/answer/7052112
 *
 * NOTA importante sobre `gtin`: Google requiere GTIN (código de barras EAN/UPC)
 * para productos con GTIN asignado por el fabricante. Si NO conoces el GTIN
 * del producto, debes incluir <g:identifier_exists>no</g:identifier_exists>.
 * Esa lógica está abajo: si el producto NO tiene gtin, lo marcamos como sin
 * identificador para evitar rechazos en Merchant.
 */

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

// Regenera cada hora — evita pegar la DB en cada visita de Google
export const revalidate = 3600;

const SITE_URL = "https://www.infinityglobalshop.com";
const BRAND_DEFAULT = "Infinity Global Shop";

/** Escapa caracteres XML peligrosos */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Convierte CategoriaInfinity → Google Product Category (taxonomía oficial) */
function mapToGoogleCategory(cat: string | null): string {
  const c = (cat || "").toLowerCase();
  if (c.includes("vitamina") || c.includes("salud")) return "Health & Beauty > Health Care > Vitamins & Supplements";
  if (c.includes("belleza")) return "Health & Beauty > Personal Care > Cosmetics";
  if (c.includes("cabello")) return "Health & Beauty > Personal Care > Hair Care";
  if (c.includes("hogar")) return "Home & Garden > Household Supplies";
  if (c.includes("herramienta")) return "Hardware > Tools";
  return "Health & Beauty";
}

export async function GET() {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { id: "asc" },
  });

  const items = products
    .map((p) => {
      const slug = p.slug || slugify(p.name);
      const productUrl = `${SITE_URL}/productos/${slug}`;
      const price = Number(p.price).toFixed(2);
      const availability = p.stock > 0 ? "in_stock" : "out_of_stock";
      const brand = p.brand || BRAND_DEFAULT;
      const googleCategory = mapToGoogleCategory(p.category);

      const imageMain = p.image && p.image.startsWith("http") ? p.image : "";
      const additionalImages = (p.images || [])
        .filter((u): u is string => Boolean(u && u.startsWith("http")))
        .filter((u) => u !== imageMain)
        .slice(0, 10);

      const description =
        (p.longDescription || p.description || "")
          .replace(/\s+/g, " ")
          .trim()
          .substring(0, 4900); // Google permite hasta 5000

      const title = p.name.substring(0, 145); // Google permite hasta 150

      // Identificadores: si no hay GTIN, marcar identifier_exists=no
      const hasIdentifier = Boolean(p.gtin);
      const identifierBlock = hasIdentifier
        ? `    <g:gtin>${escapeXml(p.gtin!)}</g:gtin>`
        : `    <g:identifier_exists>no</g:identifier_exists>`;

      const mpnBlock = p.sku
        ? `    <g:mpn>${escapeXml(p.sku)}</g:mpn>`
        : `    <g:mpn>IGS-${p.id}</g:mpn>`;

      const additionalImagesXml = additionalImages
        .map((u) => `    <g:additional_image_link>${escapeXml(u)}</g:additional_image_link>`)
        .join("\n");

      return `  <item>
    <g:id>IGS-${p.id}</g:id>
    <g:title>${escapeXml(title)}</g:title>
    <g:description>${escapeXml(description)}</g:description>
    <g:link>${escapeXml(productUrl)}</g:link>
    <g:image_link>${escapeXml(imageMain)}</g:image_link>
${additionalImagesXml}
    <g:availability>${availability}</g:availability>
    <g:price>${price} COP</g:price>
    <g:brand>${escapeXml(brand)}</g:brand>
${identifierBlock}
${mpnBlock}
    <g:condition>new</g:condition>
    <g:adult>no</g:adult>
    <g:google_product_category>${escapeXml(googleCategory)}</g:google_product_category>
    <g:product_type>${escapeXml(p.category || "Vitaminas")}</g:product_type>
    <g:shipping>
      <g:country>CO</g:country>
      <g:region>Antioquia</g:region>
      <g:service>Envío estándar Medellín</g:service>
      <g:price>0 COP</g:price>
    </g:shipping>
    <g:shipping_weight>0.5 kg</g:shipping_weight>
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>Infinity Global Shop · Google Merchant Feed</title>
  <link>${SITE_URL}</link>
  <description>Productos importados originales de USA con entrega 24h en Medellín</description>
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
