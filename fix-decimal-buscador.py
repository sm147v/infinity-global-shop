#!/usr/bin/env python3
import os
import sys

if not os.path.exists("package.json"):
    print("Corre el script desde la raiz del proyecto (infinity-global-shop).")
    sys.exit(1)

SEARCH = "app/api/products/search/route.ts"
with open(SEARCH, "r", encoding="utf-8") as f:
    c = f.read()

find = "    const withDiscounts = await applyDiscountsToProducts(products);"
repl = ("    const normalizados = products.map((p) => ({ ...p, price: Number(p.price) }));\n"
        "    const withDiscounts = await applyDiscountsToProducts(normalizados);")

if "const normalizados" in c:
    print("Ya estaba corregido, no toco nada.")
elif find in c:
    c = c.replace(find, repl)
    with open(SEARCH, "w", encoding="utf-8") as f:
        f.write(c)
    print("Corregido: ahora convierte Decimal -> number antes de aplicar descuentos.")
else:
    print("No ubique la linea esperada. No toco nada.")
    sys.exit(1)

print("Siguiente paso: npm run build")
