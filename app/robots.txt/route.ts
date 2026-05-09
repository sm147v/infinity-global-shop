import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Disallow: /checkout

User-agent: Googlebot
Allow: /
Disallow: /admin

User-agent: Googlebot-Image
Allow: /
Disallow: /admin

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

Sitemap: https://www.infinityglobalshop.com/sitemap.xml
`;
  return new NextResponse(robots, {
    headers: { "Content-Type": "text/plain", "Cache-Control": "public, max-age=86400" },
  });
}
