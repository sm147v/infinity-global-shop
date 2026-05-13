import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function auth(req: Request) {
  const t = process.env.ADMIN_TOKEN;
  return t && req.headers.get("x-admin-token") === t;
}

export async function GET(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const banners = await prisma.banner.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ banners });
}

export async function POST(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  if (!body.imageUrl) return NextResponse.json({ error: "Falta imageUrl" }, { status: 400 });
  const banner = await prisma.banner.create({
    data: {
      imageUrl: body.imageUrl,
      title: body.title || null,
      subtitle: body.subtitle || null,
      ctaText: body.ctaText || null,
      ctaUrl: body.ctaUrl || null,
      alt: body.alt || null,
      active: body.active !== false,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json({ banner });
}

export async function PUT(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "Falta id" }, { status: 400 });
  const banner = await prisma.banner.update({
    where: { id: body.id },
    data: {
      imageUrl: body.imageUrl,
      title: body.title || null,
      subtitle: body.subtitle || null,
      ctaText: body.ctaText || null,
      ctaUrl: body.ctaUrl || null,
      alt: body.alt || null,
      active: body.active !== false,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json({ banner });
}

export async function DELETE(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 });
  await prisma.banner.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
