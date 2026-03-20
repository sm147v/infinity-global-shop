import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors";
import { verifyWebhookSignature } from "@/lib/wompi";

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

export async function processWompiWebhook(rawBody: string, signature: string | null, timestamp: string | null) {
  const isValidSignature = verifyWebhookSignature(rawBody, signature, timestamp);
  if (!isValidSignature) {
    throw new ApiError("Invalid webhook signature", 401);
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
    where: {
      OR: identityFilters,
    },
    select: { id: true },
  });

  if (!order) {
    throw new ApiError("Order not found for webhook", 404);
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
  } else if (["DECLINED", "VOIDED", "ERROR"].includes(status)) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "FAILED",
        transactionId: transactionId ?? undefined,
      },
    });
  }

  return { ok: true };
}
