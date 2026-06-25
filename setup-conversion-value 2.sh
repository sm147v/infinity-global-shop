#!/usr/bin/env bash
set -e

if [ ! -f package.json ]; then
  echo "Corre el script desde la raiz del proyecto (infinity-global-shop)."
  exit 1
fi

cat > app/components/ConversionTracker.tsx <<'EOF'
"use client"
import { useEffect, useRef } from "react"

type Props = {
  orderNumber: string
}

export default function ConversionTracker({ orderNumber }: Props) {
  const fired = useRef(false)

  useEffect(() => {
    if (!orderNumber) return

    let cancelled = false
    let attempts = 0

    async function check() {
      if (cancelled || fired.current) return
      attempts++
      try {
        const res = await fetch("/api/order/" + encodeURIComponent(orderNumber))
        if (res.ok) {
          const data = await res.json()
          const order = data?.order
          if (order && order.status === "PAID") {
            if (!fired.current && typeof window.gtag === "function") {
              fired.current = true
              window.gtag("event", "conversion", {
                send_to: "AW-18266991654/lTLfCPyf9MQcEKbYsIZE",
                value: Number(order.total),
                currency: "COP",
                transaction_id: order.orderNumber,
              })
            }
            return
          }
        }
      } catch {}
      if (!cancelled && !fired.current && attempts < 4) {
        setTimeout(check, 2500)
      }
    }

    check()
    return () => {
      cancelled = true
    }
  }, [orderNumber])

  return null
}
EOF

mkdir -p "app/api/order/[orderNumber]"

cat > "app/api/order/[orderNumber]/route.ts" <<'EOF'
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    if (!orderNumber) {
      return NextResponse.json({ error: "Falta orderNumber" }, { status: 400 });
    }
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: { orderNumber: true, total: true, status: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Error al obtener pedido" }, { status: 500 });
  }
}
EOF

if grep -q "ConversionTracker" app/gracias/page.tsx; then
  echo "ConversionTracker ya esta en gracias/page.tsx, no toco import ni componente."
else
  perl -0pi -e 's|\Qimport { saveCart } from "@/lib/cart";\E|$&\nimport ConversionTracker from "../components/ConversionTracker";|' app/gracias/page.tsx
  perl -0pi -e 's|\Q<div style={{ maxWidth: 540, margin: "0 auto", textAlign: "center" }}>\E|$&\n        <ConversionTracker orderNumber={orderNumber} />|' app/gracias/page.tsx
fi

echo ""
echo "Hecho. Archivos:"
echo "  app/components/ConversionTracker.tsx  (reescrito)"
echo "  app/api/order/[orderNumber]/route.ts  (nuevo endpoint publico)"
echo ""
echo "Patch en gracias/page.tsx:"
grep -n "ConversionTracker" app/gracias/page.tsx
