#!/bin/bash
# ============================================================
# Infinity Global Shop — SEO Sesión 1
# ============================================================
# Implementa:
#   1. URLs amigables con slug (/products/biotina-natures-bounty)
#      con redirect 301 desde URLs antiguas (/products/5)
#   2. Schema Product completo para Google Merchant
#      (brand real, sku, condition, priceValidUntil)
#   3. AggregateRating REAL desde tabla Review (no hardcodeado)
#   4. Feed XML para Google Merchant en /api/feed.xml
#   5. Schema Organization global en layout
#   6. Schema BreadcrumbList en producto
#   7. sitemap.xml dinámico con todos los productos
#   8. robots.txt optimizado
#
# USO:
#   cd ~/Desktop/infinity-global-shop
#   bash infinity-seo-session1.sh
#
# DESPUÉS necesitas (te lo recordaré al final):
#   - Correr migración de Prisma para agregar slug
#   - Llenar slugs de productos existentes
#   - Subir feed a Google Merchant Center
# ============================================================

set -eo pipefail

GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'
log()   { echo -e "${GREEN}✓${NC} $1"; }
info()  { echo -e "${BLUE}ℹ${NC}  $1"; }
warn()  { echo -e "${YELLOW}⚠${NC}  $1"; }
err()   { echo -e "${RED}✗${NC} $1" >&2; }
title() { echo -e "\n${BOLD}${BLUE}━━━ $1 ━━━${NC}\n"; }

BACKUP_DIR=""
ROLLBACK=false

rollback() {
  if [ "$ROLLBACK" = true ] && [ -n "$BACKUP_DIR" ] && [ -d "$BACKUP_DIR" ]; then
    err "Algo falló. Restaurando..."
    [ -d "$BACKUP_DIR/files" ] && cp -r "$BACKUP_DIR/files/." . 2>/dev/null || true
    err "Rollback listo. Backup en: $BACKUP_DIR"
  fi
}
trap rollback ERR

# ============================================================
# 1) VALIDAR
# ============================================================
title "Validando proyecto"

[ ! -f "package.json" ] && { err "No hay package.json. cd a tu proyecto."; exit 1; }
[ ! -f "prisma/schema.postgres.prisma" ] && { err "No encontré prisma/schema.postgres.prisma"; exit 1; }
[ ! -d "app/products" ] && { err "No hay app/products/"; exit 1; }
log "Estructura OK"

# ============================================================
# 2) BACKUP
# ============================================================
title "Backup"

BACKUP_DIR=".infinity-backup-seo-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR/files/prisma"
mkdir -p "$BACKUP_DIR/files/app/products/[id]"
mkdir -p "$BACKUP_DIR/files/app/api"
mkdir -p "$BACKUP_DIR/files/lib"

cp prisma/schema.postgres.prisma "$BACKUP_DIR/files/prisma/" 2>/dev/null || true
cp "app/products/[id]/page.tsx" "$BACKUP_DIR/files/app/products/[id]/" 2>/dev/null || true
cp "app/sitemap.xml/route.ts" "$BACKUP_DIR/files/" 2>/dev/null || true
cp "app/robots.txt/route.ts" "$BACKUP_DIR/files/" 2>/dev/null || true
cp "app/layout.tsx" "$BACKUP_DIR/files/app/" 2>/dev/null || true

log "Backup en $BACKUP_DIR/"
ROLLBACK=true

# ============================================================
# 3) ACTUALIZAR PRISMA SCHEMA — agregar slug + brand + sku
# ============================================================
title "Actualizando Prisma schema (slug, brand, sku)"

# Solo agregamos campos si no existen
if ! grep -q "slug " prisma/schema.postgres.prisma; then
  # Reemplazar el bloque del modelo Product
  python3 << 'PYTHON_EOF'
import re

with open('prisma/schema.postgres.prisma', 'r') as f:
    content = f.read()

# Buscar el modelo Product y agregar campos nuevos antes de "items   OrderItem[]"
new_fields = '''  slug            String?     @unique
  brand           String?
  sku             String?     @unique
  gtin            String?
  '''

# Insertar antes de la línea "items   OrderItem[]"
pattern = r'(  items\s+OrderItem\[\])'
replacement = new_fields + r'\1'
content = re.sub(pattern, replacement, content, count=1)

with open('prisma/schema.postgres.prisma', 'w') as f:
    f.write(content)

print("Campos agregados al schema")
PYTHON_EOF

  log "Schema actualizado: slug, brand, sku, gtin"
else
  info "Campos slug ya existen en el schema"
fi

# ============================================================
# 4) HELPER DE SLUGS
# ============================================================
title "Creando helper de slugs"

