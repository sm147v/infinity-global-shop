import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    if (!orderNumber) {
      return NextResponse.json({ error: "Falta orderNumber" }, { status: 400 });
    }
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: { orderNumber: true, total: true, status: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Error al obtener pedido" }, { status: 500 });
  }
}
