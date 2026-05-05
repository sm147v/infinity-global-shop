import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) return NextResponse.json({ valid: false, error: "Ingresa un código" }, { status: 400 });

    const coupon = await prisma.coupon.findUnique({
      where: { code: String(code).toUpperCase().trim() },
    });

    if (!coupon) return NextResponse.json({ valid: false, error: "Cupón no encontrado" });
    if (!coupon.active) return NextResponse.json({ valid: false, error: "Este cupón no está activo" });

    const now = new Date();
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return NextResponse.json({ valid: false, error: "Este cupón está vencido" });
    }
    if (coupon.maxUses !== null && (coupon.currentUses ?? 0) >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: "Este cupón ya alcanzó su límite de usos" });
    }

    const subtotalNum = Number(subtotal) || 0;
    const minPurchase = Number(coupon.minPurchase) || 0;
    if (minPurchase > 0 && subtotalNum < minPurchase) {
      return NextResponse.json({
        valid: false,
        error: "Compra mínima de $" + minPurchase.toLocaleString("es-CO") + " para usar este cupón",
      });
    }

    let discount = 0;
    let freeShipping = false;
    if (coupon.type === "PERCENTAGE") {
      discount = subtotalNum * (Number(coupon.value) / 100);
    } else if (coupon.type === "FIXED") {
      discount = Math.min(Number(coupon.value), subtotalNum);
    } else if (coupon.type === "FREE_SHIPPING") {
      freeShipping = true;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: Number(coupon.value),
        discount: Math.round(discount),
        freeShipping,
      },
    });
  } catch (error) {
    console.error("Error validando cupón:", error);
    return NextResponse.json({ valid: false, error: "Error al validar" }, { status: 500 });
  }
}