mkdir -p lib
cat > lib/slug.ts << 'SLUG_EOF'
/**
 * Genera un slug SEO-friendly desde un string.
 * "Nature's Bounty Hair, Skin & Nails 80 gomitas"
 *   → "natures-bounty-hair-skin-nails-80-gomitas"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-z0-9\s-]/g, "")    // solo letras, números, espacios, guiones
    .trim()
    .replace(/\s+/g, "-")             // espacios → guiones
    .replace(/-+/g, "-")              // múltiples guiones → uno
    .substring(0, 80);                // máximo 80 chars
}

/**
 * Detecta si un string parece ser un ID numérico viejo
 * (para hacer redirect 301 a la URL nueva con slug)
 */
export function isLegacyId(value: string): boolean {
  return /^\d+$/.test(value);
}
SLUG_EOF
log "lib/slug.ts creado"

# ============================================================
# 5) PRODUCT PAGE — soportar slug Y id (con redirect 301)
# ============================================================
title "Reescribiendo product page (soporte slug + redirect 301)"

cat > "app/products/[id]/page.tsx" << 'PRODUCT_PAGE_EOF'
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
PRODUCT_PAGE_EOF
log "product page reescrito"

# ============================================================
# 6) FEED XML para Google Merchant Center
# ============================================================
title "Creando feed XML para Google Merchant"

mkdir -p app/api/feed
cat > app/api/feed/route.ts << 'FEED_EOF'
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
      const url = `${SITE_URL}/products/${slug}`;
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
FEED_EOF
log "Feed XML en /api/feed"

# ============================================================
# 7) SITEMAP.XML mejorado con productos
# ============================================================
title "Mejorando sitemap.xml"

mkdir -p "app/sitemap.xml"
cat > "app/sitemap.xml/route.ts" << 'SITEMAP_EOF'
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
SITEMAP_EOF
log "sitemap.xml mejorado con productos"

# ============================================================
# 8) ROBOTS.TXT optimizado
# ============================================================
title "Optimizando robots.txt"

mkdir -p "app/robots.txt"
cat > "app/robots.txt/route.ts" << 'ROBOTS_EOF'
export const dynamic = "force-static";

const SITE_URL = "https://www.infinityglobalshop.com";

