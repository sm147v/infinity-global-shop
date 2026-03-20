import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";
import { processWompiWebhook } from "@/api/webhook";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-wompi-signature");
    const timestamp = request.headers.get("x-wompi-timestamp");

    const result = await processWompiWebhook(rawBody, signature, timestamp);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
