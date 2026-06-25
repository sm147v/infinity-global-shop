#!/usr/bin/env bash
set -e

if [ ! -f package.json ]; then
  echo "Corre el script desde la raiz del proyecto (infinity-global-shop)."
  exit 1
fi

GA_FILE=""
for f in components/google-analytics.tsx src/components/google-analytics.tsx app/components/google-analytics.tsx; do
  if [ -f "$f" ]; then GA_FILE="$f"; break; fi
done

if [ -z "$GA_FILE" ]; then
  echo "No encontre google-analytics.tsx. Por seguridad no toco nada."
  exit 0
fi

if ! grep -q "AW-18266991654" "$GA_FILE"; then
  echo "OJO: $GA_FILE NO contiene AW-18266991654."
  echo "Entonces GoogleAdsTag NO es duplicado, lo dejo como esta."
  exit 0
fi

echo "Confirmado: AW-18266991654 ya vive en $GA_FILE."
echo "Quito el GoogleAdsTag duplicado del layout..."

grep -vF 'import GoogleAdsTag from "./components/GoogleAdsTag";' app/layout.tsx > /tmp/igs_layout.tsx && mv /tmp/igs_layout.tsx app/layout.tsx
grep -vF '<GoogleAdsTag />' app/layout.tsx > /tmp/igs_layout.tsx && mv /tmp/igs_layout.tsx app/layout.tsx
rm -f app/components/GoogleAdsTag.tsx

echo ""
echo "Listo, duplicado eliminado:"
echo "  - import GoogleAdsTag quitado de layout.tsx"
echo "  - <GoogleAdsTag /> quitado de layout.tsx"
echo "  - app/components/GoogleAdsTag.tsx borrado"
echo ""
echo "Referencias restantes en layout (deberia salir limpio):"
grep -n "GoogleAdsTag" app/layout.tsx || echo "  (limpio)"
