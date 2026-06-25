#!/usr/bin/env bash
set -e

if [ ! -f package.json ]; then
  echo "No encuentro package.json. Corre el script desde la raiz del proyecto (infinity-global-shop)."
  exit 1
fi

mkdir -p app/components types

cat > types/gtag.d.ts <<'EOF'
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}
export {}
EOF

cat > app/components/GoogleAdsTag.tsx <<'EOF'
import Script from "next/script"

export default function GoogleAdsTag() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"
        strategy="afterInteractive"
      />
      <Script id="google-ads" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-XXXXXXXXX');
        `}
      </Script>
    </>
  )
}
EOF

cat > app/components/ConversionTracker.tsx <<'EOF'
"use client"
import { useEffect, useRef } from "react"

type Props = {
  value: number
  transactionId: string
  currency?: string
}

export default function ConversionTracker({ value, transactionId, currency = "COP" }: Props) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    if (typeof window.gtag !== "function") return
    if (!value || !transactionId) return
    fired.current = true
    window.gtag("event", "conversion", {
      send_to: "AW-XXXXXXXXX/TU_LABEL",
      value,
      currency,
      transaction_id: transactionId,
    })
  }, [value, transactionId, currency])

  return null
}
EOF

echo ""
echo "Archivos creados:"
echo "  types/gtag.d.ts"
echo "  app/components/GoogleAdsTag.tsx"
echo "  app/components/ConversionTracker.tsx"
echo ""
echo "Faltan 2 ediciones manuales en VS Code:"
echo "  1. En app/layout.tsx: importa y agrega <GoogleAdsTag /> antes de cerrar </body>"
echo "  2. En tu pagina /gracias: agrega <ConversionTracker value={order.total} transactionId={order.paymentReference} />"
echo ""
echo "Y reemplaza AW-XXXXXXXXX y TU_LABEL por los valores reales de Google Ads."
