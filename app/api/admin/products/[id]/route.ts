import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAdminToken, getAdminTokenFromHeaders } from "@/lib/admin-auth";

function checkAuth(req: NextRequest) {
  const token = getAdminTokenFromHeaders(req);
  return validateAdminToken(token);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id: rawId } = await params;
  const id = parseInt(rawId);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const body = await req.json();
    const { name, description, price, stock, category } = body;
    if (!name || typeof price !== "number" || typeof stock !== "number") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    const product = await prisma.product.update({
      where: { id },
      data: { name, description: description || "", price, stock, category: category || "General" },
    });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id: rawId } = await params;
  const id = parseInt(rawId);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    // Borrar OrderItems asociados primero (foreign key)
    await prisma.orderItem.deleteMany({ where: { productId: id } });
    // Borrar Reviews asociadas
    await prisma.review.deleteMany({ where: { productId: id } }).catch(() => {});
    // Ahora borrar el producto
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}
