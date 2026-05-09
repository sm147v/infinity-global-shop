import { NextRequest, NextResponse } from "next/server";
import { validateAdminToken } from "@/lib/admin-auth";

// Store compartido via módulo singleton
const store = (globalThis as Record<string, unknown>);

function getStore(): Map<string, Record<string, unknown>> {
  if (!store.__discountRules) {
    store.__discountRules = new Map();
  }
  return store.__discountRules as Map<string, Record<string, unknown>>;
}

function auth(req: NextRequest) {
  return validateAdminToken(req.headers.get("x-admin-token"));
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const rules = getStore();
  const existing = rules.get(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated = { ...existing, ...body };
  rules.set(id, updated);
  return NextResponse.json({ rule: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  getStore().delete(id);
  return NextResponse.json({ ok: true });
}
