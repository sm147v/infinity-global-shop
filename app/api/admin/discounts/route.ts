import { NextRequest, NextResponse } from "next/server";
import { validateAdminToken } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function auth(req: NextRequest) {
  return validateAdminToken(req.headers.get("x-admin-token"));
}

// Listar todas las reglas (para el panel admin)
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const rows = await prisma.discountRule.findMany({ orderBy: { createdAt: "desc" } });
    const rules = rows.map((r) => ({
      id: r.id,
      productIds: r.scope === "products" ? r.productIds : (r.scope === "all" ? "all" : []),
      scope: r.scope,
      category: r.category,
      type: r.type,
      value: r.value,
      label: r.label,
      expiresAt: r.expiresAt ? r.expiresAt.toISOString() : null,
      active: r.active,
      createdAt: r.createdAt.toISOString(),
    }));
    return NextResponse.json({ rules });
  } catch (e) {
    console.error("GET discounts error:", e);
    return NextResponse.json({ rules: [] });
  }
}

// Crear una regla nueva
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();

    // Normalizar el scope: el admin manda productIds: "all" | number[]
    let scope: string = body.scope || "all";
    let productIds: number[] = [];
    let category: string | null = body.category || null;

    if (body.productIds === "all") {
      scope = "all";
    } else if (Array.isArray(body.productIds) && body.productIds.length > 0) {
      scope = "products";
      productIds = body.productIds.map((n: unknown) => Number(n)).filter((n: number) => Number.isInteger(n));
    } else if (category) {
      scope = "category";
    }

    const type = body.type === "fixed" ? "fixed" : "percentage";
    const value = Number(body.value) || 0;
    const label = (body.label && String(body.label).trim()) || (type === "percentage" ? `-${value}%` : "OFERTA");
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

    if (value <= 0) {
      return NextResponse.json({ error: "El valor del descuento debe ser mayor a 0" }, { status: 400 });
    }

    const rule = await prisma.discountRule.create({
      data: { scope, category, productIds, type, value, label, expiresAt, active: true },
    });

    return NextResponse.json({ rule: { ...rule, createdAt: rule.createdAt.toISOString() } });
  } catch (e) {
    console.error("POST discounts error:", e);
    return NextResponse.json({ error: "No se pudo crear el descuento" }, { status: 500 });
  }
}

// Borrar / desactivar una regla:  /api/admin/discounts?id=xxx
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 });
    await prisma.discountRule.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE discounts error:", e);
    return NextResponse.json({ error: "No se pudo borrar" }, { status: 500 });
  }
}
