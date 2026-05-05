import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminToken = req.headers.get("x-admin-token");
    if (adminToken !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Error al obtener pedido" }, { status: 500 });
  }
}
