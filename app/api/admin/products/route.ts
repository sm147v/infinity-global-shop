import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function checkAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  return token === process.env.ADMIN_TOKEN;
}

// GET - Lista de productos para admin
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const products = await prisma.product.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json({ products });
}

// POST - Crear producto nuevo
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, description, price, stock, category } = body;

    if (!name || typeof price !== "number" || typeof stock !== "number") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price,
        stock,
        category: category || "General",
        image: null,
        images: [],
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
