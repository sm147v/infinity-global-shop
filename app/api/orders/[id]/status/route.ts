import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";
import { updateDeliveryStatusSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { hasAdminSession } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp, isSameOriginRequest } from "@/lib/security";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

    if (!hasAdminSession(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip = getClientIp(request);
    const rl = await checkRateLimit(`orders:status:${ip}`, 40, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rl.retryAfterSec),
          },
        },
      );
    }

    const { id } = await context.params;
    const orderId = Number(id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      throw new ApiError("Invalid order id", 400);
    }

    const payload = (await request.json()) as unknown;
    const parsed = updateDeliveryStatusSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid payload", 400);
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryStatus: parsed.data.deliveryStatus,
        status: parsed.data.deliveryStatus === "DELIVERED" ? "DELIVERED" : undefined,
      },
      select: {
        id: true,
        status: true,
        deliveryStatus: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
