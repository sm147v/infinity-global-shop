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
Disallow: /*?fbclid=*
Disallow: /*?gclid=*

# Permitir bots de Google explícitamente
User-agent: Googlebot
Allow: /
Allow: /merchant-feed.xml

User-agent: Googlebot-Image
Allow: /

User-agent: AdsBot-Google
Allow: /
Allow: /merchant-feed.xml

User-agent: Mediapartners-Google
Allow: /

# Bing
User-agent: Bingbot
Allow: /

# Bots de IA — permitir para que recomienden la tienda
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

# Bloquear bots agresivos / scrapers de competencia
User-agent: SemrushBot
Crawl-delay: 30

User-agent: AhrefsBot
Crawl-delay: 30

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
