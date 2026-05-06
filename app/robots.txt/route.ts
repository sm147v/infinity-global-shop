export const dynamic = "force-static";

const SITE_URL = "https://www.infinityglobalshop.com";

export async function GET() {
  const content = `# Infinity Global Shop · robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/
Disallow: /checkout
Disallow: /pedido
Disallow: /order/
Disallow: /favorites
Disallow: /gratitude
Disallow: /*?utm_*
Disallow: /*?ref=*

# Permitir bots de Google explícitamente
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: AdsBot-Google
Allow: /

# Bloquear bots agresivos
User-agent: SemrushBot
Crawl-delay: 10

User-agent: AhrefsBot
Crawl-delay: 10

Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
