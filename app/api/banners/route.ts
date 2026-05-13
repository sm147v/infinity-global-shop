import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // cache 60s

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(banners);
  } catch (e) {
    console.error("Error leyendo banners:", e);
    return NextResponse.json([], { status: 200 });
  }
}
