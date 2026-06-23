#!/usr/bin/env bash
set -e
cd "$(git rev-parse --show-toplevel)"
F="prisma/schema.postgres.prisma"
cp "$F" "$F.bak-mobile"

python3 << 'PYEOF'
import io
F = "prisma/schema.postgres.prisma"
s = io.open(F, encoding="utf-8").read()
viejo = '''model Banner {
  id          Int      @id @default(autoincrement())
  imageUrl    String'''
nuevo = '''model Banner {
  id          Int      @id @default(autoincrement())
  imageUrl    String
  imageUrlMobile String?'''
if viejo in s:
    s = s.replace(viejo, nuevo)
    io.open(F, "w", encoding="utf-8").write(s)
    print("Campo imageUrlMobile agregado al modelo Banner")
else:
    print(">>> No encontre el bloque, revisar a mano")
PYEOF

echo "=== Como quedo el modelo Banner ==="
sed -n '127,142p' "$F"
