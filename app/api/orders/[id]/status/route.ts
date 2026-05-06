import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAdminToken, getAdminTokenFromHeaders } from "@/lib/admin-auth";
import { whatsappLink, orderReceivedMessage } from "@/lib/whatsapp";

const VALID_STATUSES = ["PENDING", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminToken = getAdminTokenFromHeaders(req);
    if (!validateAdminToken(adminToken)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await context.params;
    const { status, notes } = await req.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status,
        ...(notes && { notes }),
      },
      include: {
        items: { include: { product: true } },
      },
    });

    return NextResponse.json({
      success: true,
      order,
      whatsappLink: whatsappLink(
        order.customerPhone,
        orderReceivedMessage(order.customerName, order.orderNumber ?? "")
      ),
    });
  } catch (error) {
    console.error("Error al actualizar:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}
