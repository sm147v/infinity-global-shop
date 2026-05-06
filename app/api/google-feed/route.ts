import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const products = await prisma.product.findMany({
    
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      slug: true,
      images: true,
      category: true,
    }
  });

  const baseUrl = 'https://www.infinityglobalshop.com';

  const items = products.map(p => {
    const image = Array.isArray(p.images) ? p.images[0] : p.images;
    return `
    <item>
      <g:id>${p.id}</g:id>
      <title><![CDATA[${p.name}]]></title>
      <description><![CDATA[${p.description ?? p.name}]]></description>
      <link>${baseUrl}/products/${p.slug ?? p.id}</link>
      <g:image_link>${image ?? ''}</g:image_link>
      <g:price>${Number(p.price).toFixed(2)} COP</g:price>
      <g:availability>in_stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand><![CDATA[${p.name.split(' ')[0]}]]></g:brand>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Infinity Global Shop</title>
    <link>${baseUrl}</link>
    <description>Productos importados USA</description>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
