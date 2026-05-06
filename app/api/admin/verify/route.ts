import { NextRequest, NextResponse } from "next/server";
import { validateAdminToken } from "@/lib/admin-auth";
import { z } from "zod";

const verifySchema = z.object({
  token: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const parsed = verifySchema.safeParse(payload);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    
    if (validateAdminToken(parsed.data.token)) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Token incorrecto" }, { status: 401 });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Error" }, { status: 400 });
  }
}
