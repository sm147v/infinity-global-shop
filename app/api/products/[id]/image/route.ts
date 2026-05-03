import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminToken = req.headers.get("x-admin-token");
    if (adminToken !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const productId = parseInt(id);

    // Modo 1: agregar una imagen al array
    if (body.action === "add" && body.image) {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

      const newImages = [...(product.images || []), body.image];
      const updated = await prisma.product.update({
        where: { id: productId },
        data: {
          images: newImages,
          image: product.image || body.image, // si no tenía imagen principal, usar la nueva
        },
      });
      return NextResponse.json({ success: true, product: updated });
    }

    // Modo 2: eliminar una imagen
    if (body.action === "remove" && body.image) {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

      const newImages = (product.images || []).filter(img => img !== body.image);
      const newPrincipal = product.image === body.image ? (newImages[0] || null) : product.image;

      const updated = await prisma.product.update({
        where: { id: productId },
        data: {
          images: newImages,
          image: newPrincipal,
        },
      });
      return NextResponse.json({ success: true, product: updated });
    }

    // Modo 3: poner imagen como principal
    if (body.action === "setPrincipal" && body.image) {
      const updated = await prisma.product.update({
        where: { id: productId },
        data: { image: body.image },
      });
      return NextResponse.json({ success: true, product: updated });
    }

    // Modo legacy: reemplazar imagen principal
    if (typeof body.image === "string") {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      const existing = product?.images || [];
      const newImages = existing.includes(body.image) ? existing : [...existing, body.image];
      const updated = await prisma.product.update({
        where: { id: productId },
        data: { image: body.image, images: newImages },
      });
      return NextResponse.json({ success: true, product: updated });
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}
