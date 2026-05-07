import crypto from "crypto";
import { ApiError } from "@/lib/errors";

type BuildCheckoutInput = {
  amountInCents: number;
  reference: string;
  orderNumber?: string;
};

export function buildWompiCheckoutUrl({ amountInCents, reference, orderNumber }: BuildCheckoutInput): string {
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const integrityKey = process.env.WOMPI_INTEGRITY_KEY;
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  if (!publicKey || !integrityKey) {
    throw new ApiError("Wompi keys are missing", 500);
  }

  const currency = "COP";
  const redirectUrl = orderNumber ? `${appUrl}/gratitude?orderNumber=${orderNumber}` : `${appUrl}/checkout`;
  const raw = `${reference}${amountInCents}${currency}${integrityKey}`;
  const signature = crypto.createHash("sha256").update(raw).digest("hex");

  const params = new URLSearchParams({
    "public-key": publicKey,
    currency,
    "amount-in-cents": String(amountInCents),
    reference,
    "redirect-url": redirectUrl,
    "signature:integrity": signature,
  });

  return `https://checkout.wompi.co/p/?${params.toString()}`;
}

export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null, timestampHeader: string | null): boolean {
  const secret = process.env.WOMPI_WEBHOOK_SECRET;
  if (!secret || !signatureHeader || !timestampHeader) return false;

  // Keep the signing process explicit and deterministic to avoid subtle webhook bypasses.
  const payload = `${timestampHeader}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
  } catch {
    return false;
  }
}
