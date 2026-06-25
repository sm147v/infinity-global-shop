#!/usr/bin/env python3
import os
import sys

if not os.path.exists("package.json"):
    print("Corre el script desde la raiz del proyecto (infinity-global-shop).")
    sys.exit(1)

IMPORT_FIND = 'import { slugify } from "@/lib/slug";'
IMPORT_REPL = (
    'import { slugify } from "@/lib/slug";\n'
    'import { getActiveDiscountRules, priceWithDiscount } from "@/lib/discounts";'
)

ITEMS_FIND = '  const items = products\n    .map((p) => {'
ITEMS_REPL = (
    '  const rules = await getActiveDiscountRules();\n\n'
    '  const items = products\n    .map((p) => {'
)

# ---- merchant-feed.xml ----
MERCHANT = "app/merchant-feed.xml/route.ts"
m_price_const_find = '      const price = Number(p.price).toFixed(2);'
m_price_const_repl = (
    '      const price = Number(p.price).toFixed(2);\n'
    '      const pricing = priceWithDiscount({ id: p.id, category: p.category, price: Number(p.price) }, rules);\n'
    '      const salePriceLine = pricing.hasDiscount ? `<g:sale_price>${pricing.price} COP</g:sale_price>` : "";'
)
m_tag_find = '    <g:price>${price} COP</g:price>'
m_tag_repl = '    <g:price>${price} COP</g:price>\n    ${salePriceLine}'

# ---- api/feed ----
APIFEED = "app/api/feed/route.ts"
a_sku_find = '      const sku = p.sku || `IGS-${p.id}`;'
a_sku_repl = (
    '      const sku = p.sku || `IGS-${p.id}`;\n'
    '      const pricing = priceWithDiscount({ id: p.id, category: p.category, price: Number(p.price) }, rules);\n'
    '      const salePriceLine = pricing.hasDiscount ? `<g:sale_price>${pricing.price} COP</g:sale_price>` : "";'
)
a_tag_find = '      <g:price>${Number(p.price)} COP</g:price>'
a_tag_repl = '      <g:price>${Number(p.price)} COP</g:price>\n      ${salePriceLine}'

TARGETS = {
    MERCHANT: [
        (IMPORT_FIND, IMPORT_REPL),
        (ITEMS_FIND, ITEMS_REPL),
        (m_price_const_find, m_price_const_repl),
        (m_tag_find, m_tag_repl),
    ],
    APIFEED: [
        (IMPORT_FIND, IMPORT_REPL),
        (ITEMS_FIND, ITEMS_REPL),
        (a_sku_find, a_sku_repl),
        (a_tag_find, a_tag_repl),
    ],
}

for path, repls in TARGETS.items():
    print("=" * 60)
    print("Archivo:", path)
    if not os.path.exists(path):
        print("  (no existe, lo salto)")
        continue
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if "getActiveDiscountRules" in content:
        print("  Ya parece parcheado (tiene getActiveDiscountRules). Lo salto.")
        continue

    ok = True
    for find, repl in repls:
        n = content.count(find)
        if n != 1:
            print(f"  ⚠ No pude ubicar de forma unica un ancla (encontrado {n} veces). NO toco este archivo.")
            ok = False
            break
        content = content.replace(find, repl)

    if not ok:
        continue

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("  ✓ Parcheado: ahora manda <g:sale_price> cuando hay descuento activo.")

print("=" * 60)
print("Listo. Siguiente paso: npm run build para confirmar que no rompio nada.")
