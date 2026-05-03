import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (token === process.env.ADMIN_TOKEN) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Token incorrecto" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 400 });
  }
}