export async function GET() {
  const content = `# Infinity Global Shop · robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/
Disallow: /checkout
Disallow: /pedido
Disallow: /order/
Disallow: /favorites
Disallow: /gratitude
Disallow: /*?utm_*
Disallow: /*?ref=*

# Permitir bots de Google explícitamente
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: AdsBot-Google
Allow: /

# Bloquear bots agresivos
User-agent: SemrushBot
Crawl-delay: 10

User-agent: AhrefsBot
Crawl-delay: 10

Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
ROBOTS_EOF
log "robots.txt optimizado"

# ============================================================
# 9) SCHEMA ORGANIZATION en layout
# ============================================================
title "Agregando Schema Organization global"

LAYOUT_FILE=""
for f in "app/layout.tsx" "app/layout.jsx"; do
  [ -f "$f" ] && LAYOUT_FILE="$f" && break
done

if [ -n "$LAYOUT_FILE" ]; then
  if ! grep -q "Schema Organization" "$LAYOUT_FILE"; then
    # Agregar el schema al final del <head> o body
    python3 << PYTHON_EOF
import re

with open('$LAYOUT_FILE', 'r') as f:
    content = f.read()

org_schema = '''
        {/* Schema Organization para Knowledge Graph de Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Infinity Global Shop",
              "alternateName": "Infinity Global",
              "url": "https://www.infinityglobalshop.com",
              "logo": "https://www.infinityglobalshop.com/logo.png",
              "description": "Productos importados de USA en Medellín. Vitaminas, belleza y bienestar con entrega en 24 horas.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Medellín",
                "addressRegion": "Antioquia",
                "addressCountry": "CO"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+573054223600",
                "contactType": "customer service",
                "areaServed": "CO",
                "availableLanguage": ["Spanish"]
              },
              "sameAs": [
                "https://www.instagram.com/infinityglobalshop",
                "https://wa.me/573054223600",
                "https://listado.mercadolibre.com.co/infinity-global-shop"
              ]
            })
          }}
        />
'''

# Insertar antes de {children} o antes de </body>
if '{children}' in content and 'Schema Organization' not in content:
    content = content.replace('{children}', org_schema + '\n        {children}', 1)
    with open('$LAYOUT_FILE', 'w') as f:
        f.write(content)
    print("Schema agregado")
else:
    print("Ya existe o no se encontró {children}")
PYTHON_EOF
    log "Schema Organization agregado a layout"
  else
    info "Schema Organization ya existe en layout"
  fi
else
  warn "No encontré app/layout.tsx — agrega manualmente el schema"
fi

# ============================================================
# 10) MIGRACIÓN PRISMA + SEED DE SLUGS
# ============================================================
title "Generando script de migración"

cat > scripts-seo-migrate.sh << 'MIGRATE_EOF'
#!/bin/bash
# Corre después del bash principal para migrar la DB
set -e

echo "🔄 Generando migración de Prisma..."
npx prisma migrate dev --name add_slug_brand_sku

echo "📝 Llenando slugs de productos existentes..."
cat > /tmp/seed-slugs.mjs << 'NODE_EOF'
import { PrismaClient } from '@prisma/client';

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

const prisma = new PrismaClient();

const products = await prisma.product.findMany({ where: { slug: null } });
console.log(`Productos sin slug: ${products.length}`);

for (const p of products) {
  const baseSlug = slugify(p.name);
  let slug = baseSlug;
  let counter = 2;

  // Asegurar unicidad
  while (await prisma.product.findFirst({ where: { slug, NOT: { id: p.id } } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  await prisma.product.update({
    where: { id: p.id },
    data: {
      slug,
      sku: `IGS-${p.id.toString().padStart(4, '0')}`,
      brand: p.name.split(' ')[0], // Toma la primera palabra como marca por defecto
    },
  });
  console.log(`✓ ${p.id}: ${slug}`);
}

await prisma.$disconnect();
console.log('✨ Slugs generados');
NODE_EOF

node /tmp/seed-slugs.mjs
rm /tmp/seed-slugs.mjs

echo "✅ Migración completa"
MIGRATE_EOF
chmod +x scripts-seo-migrate.sh
log "Script de migración: scripts-seo-migrate.sh"

ROLLBACK=false

# ============================================================
# RESUMEN
# ============================================================
echo -e "\n${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}✨ Sesión 1 completa${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}\n"

echo -e "${BOLD}Lo que hice:${NC}"
echo -e "  ${GREEN}✓${NC} Schema Prisma actualizado: slug, brand, sku, gtin"
echo -e "  ${GREEN}✓${NC} lib/slug.ts (helper de slugs)"
echo -e "  ${GREEN}✓${NC} app/products/[id]/page.tsx (soporta slug + id, redirect 301)"
echo -e "  ${GREEN}✓${NC} app/api/feed/route.ts (Google Merchant XML)"
echo -e "  ${GREEN}✓${NC} app/sitemap.xml/route.ts (con todos los productos)"
echo -e "  ${GREEN}✓${NC} app/robots.txt/route.ts (optimizado)"
echo -e "  ${GREEN}✓${NC} Schema Organization en layout"
echo -e "  ${GREEN}✓${NC} aggregateRating REAL (no hardcodeado, lee de DB)"
echo -e "  ${GREEN}✓${NC} Schema BreadcrumbList en producto"
echo -e ""
echo -e "${BOLD}${YELLOW}⚠ AHORA TIENES QUE HACER ESTO:${NC}"
echo -e ""
echo -e "${BOLD}1. Migrar la base de datos (CRÍTICO):${NC}"
echo -e "   ${YELLOW}bash scripts-seo-migrate.sh${NC}"
echo -e ""
echo -e "   Esto va a:"
echo -e "   • Crear los nuevos campos en la DB"
echo -e "   • Generar slug, sku y brand para cada producto existente"
echo -e ""
echo -e "${BOLD}2. Verificar que todo funciona:${NC}"
echo -e "   ${YELLOW}npm run build${NC}"
echo -e "   ${YELLOW}npm run dev${NC}"
echo -e ""
echo -e "   Visita: ${YELLOW}http://localhost:3000/products/5${NC}"
echo -e "   Te debe redirigir a: ${YELLOW}/products/natures-bounty-...${NC}"
echo -e ""
echo -e "${BOLD}3. Verificar el feed XML:${NC}"
echo -e "   ${YELLOW}http://localhost:3000/api/feed${NC}"
echo -e "   Debe mostrar XML con todos tus productos"
echo -e ""
echo -e "${BOLD}4. Subir cambios a producción:${NC}"
echo -e "   ${YELLOW}git add . && git commit -m \"feat: SEO sesión 1 - slugs, schema, merchant feed\" && git push${NC}"
echo -e ""
echo -e "${BOLD}5. Crear Google Merchant Center:${NC}"
echo -e "   • Ve a: ${YELLOW}https://merchants.google.com${NC}"
echo -e "   • Crear cuenta (gratis)"
echo -e "   • Verificar el dominio infinityglobalshop.com"
echo -e "   • Productos → Feeds → Crear nuevo"
echo -e "   • Tipo: Programar recuperación"
echo -e "   • URL: ${YELLOW}https://www.infinityglobalshop.com/api/feed${NC}"
echo -e "   • Frecuencia: Diaria"
echo -e ""
echo -e "${BOLD}6. Forzar reindexación en Search Console:${NC}"
echo -e "   • https://search.google.com/search-console"
echo -e "   • Inspeccionar URL → pega tu sitemap"
echo -e "   • Solicitar indexación"
echo -e ""
echo -e "${BOLD}Backup:${NC} $BACKUP_DIR/"
echo -e ""
echo -e "${GREEN}🌿 Esto te va a poner en Google Shopping en 2-4 semanas${NC}\n"
