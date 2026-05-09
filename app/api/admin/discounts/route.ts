import { NextRequest, NextResponse } from "next/server";
import { validateAdminToken } from "@/lib/admin-auth";
import { randomUUID } from "crypto";

function getStore(): Map<string, Record<string, unknown>> {
  const g = globalThis as Record<string, unknown>;
  if (!g.__discountRules) g.__discountRules = new Map();
  return g.__discountRules as Map<string, Record<string, unknown>>;
}

function auth(req: NextRequest) {
  return validateAdminToken(req.headers.get("x-admin-token"));
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ rules: [...getStore().values()] });
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const id = randomUUID();
  const rule = { ...body, id, createdAt: new Date().toISOString() };
  getStore().set(id, rule);
  return NextResponse.json({ rule });
}
