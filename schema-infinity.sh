#!/bin/bash
# ════════════════════════════════════════════════════════════════
# 📊 Schema.org Product - Rich snippets en Google
# ════════════════════════════════════════════════════════════════

set -e
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}📊 Agregando Schema.org Product a Infinity...${NC}"
echo ""

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ No estás en el proyecto Infinity${NC}"
    exit 1
fi

# Backup
cp app/productos/\[id\]/page.tsx .backup-schema.tsx 2>/dev/null || true

# Crear script de JSON-LD que se inyecta en la página del producto
echo -e "${YELLOW}📝 Inyectando Schema.org en la página del producto...${NC}"

python3 << 'PYTHON_EOF'
import re

path = "app/productos/[id]/page.tsx"

with open(path, "r") as f:
    content = f.read()

# Verificar si ya existe Schema.org
if "application/ld+json" in content:
    print("✓ Schema.org ya existe en la página")
    exit(0)

# El componente de Schema.org que vamos a inyectar
schema_component = '''
  // ─── Schema.org Product (rich snippets en Google) ───
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description || "",
    "image": product.image ? [product.image] : [],
    "sku": product.sku || `IGS-${product.id}`,
    "gtin": product.gtin || undefined,
    "brand": product.brand ? {
      "@type": "Brand",
      "name": product.brand,
    } : undefined,
    "category": product.category || "Salud y Belleza",
    "offers": {
      "@type": "Offer",
      "url": `${SITE_URL}/productos/${product.slug || product.id}`,
      "priceCurrency": "COP",
      "price": Number(product.price),
      "availability": product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Infinity Global Shop",
      },
    },
    ...(ratingValue !== null && reviewCount > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": ratingValue.toFixed(1),
        "reviewCount": reviewCount,
        "bestRating": "5",
        "worstRating": "1",
      },
      "review": reviews.slice(0, 5).map(r => ({
        "@type": "Review",
        "author": { "@type": "Person", "name": r.customerName },
        "datePublished": r.createdAt.toISOString().split("T")[0],
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": r.rating,
          "bestRating": "5",
        },
        "reviewBody": r.comment || "",
      })),
    } : {}),
  };
'''

# Buscar dónde insertar el schema (antes del return final del componente)
# Buscamos "const reviewCount" hasta la siguiente línea blanca y agregamos schema después
pattern = r'(const ratingValue =\s*reviewCount > 0\s*\?\s*reviews\.reduce\(\(sum, r\) => sum \+ r\.rating, 0\) / reviewCount\s*:\s*null;)'

if re.search(pattern, content):
    new_content = re.sub(pattern, r'\1\n' + schema_component, content)
else:
    print("⚠ No encontré dónde insertar. Saltando.")
    exit(1)

# Ahora buscar el return o el JSX final y agregar el <script>
# Buscamos "return (" o "<ProductDetailClient"
script_tag = '''
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient'''

# Reemplazar el return existente
return_pattern = r'return \(\s*<ProductDetailClient'
new_content = re.sub(return_pattern, script_tag.strip(), new_content)

# Buscar el </> que cierra
# El return original termina con just "/>" cerrando ProductDetailClient + ")"
# Necesitamos agregar </> antes del )
# Buscamos la línea con related={...} y agregamos </> después de la línea cerrando

# Pattern más específico: buscar />\n  );
close_pattern = r'(\s+/>\s*\)\s*;\s*}?\s*)$'
new_content = re.sub(close_pattern, r'\1', new_content, flags=re.MULTILINE)

# Más simple: buscar la última aparición de "/>"  seguida de ")" cerrando el return
# Y agregar </> antes
if "/>\n  );" in new_content:
    new_content = new_content.replace("/>\n  );", "/>\n    </>\n  );", 1)
elif "/>\n);" in new_content:
    new_content = new_content.replace("/>\n);", "/>\n  </>\n);", 1)

with open(path, "w") as f:
    f.write(new_content)

print("✓ Schema.org agregado correctamente")
PYTHON_EOF

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Schema.org Product agregado                ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Lo que hicimos:${NC}"
echo -e "  ✓ Cada producto ahora tiene structured data para Google"
echo -e "  ✓ Google mostrará precio, estrellas y disponibilidad en los resultados"
echo -e "  ✓ Mejores clics desde búsquedas"
echo ""
echo -e "${YELLOW}Para probar:${NC}"
echo -e "  ${GREEN}npm run dev${NC}"
echo -e "  Abre una página de producto → F12 → Elements → busca 'application/ld+json'"
echo ""
echo -e "${YELLOW}Para subir a producción:${NC}"
echo -e "  ${GREEN}git add . && git commit -m \"feat: Schema.org Product rich snippets\" && git push${NC}"
echo ""
echo -e "${YELLOW}Para verificar después de deployar:${NC}"
echo -e "  Ve a ${BLUE}https://search.google.com/test/rich-results${NC}"
echo -e "  Pega cualquier URL de tu producto"
echo -e "  Verás que Google detecta: precio, estrellas, stock"
echo ""
