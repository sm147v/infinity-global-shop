#!/usr/bin/env python3
import os
import sys

if not os.path.exists("package.json"):
    print("Corre el script desde la raiz del proyecto (infinity-global-shop).")
    sys.exit(1)

errores = []

# ============================================================
# 1) BUSCADOR: aplicar descuentos
# ============================================================
SEARCH = "app/api/products/search/route.ts"
if os.path.exists(SEARCH):
    with open(SEARCH, "r", encoding="utf-8") as f:
        c = f.read()

    if "applyDiscountsToProducts" in c:
        print(f"  {SEARCH}: ya parcheado, lo salto.")
    else:
        ok = True

        find_imp = 'import { prisma } from "@/lib/prisma";'
        repl_imp = ('import { prisma } from "@/lib/prisma";\n'
                    'import { applyDiscountsToProducts } from "@/lib/discounts";')
        if c.count(find_imp) == 1:
            c = c.replace(find_imp, repl_imp)
        else:
            ok = False
            errores.append(f"{SEARCH}: no ubique el import de prisma")

        find_ret = "    return NextResponse.json({ products });"
        repl_ret = ("    const withDiscounts = await applyDiscountsToProducts(products);\n"
                    "    return NextResponse.json({ products: withDiscounts });")
        # solo el primero (el del try), no el del catch (ese devuelve [])
        if find_ret in c:
            c = c.replace(find_ret, repl_ret, 1)
        else:
            ok = False
            errores.append(f"{SEARCH}: no ubique el return de products")

        if ok:
            with open(SEARCH, "w", encoding="utf-8") as f:
                f.write(c)
            print(f"  {SEARCH}: buscador ahora aplica descuentos.")
else:
    errores.append(f"No existe {SEARCH}")

# ============================================================
# 2) ADMIN: revalidar paths al actualizar un producto
# ============================================================
ADMIN = "app/api/admin/products/[id]/route.ts"
if os.path.exists(ADMIN):
    with open(ADMIN, "r", encoding="utf-8") as f:
        c = f.read()

    if "revalidatePath" in c:
        print(f"  {ADMIN}: ya parcheado, lo salto.")
    else:
        ok = True

        find_imp = 'import { NextRequest, NextResponse } from "next/server";'
        repl_imp = ('import { NextRequest, NextResponse } from "next/server";\n'
                    'import { revalidatePath } from "next/cache";')
        if c.count(find_imp) == 1:
            c = c.replace(find_imp, repl_imp)
        else:
            ok = False
            errores.append(f"{ADMIN}: no ubique el import de next/server")

        find_ret = ("    const product = await prisma.product.update({\n"
                    "      where: { id },\n"
                    "      data: { name, description: description || \"\", price, stock, category: category || \"General\" },\n"
                    "    });\n"
                    "    return NextResponse.json({ success: true, product });")
        repl_ret = ("    const product = await prisma.product.update({\n"
                    "      where: { id },\n"
                    "      data: { name, description: description || \"\", price, stock, category: category || \"General\" },\n"
                    "    });\n\n"
                    "    // Refresca al instante las paginas que muestran este producto\n"
                    "    const slug = product.slug || String(product.id);\n"
                    "    revalidatePath(`/productos/${slug}`);\n"
                    "    revalidatePath(\"/productos\");\n"
                    "    revalidatePath(\"/\");\n"
                    "    revalidatePath(\"/merchant-feed.xml\");\n"
                    "    revalidatePath(\"/api/feed\");\n\n"
                    "    return NextResponse.json({ success: true, product });")
        if find_ret in c:
            c = c.replace(find_ret, repl_ret)
        else:
            ok = False
            errores.append(f"{ADMIN}: no ubique el bloque de update/return")

        if ok:
            with open(ADMIN, "w", encoding="utf-8") as f:
                f.write(c)
            print(f"  {ADMIN}: ahora refresca al instante al editar.")
else:
    errores.append(f"No existe {ADMIN}")

print("=" * 60)
if errores:
    print("OJO, hubo problemas (no se aplicaron esos cambios):")
    for e in errores:
        print("  -", e)
else:
    print("Todo aplicado. Siguiente paso: npm run build")
