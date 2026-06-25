#!/usr/bin/env bash
set -e

if [ ! -f package.json ]; then
  echo "Corre el script desde la raiz del proyecto (infinity-global-shop)."
  exit 1
fi

if [ ! -f app/layout.tsx ]; then
  echo "No encuentro app/layout.tsx"
  exit 1
fi

if grep -q "GoogleAdsTag" app/layout.tsx; then
  echo "GoogleAdsTag ya esta en layout.tsx. No hago nada."
  exit 0
fi

perl -0pi -e 's|\Qimport { GoogleAnalytics } from "@/components/google-analytics";\E|$&\nimport GoogleAdsTag from "./components/GoogleAdsTag";|' app/layout.tsx

perl -0pi -e 's|<GoogleAnalytics />|<GoogleAnalytics />\n          <GoogleAdsTag />|' app/layout.tsx

echo ""
echo "layout.tsx actualizado. Verifica que aparezca el import y el componente:"
grep -n "GoogleAdsTag" app/layout.tsx
