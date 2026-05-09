import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAdminToken } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (!validateAdminToken(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam) : undefined;

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      items: { include: { product: true } },
    },
  });

  const serialized = orders.map(order => ({
    ...order,
    total: Number(order.total),
    items: order.items.map(item => ({
      ...item,
      price: Number(item.price),
      name: item.product?.name ?? item.name ?? "Producto",
    })),
  }));

  return NextResponse.json({ orders: serialized });
}
