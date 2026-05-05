import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function checkAuth(req: NextRequest) {
  return req.headers.get("x-admin-token") === process.env.ADMIN_TOKEN;
}

// GET - Listar cupones
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

// POST - Crear cupón
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const { code, description, type, value, minPurchase, maxUses, validUntil } = body;

    if (!code || !type) return NextResponse.json({ error: "Datos faltantes" }, { status: 400 });
    if (!["PERCENTAGE", "FIXED", "FREE_SHIPPING"].includes(type)) {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: String(code).toUpperCase().trim(),
        description: description || null,
        type,
        value: Number(value) || 0,
        minPurchase: Number(minPurchase) || 0,
        maxUses: maxUses ? Number(maxUses) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        active: true,
      },
    });
    return NextResponse.json({ success: true, coupon });
  } catch (error: Record<string, unknown>) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Ya existe un cupón con ese código" }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al crear" }, { status: 500 });
  }
}
