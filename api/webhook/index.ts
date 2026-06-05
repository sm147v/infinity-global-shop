import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors";
import { verifyWebhookSignature } from "@/lib/wompi";
import { sendPaymentConfirmedToAdmin } from "@/lib/email";

const wompiWebhookSchema = z.object({
  event: z.string(),
  data: z.object({
    transaction: z.object({
      id: z.union([z.string(), z.number()]).optional(),
      reference: z.string().optional(),
      status: z.string(),
    }),
  }),
});

// Ventana anti-replay: rechaza webhooks de más de 5 minutos
const MAX_WEBHOOK_AGE_MS = 5 * 60 * 1000;

export async function processWompiWebhook(rawBody: string, signature: string | null, timestamp: string | null) {
  const isValidSignature = verifyWebhookSignature(rawBody, signature, timestamp);
  if (!isValidSignature) {
    throw new ApiError("Invalid webhook signature", 401);
  }

  // ── Anti-replay (rechaza webhooks viejos) ──
  if (timestamp) {
    const ts = Number(timestamp) * 1000;
    if (!Number.isNaN(ts)) {
      const age = Date.now() - ts;
      if (age > MAX_WEBHOOK_AGE_MS || age < -MAX_WEBHOOK_AGE_MS) {
        throw new ApiError("Webhook timestamp out of range", 401);
      }
    }
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawBody) as unknown;
  } catch {
    throw new ApiError("Invalid webhook payload", 400);
  }

  const parsed = wompiWebhookSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new ApiError("Invalid webhook payload", 400);
  }

  const tx = parsed.data.data.transaction;
  const status = tx.status.toUpperCase();
  const transactionId = tx.id ? String(tx.id) : undefined;
  const reference = tx.reference;

  if (!transactionId && !reference) {
    throw new ApiError("Webhook missing transaction identity", 400);
  }

  const identityFilters: Array<{ paymentReference: string } | { transactionId: string }> = [];
  if (reference) {
    identityFilters.push({ paymentReference: reference });
  }
  if (transactionId) {
    identityFilters.push({ transactionId });
  }

  const order = await prisma.order.findFirst({
    where: { OR: identityFilters },
    select: { id: true, paymentStatus: true },
  });

  if (!order) {
    throw new ApiError("Order not found for webhook", 404);
  }

  // ── Idempotencia — si ya está PAID, no reprocesar ni reenviar email ──
  if (order.paymentStatus === "PAID" && status === "APPROVED") {
    return { ok: true, alreadyProcessed: true };
  }

  if (status === "APPROVED") {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        status: "PAID",
        transactionId: transactionId ?? undefined,
      },
    });

    // ── Email de PAGO CONFIRMADO al admin (no rompe el webhook si falla) ──
    try {
      const fullOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: { items: { include: { product: true } } },
      });

      if (fullOrder) {
        await sendPaymentConfirmedToAdmin({
          orderNumber: fullOrder.paymentReference ?? ("#" + fullOrder.id),
          customerName: fullOrder.customerName,
          customerEmail: "",
          customerPhone: fullOrder.customerPhone ?? "",
          customerAddress: fullOrder.customerAddress ?? "",
          total: Number(fullOrder.total),
          items: fullOrder.items.map((i) => ({
            name: i.product?.name ?? "Producto",
            quantity: i.quantity,
            unitPrice: Number(i.unitPrice),
          })),
        }).catch((e) => console.error("Email pago confirmado falló:", e));
      }
    } catch (e) {
      console.error("Error preparando email de pago confirmado:", e);
    }
  } else if (["DECLINED", "VOIDED", "ERROR"].includes(status)) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "FAILED",
        transactionId: transactionId ?? undefined,
      },
    });
  } else if (status === "PENDING") {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PENDING",
        transactionId: transactionId ?? undefined,
      },
    });
  }

  return { ok: true };
}
