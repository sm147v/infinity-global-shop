import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_SESSION_COOKIE, validateAdminToken } from "@/lib/admin-auth";

const adminSessionSchema = z.object({
  token: z.string().min(16).max(200),
});

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as unknown;
    const parsed = adminSessionSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (!validateAdminToken(parsed.data.token)) {
      return NextResponse.json({ error: "Invalid admin token" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, parsed.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Session POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
