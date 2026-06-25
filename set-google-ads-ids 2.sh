#!/usr/bin/env bash
set -e

if [ ! -f package.json ]; then
  echo "No encuentro package.json. Corre el script desde la raiz del proyecto (infinity-global-shop)."
  exit 1
fi

CONV_ID="AW-18266991654"
SEND_TO="AW-18266991654/lTLfCPyf9MQcEKbYsIZE"

if [ ! -f app/components/GoogleAdsTag.tsx ] || [ ! -f app/components/ConversionTracker.tsx ]; then
  echo "Faltan los archivos. Corre primero setup-google-ads.sh"
  exit 1
fi

sed -i '' "s|AW-XXXXXXXXX|$CONV_ID|g" app/components/GoogleAdsTag.tsx
sed -i '' "s|AW-XXXXXXXXX/TU_LABEL|$SEND_TO|g" app/components/ConversionTracker.tsx

echo ""
echo "Listo. Valores reemplazados:"
echo "  GoogleAdsTag.tsx     -> $CONV_ID"
echo "  ConversionTracker.tsx -> $SEND_TO"
echo ""
echo "Verifica que quedaron bien:"
grep -n "AW-" app/components/GoogleAdsTag.tsx
grep -n "send_to" app/components/ConversionTracker.tsx
