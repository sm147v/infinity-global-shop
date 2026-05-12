import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/us", destination: "/nosotros", permanent: true },
      { source: "/sends", destination: "/envios", permanent: true },
      { source: "/returns", destination: "/devoluciones", permanent: true },
      { source: "/gratitude", destination: "/gracias", permanent: true },
      { source: "/order", destination: "/pedido", permanent: true },
      { source: "/order/:path*", destination: "/pedido/:path*", permanent: true },
      { source: "/favorites", destination: "/favoritos", permanent: true },
      { source: "/productos", destination: "/productos", permanent: true },
      { source: "/productos/:path*", destination: "/productos/:path*", permanent: true },
      { source: "/pago", destination: "/pago", permanent: true },
    ];
  },
};

export default nextConfig;
