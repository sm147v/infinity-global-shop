import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAdminToken, getAdminTokenFromHeaders } from "@/lib/admin-auth";

function checkAuth(req: NextRequest) {
  const token = getAdminTokenFromHeaders(req);
  return validateAdminToken(token);
}

// PATCH - Aprobar/desaprobar reseña
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { id } = await context.params;
    const body = await req.json();
    const review = await prisma.review.update({
      where: { id: parseInt(id) },
      data: { approved: !!body.approved },
    });
    return NextResponse.json({ success: true, review });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

// DELETE - Eliminar reseña
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { id } = await context.params;
    await prisma.review.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
