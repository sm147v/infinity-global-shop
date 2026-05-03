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
    const { image } = await req.json();

    if (typeof image !== "string") {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { image },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}
