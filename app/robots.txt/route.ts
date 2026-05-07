export const dynamic = "force-static";
const SITE_URL = "https://www.infinityglobalshop.com";
export async function GET() {
  const content = `# Infinity Global Shop · robots.txt
User-agent: *
Allow: /
Allow: /api/google-feed
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

User-agent: Googlebot
Allow: /
Allow: /api/google-feed
Allow: /merchant-feed.xml

User-agent: Googlebot-Image
Allow: /

User-agent: AdsBot-Google
Allow: /
Allow: /api/google-feed
Allow: /merchant-feed.xml

User-agent: Mediapartners-Google
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

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
