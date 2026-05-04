import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function checkAuth(req: NextRequest) {
  return req.headers.get("x-admin-token") === process.env.ADMIN_TOKEN;
}

// PATCH - Editar cupón
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await context.params;
    const body = await req.json();
    const data: any = {};
    if (typeof body.active === "boolean") data.active = body.active;
    if (typeof body.description === "string") data.description = body.description;
    if (typeof body.value === "number") data.value = body.value;
    if (typeof body.minPurchase === "number") data.minPurchase = body.minPurchase;
    if (body.maxUses !== undefined) data.maxUses = body.maxUses ? Number(body.maxUses) : null;
    if (body.validUntil !== undefined) data.validUntil = body.validUntil ? new Date(body.validUntil) : null;

    const coupon = await prisma.coupon.update({ where: { id: parseInt(id) }, data });
    return NextResponse.json({ success: true, coupon });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

// DELETE - Eliminar
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await context.params;
    await prisma.coupon.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
