import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Crear nueva reseña
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, customerName, customerEmail, orderNumber, rating, comment, location } = body;

    if (!productId || !customerName || !rating || !comment) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Calificación inválida" }, { status: 400 });
    }

    if (typeof comment !== "string" || comment.trim().length < 10) {
      return NextResponse.json({ error: "El comentario debe tener al menos 10 caracteres" }, { status: 400 });
    }

    // Si dieron orderNumber, verificar que el pedido exista
    let isVerified = false;
    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber: String(orderNumber).toUpperCase() },
      });
      if (order) {
        isVerified = true;
      }
    }

    const review = await prisma.review.create({
      data: {
        productId: Number(productId),
        customerName: String(customerName).trim(),
        customerEmail: customerEmail ? String(customerEmail).trim() : null,
        orderNumber: orderNumber ? String(orderNumber).toUpperCase() : null,
        rating: Number(rating),
        comment: String(comment).trim(),
        location: location ? String(location).trim() : null,
        approved: isVerified, // Si tiene número de pedido válido, se aprueba automáticamente
      },
    });

    return NextResponse.json({ success: true, review, autoApproved: isVerified });
  } catch (error) {
    console.error("Error creando reseña:", error);
    return NextResponse.json({ error: "Error al crear reseña" }, { status: 500 });
  }
}

// GET - Listar reseñas de un producto
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "productId requerido" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId: Number(productId),
        approved: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      distribution[r.rating as keyof typeof distribution]++;
    });

    return NextResponse.json({
      reviews,
      stats: {
        total: totalReviews,
        average: avgRating,
        distribution,
      },
    });
  } catch (error) {
    console.error("Error listando reseñas:", error);
    return NextResponse.json({ error: "Error al obtener reseñas" }, { status: 500 });
  }
}
