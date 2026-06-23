import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors";
import { createOrderSchema } from "@/lib/validation";
import { generateOrderNumber } from "@/lib/order-number";
import { sendOrderConfirmationToCustomer, sendNewOrderNotificationToAdmin } from "@/lib/email";
import { getActiveDiscountRules, priceWithDiscount } from "@/lib/discounts";

// Reglas de envío por zona (deben coincidir con cart-context.tsx)
const ZONE_RULES = {
  medellin: { label: "Medellín", cost: 8000, freeThreshold: 80000 },
  nacional: { label: "Resto de Colombia", cost: 15000, freeThreshold: 150000 },
} as const;

export async function createOrderFromPayload(payload: unknown) {
  const parsed = createOrderSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid order payload", 400);
  }

  const data = parsed.data;
  const productIds = [...new Set(data.items.map((item) => item.productId))];

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true, stock: true, active: true, category: true },
  });

  // Reglas de descuento activas (para cobrar el precio rebajado, no el lleno)
  const discountRules = await getActiveDiscountRules();

  if (products.length !== productIds.length) {
    throw new ApiError("Algunos productos no existen", 400);
  }

  const map = new Map(products.map((product) => [product.id, product]));

  const orderItems = data.items.map((item) => {
    const product = map.get(item.productId);
    if (!product) throw new ApiError("Producto no encontrado", 400);
    if (!product.active) {
      throw new ApiError(`Este producto no está disponible para la venta`, 400);
    }
    if (product.stock < item.quantity) {
      throw new ApiError(`Sin stock suficiente para ${product.name}`, 409);
    }
    const _priced = priceWithDiscount(
      { id: product.id, category: product.category, price: Number(product.price) },
      discountRules
    );
    const unitPrice = _priced.price;
    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice,
      subtotal: unitPrice * item.quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  // VALIDACIÓN SERVER-SIDE DEL CUPÓN
  let couponDiscount = 0;
  let couponFreeShipping = false;
  let appliedCouponCode: string | null = null;

  if (data.couponCode) {
    const couponCode = String(data.couponCode).toUpperCase().trim();
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });

    if (coupon && coupon.active) {
      const now = new Date();
      const isExpired = coupon.validUntil && new Date(coupon.validUntil) < now;
      const isUsedUp = coupon.maxUses !== null && (coupon.currentUses ?? 0) >= coupon.maxUses;
      const minPurchase = Number(coupon.minPurchase) || 0;
      const meetsMin = subtotal >= minPurchase;

      if (!isExpired && !isUsedUp && meetsMin) {
        if (coupon.type === "PERCENTAGE") {
          couponDiscount = Math.round(subtotal * (Number(coupon.value) / 100));
        } else if (coupon.type === "FIXED") {
          couponDiscount = Math.min(Number(coupon.value), subtotal);
        } else if (coupon.type === "FREE_SHIPPING") {
          couponFreeShipping = true;
        }
        appliedCouponCode = couponCode;
      }
    }
  }

  // ENVÍO SEGÚN ZONA — el servidor manda, no confía en el navegador
  const zoneRule = ZONE_RULES[data.zone];
  if (!zoneRule) {
    throw new ApiError("Zona de envío inválida", 400);
  }
  const baseFreeShipping = subtotal >= zoneRule.freeThreshold;
  const shipping = (baseFreeShipping || couponFreeShipping) ? 0 : zoneRule.cost;
  const total = Math.max(0, subtotal + shipping - couponDiscount);

  // Guardar la zona en la dirección para que aparezca en el panel de admin
  const zoneTag = `[ENVÍO: ${zoneRule.label}]`;
  const addressWithZone = `${zoneTag} ${data.customerAddress}`;

  const orderNumber = await generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    for (const item of orderItems) {
      const stockUpdate = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (stockUpdate.count !== 1) {
        throw new ApiError("El stock cambió, recarga e intenta de nuevo", 409);
      }
    }

    if (appliedCouponCode) {
      await tx.coupon.update({
        where: { code: appliedCouponCode },
        data: { currentUses: { increment: 1 } },
      }).catch(() => {});
    }

    return tx.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail || "",
        customerPhone: data.customerPhone,
        customerAddress: addressWithZone,
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

  try {
    const emailData = {
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail || "",
      customerPhone: data.customerPhone,
      customerAddress: addressWithZone,
      total,
      items: orderItems.map(i => ({
        name: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    };

    if (data.customerEmail) {
      await sendOrderConfirmationToCustomer(emailData).catch(e => console.error("Email cliente falló:", e));
    }
    await sendNewOrderNotificationToAdmin(emailData).catch(e => console.error("Email admin falló:", e));
  } catch (e) {
    console.error("Error enviando emails:", e);
  }

  return {
    orderId: order.id,
    orderNumber,
    subtotal,
    shipping,
    discount: couponDiscount,
    couponCode: appliedCouponCode,
    total: Number(order.total),
  };
}

export async function listOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true } },
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
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
