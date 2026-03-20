import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";
import { createPaymentFromPayload } from "@/api/payments";
import { checkRateLimit, getClientIp, isSameOriginRequest } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

    const ip = getClientIp(request);
    const rl = await checkRateLimit(`payments:create:${ip}`, 18, 60_000);
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
    const result = await createPaymentFromPayload(payload);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
