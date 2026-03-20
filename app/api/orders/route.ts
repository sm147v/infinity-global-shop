import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";
import { createOrderFromPayload, listOrders } from "@/api/orders";
import { hasAdminSession } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp, isSameOriginRequest } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    if (!hasAdminSession(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await listOrders();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

    const ip = getClientIp(request);
    const rl = await checkRateLimit(`orders:create:${ip}`, 12, 60_000);
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

    const payload = (await request.json()) as unknown;
    const order = await createOrderFromPayload(payload);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
