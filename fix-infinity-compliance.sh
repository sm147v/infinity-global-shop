#!/usr/bin/env bash
# ============================================================
#  Infinity Global Shop — Fix de "información engañosa" (Google)
#  Edita: app/page.tsx · components/site-footer.tsx · app/layout.tsx
#  - Quita el "+125 reseñas / 4.7" y los testimonios fabricados
#  - Reemplaza por bloque honesto "sé el primero"
#  - Añade contacto real (correo + teléfono + ciudad) al footer
#  - Activa la detección de contacto (format-detection)
#  - Corrige el email del JSON-LD a contacto@infinityglobalshop.com
#  Hace backup .compliancebak de cada archivo antes de tocar nada.
# ============================================================
set -euo pipefail

# Corre desde la raíz del proyecto
cd ~/Desktop/infinity-global-shop 2>/dev/null || {
  echo "❌ No encontré ~/Desktop/infinity-global-shop. Corre el script desde la raíz del proyecto."; exit 1;
}
[ -f app/page.tsx ] || { echo "❌ No estoy en la raíz del proyecto (falta app/page.tsx)."; exit 1; }

echo "📦 Backups (.compliancebak)…"
cp app/page.tsx            app/page.tsx.compliancebak
cp components/site-footer.tsx components/site-footer.tsx.compliancebak
cp app/layout.tsx          app/layout.tsx.compliancebak

python3 - <<'PYEOF'
import re, sys

def edit(path, fn):
    with open(path, encoding="utf-8") as f:
        src = f.read()
    new = fn(src)
    with open(path, "w", encoding="utf-8") as f:
        f.write(new)

def must_replace(src, old, new, label):
    if old not in src:
        print(f"  ⚠️  NO encontré: {label} (revisar a mano)")
        return src
    print(f"  ✅ {label}")
    return src.replace(old, new, 1)

# ---------------- app/page.tsx ----------------
def fix_page(src):
    # 1) Hero stat: "+125 Reseñas" -> "USA Importado"
    src = must_replace(
        src,
        '              { num: "+125", label: "Reseñas" },',
        '              { num: "USA", label: "Importado" },',
        'Hero: quitar "+125 Reseñas"',
    )

    # 2) Reemplazar TODO el bloque de reseñas fabricadas por uno honesto.
    pattern = re.compile(r"\{/\* RESEÑAS REALES.*?\{/\* FEATURES con Lucide \*/\}", re.DOTALL)
    nuevo = '''{/* RESEÑAS — tienda nueva, sé el primero (honesto, sin reseñas fabricadas) */}
      <section style={{ padding: "3.5rem 1.5rem", background: "#EDE3CD" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C97B5C", marginBottom: "0.5rem", display: "block" }}>
            — Recién empezamos
          </span>
          <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.85rem, 4vw, 2.6rem)", fontWeight: 400, color: "#4A5D3A", letterSpacing: "-0.02em", margin: "0.5rem 0 0.85rem" }}>
            Sé de los <em style={{ fontStyle: "italic", fontWeight: 300, color: "#C97B5C" }}>primeros</em> en contar tu experiencia
          </h2>
          <p style={{ color: "#4A4F45", fontSize: "0.98rem", lineHeight: 1.6, margin: "0 auto 1.75rem", maxWidth: "520px" }}>
            Somos una tienda nueva en Medellín y lo estamos haciendo bien desde el inicio. Tu reseña real será de las primeras en aparecer aquí — y nos ayuda a crecer con confianza.
          </p>
          <a href="https://wa.me/573054223600?text=Hola%21%20Quiero%20dejar%20mi%20rese%C3%B1a%20de%20Infinity%20Global%20Shop" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.95rem 1.75rem", background: "#4A5D3A", color: "#F7F1E5", borderRadius: 100, textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>
            Dejar mi reseña por WhatsApp
          </a>
        </div>
      </section>

      {/* FEATURES con Lucide */}'''
    src, n = pattern.subn(nuevo, src, count=1)
    print("  ✅ Reseñas: bloque fabricado reemplazado por honesto" if n
          else "  ⚠️  NO encontré el bloque de reseñas (revisar a mano)")
    return src

# ---------------- components/site-footer.tsx ----------------
def fix_footer(src):
    old = '''            </div>
          </div>

          {/* COL 2 */}'''
    new = '''            </div>

            {/* CONTACTO — datos visibles para transparencia (política Google) */}
            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ fontSize: "0.65rem", color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 0.65rem", fontWeight: 600 }}>Contacto</p>
              <a href="mailto:contacto@infinityglobalshop.com" style={{ ...footerLinkStyle, opacity: 0.85 }}>contacto@infinityglobalshop.com</a>
              <a href="tel:+573054223600" style={{ ...footerLinkStyle, opacity: 0.85 }}>+57 305 422 3600</a>
              <span style={{ ...footerLinkStyle, opacity: 0.6 }}>Medellín, Colombia · Tienda en línea</span>
              <span style={{ ...footerLinkStyle, opacity: 0.6, paddingTop: 0 }}>Entrega a domicilio</span>
            </div>
          </div>

          {/* COL 2 */}'''
    return must_replace(src, old, new, 'Footer: añadir columna de Contacto')

# ---------------- app/layout.tsx ----------------
def fix_layout(src):
    src = must_replace(
        src,
        '''  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },''',
        '''  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },''',
        'Layout: activar format-detection',
    )
    src = must_replace(
        src,
        '"email": "hola@infinityglobalshop.com",',
        '"email": "contacto@infinityglobalshop.com",',
        'Layout: corregir email del JSON-LD',
    )
    return src

print("✏️  app/page.tsx");            edit("app/page.tsx", fix_page)
print("✏️  components/site-footer.tsx"); edit("components/site-footer.tsx", fix_footer)
print("✏️  app/layout.tsx");          edit("app/layout.tsx", fix_layout)
print("\n✅ Listo. Revisa los cambios con: git diff")
PYEOF

echo ""
echo "👉 Si algún cambio dijo ⚠️, ese archivo no se tocó en esa parte; revísalo a mano."
echo "👉 Para descartar todo: restaura los .compliancebak"
echo "   (ej: cp app/page.tsx.compliancebak app/page.tsx)"
