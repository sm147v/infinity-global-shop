import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

const adminSessionSchema = z.object({
  token: z.string().min(8).max(200),
});

export async function POST(request: NextRequest) {
  const adminToken = process.env.ADMIN_TOKEN?.trim();
  if (!adminToken) {
    return NextResponse.json({ error: "ADMIN_TOKEN is not configured" }, { status: 500 });
  }

  const payload = (await request.json()) as unknown;
  const parsed = adminSessionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (parsed.data.token !== adminToken) {
    return NextResponse.json({ error: "Invalid admin token" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
