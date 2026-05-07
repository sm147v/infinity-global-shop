import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors";
import { buildWompiCheckoutUrl } from "@/lib/wompi";
import { confirmPaymentSchema, createPaymentSchema } from "@/lib/validation";

export async function createPaymentFromPayload(payload: unknown) {
  const parsed = createPaymentSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid payment payload", 400);
  }

  const { orderId } = parsed.data;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, total: true, paymentStatus: true, orderNumber: true },
  });

  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  if (order.paymentStatus === "PAID") {
    throw new ApiError("Order already paid", 409);
  }

  const amountInCents = Math.round(Number(order.total) * 100);
  const reference = `order-${order.id}-${Date.now()}`;

  let paymentUrl: string;
  let mock = false;
  let transactionId: string | null = null;

  if (!process.env.WOMPI_PUBLIC_KEY || !process.env.WOMPI_INTEGRITY_KEY) {
    mock = true;
    const appUrl = process.env.APP_URL ?? "http://localhost:3000";
    transactionId = `mock-${Date.now()}`;
    const params = new URLSearchParams({
      mockPaid: "1",
      orderId: String(order.id),
      transactionId,
    });
    paymentUrl = `${appUrl}/checkout?${params.toString()}`;
  } else {
    paymentUrl = buildWompiCheckoutUrl({ amountInCents, reference, orderNumber: order.orderNumber ?? undefined });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentReference: reference,
      transactionId,
      paymentStatus: "PENDING",
    },
  });

  return {
    orderId: order.id,
    paymentUrl,
    reference,
    transactionId,
    mock,
  };
}

export async function confirmPaymentFromPayload(payload: unknown) {
  const parsed = confirmPaymentSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid confirm payload", 400);
  }

  if (process.env.NODE_ENV === "production") {
    throw new ApiError("Manual payment confirmation is disabled in production", 403);
  }

  const { orderId, transactionId, status } = parsed.data;
  const isApproved = status === "APPROVED";

  const existing = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, transactionId: true, paymentStatus: true },
  });

  if (!existing) {
    throw new ApiError("Order not found", 404);
  }

  if (!existing.transactionId || !existing.transactionId.startsWith("mock-")) {
    throw new ApiError("Order is not in mock payment mode", 409);
  }

  if (existing.transactionId !== transactionId) {
    throw new ApiError("Invalid transaction for this order", 409);
  }

  if (existing.paymentStatus === "PAID") {
    return {
      id: existing.id,
      paymentStatus: "PAID" as const,
      status: "PAID" as const,
    };
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      transactionId,
      paymentStatus: isApproved ? "PAID" : "FAILED",
      status: isApproved ? "PAID" : "PENDING",
    },
    select: { id: true, paymentStatus: true, status: true },
  });

  return order;
}
