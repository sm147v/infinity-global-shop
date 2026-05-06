import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── TypeScript estricto ──
  typescript: {
    ignoreBuildErrors: false,
  },

  // ── Optimización de imágenes ──
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  // ── Compresión y experimentales ──
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // ── Headers ──
  headers: async () => {
    return [
      {
        // Headers de seguridad para todas las rutas
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
      {
        // Cache fuerte para imágenes estáticas en /public
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|gif|woff2|woff|ttf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache para sitemap y feeds
        source: "/sitemap.xml",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/merchant-feed.xml",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
      {
        // Cache para robots.txt
        source: "/robots.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },

  // ── Redirects útiles ──
  redirects: async () => {
    return [
      // Si alguien llega sin www, redirigir a www (canonical)
      {
        source: "/:path*",
        has: [{ type: "host", value: "infinityglobalshop.com" }],
        destination: "https://www.infinityglobalshop.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
