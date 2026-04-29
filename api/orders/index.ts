import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors";
import { createOrderSchema } from "@/lib/validation";

type RawOrderBody = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{ productId: number; quantity: number }>;
};

export async function createOrderFromPayload(payload: unknown) {
  const parsed = createOrderSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid order payload", 400);
  }

  const data: RawOrderBody = parsed.data;
  const productIds = [...new Set(data.items.map((item) => item.productId))];

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true, stock: true },
  });

  if (products.length !== productIds.length) {
    throw new ApiError("Some products do not exist", 400);
  }

const map = new Map(products.map((product) => [product.id, product]));

  const orderItems = data.items.map((item) => {
    const product = map.get(item.productId);
    if (!product) {
      throw new ApiError("Product not found", 400);
    }
    if (product.stock < item.quantity) {
      throw new ApiError(`Not enough stock for ${product.name}`, 409);
    }

    const unitPrice = Number(product.price);
    return {
      productId: product.id,
      quantity: item.quantity,
      unitPrice,
      subtotal: unitPrice * item.quantity,
    };
  });

  const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  const order = await prisma.$transaction(async (tx) => {
    for (const item of orderItems) {
      const stockUpdate = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: { gte: item.quantity },
        },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      if (stockUpdate.count !== 1) {
        throw new ApiError("Stock changed, please refresh and try again", 409);
      }
    }

    return tx.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        total: new Prisma.Decimal(total.toFixed(2)),
        items: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: new Prisma.Decimal(item.unitPrice.toFixed(2)),
            subtotal: new Prisma.Decimal(item.subtotal.toFixed(2)),
          })),
        },
      },
    });
  });

  return {
    orderId: order.id,
    total: Number(order.total),
  };
}

export async function listOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    status: order.status,
    deliveryStatus: order.deliveryStatus,
    paymentStatus: order.paymentStatus,
    total: Number(order.total),
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
    })),
  }));
}
