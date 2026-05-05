import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    if (q.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 8,
      orderBy: { id: "desc" },
      select: { id: true, name: true, price: true, image: true, category: true, stock: true },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error en búsqueda:", error);
    return NextResponse.json({ products: [] });
  }
}
