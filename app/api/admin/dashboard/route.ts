import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [todayOrders, monthOrders, allOrders] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: today } } }),
    prisma.order.findMany({ where: { createdAt: { gte: monthStart } } }),
    prisma.order.findMany({ select: { status: true } }),
  ]);

  const byStatus: Record<string, number> = {};
  allOrders.forEach(o => {
    byStatus[o.status] = (byStatus[o.status] || 0) + 1;
  });

  return NextResponse.json({
    todayCount: todayOrders.length,
    todayRevenue: todayOrders.reduce((sum, o) => sum + Number(o.total), 0),
    monthCount: monthOrders.length,
    monthRevenue: monthOrders.reduce((sum, o) => sum + Number(o.total), 0),
    byStatus,
  });
}
