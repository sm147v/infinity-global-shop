import { z } from "zod";
import { sanitizeText } from "@/lib/sanitize";

const nameSchema = z
  .string()
  .min(2)
  .max(120)
  .transform((v) => sanitizeText(v, 120));

const phoneSchema = z
  .string()
  .min(7)
  .max(20)
  .regex(/^[+0-9\-\s()]+$/, "Telefono invalido")
  .transform((v) => sanitizeText(v, 20));

const addressSchema = z
  .string()
  .min(8)
  .max(200)
  .transform((v) => sanitizeText(v, 200));

const emailSchema = z
  .string()
  .email("Email invalido")
  .max(120)
  .transform((v) => sanitizeText(v, 120))
  .optional()
  .or(z.literal(""));

export const createOrderSchema = z.object({
  customerName: nameSchema,
  customerEmail: emailSchema,
  customerPhone: phoneSchema,
  customerAddress: addressSchema,
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive().max(20),
      }),
    )
    .min(1)
    .max(50),
  couponCode: z.string().trim().toUpperCase().min(2).max(40).optional().nullable(),
});

export const createPaymentSchema = z.object({
  orderId: z.number().int().positive(),
});

export const confirmPaymentSchema = z.object({
  orderId: z.number().int().positive(),
  transactionId: z.string().min(1),
  status: z.enum(["APPROVED", "DECLINED", "VOIDED", "PENDING", "ERROR"]),
});
