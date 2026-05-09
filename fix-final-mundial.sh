#!/bin/bash
set -eo pipefail
GREEN='\033[0;32m'; BLUE='\033[0;34m'; NC='\033[0m'
log() { echo -e "${GREEN}ok${NC} $1"; }
title() { echo -e "\n${BLUE}--- $1 ---${NC}\n"; }
[ ! -f "package.json" ] && { echo "cd a tu proyecto"; exit 1; }
cp components/product-detail-client.tsx components/product-detail-client.tsx.bak
cp app/robots.txt/route.ts app/robots.txt/route.ts.bak 2>/dev/null || true

# ============================================================
# 1) QUITAR DUPLICADO del badge originalidad
# ============================================================
title "Fix duplicado badge"
python3 << 'PYEOF'
with open('components/product-detail-client.tsx', 'r') as f:
    c = f.read()

badge = '''            {/* Badge originalidad */}
            <div style={{ background: "linear-gradient(135deg, rgba(74,93,58,0.06), rgba(201,169,110,0.08))", border: "1px solid #EDE3CD", borderRadius: 14, padding: "0.85rem 1rem", marginBottom: "1.5rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>🛡️</span>
              <div>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#4A5D3A", margin: "0 0 0.25rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  100% Original · Importado de USA
                </p>
                <p style={{ fontSize: "0.78rem", color: "#4A4F45", margin: 0, lineHeight: 1.5 }}>
                  Todos nuestros productos son comprados directamente en tiendas y cadenas oficiales de Estados Unidos. Llegan sellados, con fecha de vencimiento vigente y sin intermediarios.
                </p>
              </div>
            </div>'''

# Reemplazar las DOS ocurrencias por UNA sola
count = c.count(badge)
print(f"Badge encontrado {count} veces")
if count == 2:
    # Reemplazar ambas por una sola
    c = c.replace(badge + '\n' + badge, badge)
    # Si no funcionó con newline, intentar directo
    if c.count(badge) == 2:
        idx = c.find(badge)
        idx2 = c.find(badge, idx + len(badge))
        if idx2 != -1:
            c = c[:idx2] + c[idx2 + len(badge):]
    print(f"Ahora hay {c.count(badge)} badge(s)")

with open('components/product-detail-client.tsx', 'w') as f:
    f.write(c)
print("Listo")
PYEOF
log "Duplicado eliminado"

# ============================================================
# 2) ROBOTS.TXT — permitir Googlebot-Image
# ============================================================
title "Fix robots.txt para Merchant"
cat > app/robots.txt/route.ts << 'ROBOTS_EOF'
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Disallow: /checkout

User-agent: Googlebot
Allow: /
Disallow: /admin

User-agent: Googlebot-Image
Allow: /
Disallow: /admin

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

Sitemap: https://www.infinityglobalshop.com/sitemap.xml
`;
  return new NextResponse(robots, {
    headers: { "Content-Type": "text/plain", "Cache-Control": "public, max-age=86400" },
  });
}
ROBOTS_EOF
log "Robots.txt actualizado con Googlebot-Image"

# ============================================================
# 3) ADMIN DESCUENTOS — página completa
# ============================================================
title "Creando admin/discounts"

mkdir -p app/admin/discounts

cat > app/admin/discounts/page.tsx << 'DISC_EOF'
"use client";
import { useEffect, useState, useCallback } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  category: string | null;
  stock: number;
}

interface DiscountRule {
  id: string;
  productIds: number[] | "all";
  category: string | null;
  type: "percentage" | "fixed";
  value: number;
  label: string;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
}

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");
const TOKEN_KEY = "adminToken";

export default function DiscountsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rules, setRules] = useState<DiscountRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [scope, setScope] = useState<"all" | "category" | "products">("all");
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [discType, setDiscType] = useState<"percentage" | "fixed">("percentage");
  const [discValue, setDiscValue] = useState(10);
  const [discLabel, setDiscLabel] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [search, setSearch] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) || "" : "";

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/admin/products", {
      headers: { "x-admin-token": token },
    });
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products || []);
    }
  }, [token]);

  const fetchRules = useCallback(async () => {
    const res = await fetch("/api/admin/discounts", {
      headers: { "x-admin-token": token },
    });
    if (res.ok) {
      const data = await res.json();
      setRules(data.rules || []);
    }
  }, [token]);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchRules()]).finally(() => setLoading(false));
  }, [fetchProducts, fetchRules]);

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))] as string[];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  function toggleProduct(id: number) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function previewPrice(price: number) {
    if (discType === "percentage") return price * (1 - discValue / 100);
    return Math.max(0, price - discValue);
  }

  async function saveRule() {
    if (discValue <= 0) return;
    setSaving(true);
    const rule: Omit<DiscountRule, "id" | "createdAt"> = {
      productIds: scope === "all" ? "all" : scope === "category" ? [] : selectedIds,
      category: scope === "category" ? selectedCat : null,
      type: discType,
      value: discValue,
      label: discLabel || (discType === "percentage" ? `${discValue}% OFF` : `${fmt(discValue)} OFF`),
      expiresAt: expiresAt || null,
      active: true,
    };
    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(rule),
    });
    if (res.ok) {
      await fetchRules();
      setSelectedIds([]);
      setDiscValue(10);
      setDiscLabel("");
      setExpiresAt("");
      setScope("all");
    }
    setSaving(false);
  }

  async function toggleRule(id: string, active: boolean) {
    await fetch(`/api/admin/discounts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ active }),
    });
    setRules(prev => prev.map(r => r.id === id ? { ...r, active } : r));
  }

  async function deleteRule(id: string) {
    if (!confirm("Eliminar este descuento?")) return;
    await fetch(`/api/admin/discounts/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": token },
    });
    setRules(prev => prev.filter(r => r.id !== id));
  }

  const S: Record<string, React.CSSProperties> = {
    page: { padding: "1.5rem", fontFamily: "var(--font-dm-sans), Inter, sans-serif", maxWidth: 1100, margin: "0 auto" },
    title: { fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.8rem", color: "#4A5D3A", fontWeight: 400, margin: "0 0 0.25rem" },
    subtitle: { color: "#4A4F45", fontSize: "0.9rem", margin: "0 0 2rem" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" },
    card: { background: "#FDFAF3", border: "1px solid #EDE3CD", borderRadius: 18, padding: "1.25rem" },
    label: { fontSize: "0.75rem", fontWeight: 600, color: "#4A5D3A", textTransform: "uppercase" as const, letterSpacing: "0.1em", display: "block", marginBottom: "0.4rem" },
    input: { width: "100%", padding: "0.7rem 1rem", borderRadius: 10, border: "1px solid #EDE3CD", fontSize: "0.9rem", fontFamily: "inherit", background: "#F7F1E5", boxSizing: "border-box" as const },
    btn: { background: "#4A5D3A", color: "#F7F1E5", border: "none", padding: "0.85rem 1.5rem", borderRadius: 100, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%" },
    scopeBtn: (active: boolean): React.CSSProperties => ({ padding: "0.5rem 1rem", borderRadius: 100, border: `1px solid ${active ? "#4A5D3A" : "#EDE3CD"}`, background: active ? "#4A5D3A" : "transparent", color: active ? "#F7F1E5" : "#4A4F45", fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit" }),
    typeBtn: (active: boolean): React.CSSProperties => ({ flex: 1, padding: "0.6rem", borderRadius: 10, border: `2px solid ${active ? "#4A5D3A" : "#EDE3CD"}`, background: active ? "rgba(74,93,58,0.08)" : "transparent", color: active ? "#4A5D3A" : "#4A4F45", fontSize: "0.85rem", fontWeight: active ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }),
  };

  if (loading) return <div style={{ padding: "3rem", textAlign: "center", color: "#4A4F45" }}>Cargando...</div>;

  return (
    <div style={S.page}>
      <h1 style={S.title}>Descuentos</h1>
      <p style={S.subtitle}>Crea y gestiona descuentos por producto, categoría o toda la tienda</p>

      <div style={S.grid}>
        {/* PANEL IZQUIERDO: Crear descuento */}
        <div style={S.card}>
          <h2 style={{ fontSize: "1rem", color: "#4A5D3A", margin: "0 0 1.25rem", fontWeight: 600 }}>
            Nuevo descuento
          </h2>

          {/* Alcance */}
          <label style={S.label}>Aplica a</label>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            {(["all", "category", "products"] as const).map(s => (
              <button key={s} style={S.scopeBtn(scope === s)} onClick={() => setScope(s)}>
                {s === "all" ? "Toda la tienda" : s === "category" ? "Categoria" : "Productos especificos"}
              </button>
            ))}
          </div>

          {scope === "category" && (
            <div style={{ marginBottom: "1rem" }}>
              <label style={S.label}>Categoria</label>
              <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)} style={S.input}>
                <option value="">Seleccionar...</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {scope === "products" && (
            <div style={{ marginBottom: "1rem" }}>
              <label style={S.label}>Buscar productos</label>
              <input
                style={{ ...S.input, marginBottom: "0.5rem" }}
                placeholder="Buscar por nombre o categoria..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div style={{ maxHeight: 220, overflowY: "auto", border: "1px solid #EDE3CD", borderRadius: 10 }}>
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    style={{
                      padding: "0.6rem 0.85rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      background: selectedIds.includes(p.id) ? "rgba(74,93,58,0.08)" : "transparent",
                      borderBottom: "1px solid #F7F1E5",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 500, color: "#2C3A22" }}>
                        {selectedIds.includes(p.id) ? "✓ " : ""}{p.name.substring(0, 40)}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.72rem", color: "#4A4F45" }}>
                        {fmt(p.price)} · {p.category} · Stock: {p.stock}
                      </p>
                    </div>
                    {discValue > 0 && selectedIds.includes(p.id) && (
                      <span style={{ fontSize: "0.75rem", color: "#C97B5C", fontWeight: 600 }}>
                        {fmt(previewPrice(p.price))}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {selectedIds.length > 0 && (
                <p style={{ fontSize: "0.75rem", color: "#4A5D3A", margin: "0.4rem 0 0", fontWeight: 600 }}>
                  {selectedIds.length} producto(s) seleccionado(s)
                </p>
              )}
            </div>
          )}

          {/* Tipo de descuento */}
          <label style={S.label}>Tipo de descuento</label>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <button style={S.typeBtn(discType === "percentage")} onClick={() => setDiscType("percentage")}>% Porcentaje</button>
            <button style={S.typeBtn(discType === "fixed")} onClick={() => setDiscType("fixed")}>$ Valor fijo</button>
          </div>

          {/* Valor */}
          <label style={S.label}>{discType === "percentage" ? "Porcentaje de descuento" : "Valor a descontar"}</label>
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <input
              type="number"
              min={1}
              max={discType === "percentage" ? 90 : 500000}
              value={discValue}
              onChange={e => setDiscValue(Number(e.target.value))}
              style={{ ...S.input, paddingRight: "3rem" }}
            />
            <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#4A4F45", fontWeight: 600 }}>
              {discType === "percentage" ? "%" : "COP"}
            </span>
          </div>

          {/* Preview */}
          {discValue > 0 && scope !== "products" && (
            <div style={{ background: "rgba(74,93,58,0.06)", borderRadius: 10, padding: "0.75rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#4A5D3A" }}>
              Ejemplo: producto de $90.000 quedaria en{" "}
              <strong>{fmt(previewPrice(90000))}</strong>
            </div>
          )}

          {/* Label del descuento */}
          <label style={S.label}>Etiqueta visible (opcional)</label>
          <input
            style={{ ...S.input, marginBottom: "1rem" }}
            placeholder={`Ej: Promo fin de semana, ${discValue}% OFF`}
            value={discLabel}
            onChange={e => setDiscLabel(e.target.value)}
          />

          {/* Vencimiento */}
          <label style={S.label}>Vence el (opcional)</label>
          <input
            type="date"
            style={{ ...S.input, marginBottom: "1.25rem" }}
            value={expiresAt}
            onChange={e => setExpiresAt(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />

          <button style={S.btn} onClick={saveRule} disabled={saving}>
            {saving ? "Guardando..." : "Activar descuento"}
          </button>
        </div>

        {/* PANEL DERECHO: Descuentos activos */}
        <div>
          <h2 style={{ fontSize: "1rem", color: "#4A5D3A", margin: "0 0 1rem", fontWeight: 600 }}>
            Descuentos activos ({rules.filter(r => r.active).length})
          </h2>

          {rules.length === 0 ? (
            <div style={{ ...S.card, textAlign: "center", padding: "3rem 1rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🏷️</div>
              <p style={{ color: "#4A4F45", fontSize: "0.9rem", margin: 0 }}>No hay descuentos creados</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {rules.map(r => {
                const isExpired = r.expiresAt && new Date(r.expiresAt) < new Date();
                return (
                  <div key={r.id} style={{
                    ...S.card,
                    padding: "1rem",
                    borderLeft: `4px solid ${r.active && !isExpired ? "#4A5D3A" : "#EDE3CD"}`,
                    opacity: isExpired ? 0.6 : 1,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                          <span style={{ fontWeight: 700, color: "#4A5D3A", fontSize: "1rem" }}>
                            {r.type === "percentage" ? `${r.value}%` : fmt(r.value)} OFF
                          </span>
                          {isExpired && (
                            <span style={{ fontSize: "0.65rem", background: "#C9533D20", color: "#C9533D", padding: "0.15rem 0.5rem", borderRadius: 100, fontWeight: 600 }}>
                              VENCIDO
                            </span>
                          )}
                          {r.active && !isExpired && (
                            <span style={{ fontSize: "0.65rem", background: "rgba(74,93,58,0.1)", color: "#4A5D3A", padding: "0.15rem 0.5rem", borderRadius: 100, fontWeight: 600 }}>
                              ACTIVO
                            </span>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: "0.78rem", color: "#4A4F45" }}>
                          {r.label}
                        </p>
                        <p style={{ margin: "0.2rem 0 0", fontSize: "0.72rem", color: "#6B7B4F" }}>
                          {r.productIds === "all" ? "Toda la tienda" :
                            r.category ? `Categoria: ${r.category}` :
                              `${(r.productIds as number[]).length} producto(s)`}
                          {r.expiresAt && ` · Vence: ${new Date(r.expiresAt).toLocaleDateString("es-CO")}`}
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                        {/* Toggle activo/inactivo */}
                        <button
                          onClick={() => toggleRule(r.id, !r.active)}
                          style={{
                            width: 44, height: 24, borderRadius: 100, border: "none",
                            background: r.active ? "#4A5D3A" : "#EDE3CD",
                            cursor: "pointer", position: "relative", transition: "background 0.2s",
                          }}
                          title={r.active ? "Desactivar" : "Activar"}
                        >
                          <span style={{
                            position: "absolute",
                            top: 2, left: r.active ? 22 : 2,
                            width: 20, height: 20,
                            background: "#fff",
                            borderRadius: "50%",
                            transition: "left 0.2s",
                          }} />
                        </button>
                        <button
                          onClick={() => deleteRule(r.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#C9533D", fontSize: "1.1rem", padding: "0.2rem" }}
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
DISC_EOF
log "Pagina admin/discounts creada"

# ============================================================
# 4) API: DESCUENTOS (in-memory simple, sin nueva tabla DB)
# ============================================================
title "Creando API admin/discounts"

mkdir -p app/api/admin/discounts/\[id\]

cat > app/api/admin/discounts/route.ts << 'APILIST_EOF'
import { NextRequest, NextResponse } from "next/server";
import { validateAdminToken } from "@/lib/admin-auth";
import { randomUUID } from "crypto";

// In-memory store (se resetea con deploys — reemplazar con DB luego si se necesita persistencia)
const rules: Map<string, object> = new Map();

function auth(req: NextRequest) {
  return validateAdminToken(req.headers.get("x-admin-token"));
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ rules: [...rules.values()] });
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const id = randomUUID();
  const rule = { ...body, id, createdAt: new Date().toISOString() };
  rules.set(id, rule);
  return NextResponse.json({ rule });
}
APILIST_EOF

cat > "app/api/admin/discounts/[id]/route.ts" << 'APIID_EOF'
import { NextRequest, NextResponse } from "next/server";
import { validateAdminToken } from "@/lib/admin-auth";

declare const rules: Map<string, object>;

function auth(req: NextRequest) {
  return validateAdminToken(req.headers.get("x-admin-token"));
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const existing = (rules as Map<string, Record<string, unknown>>).get(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated = { ...existing, ...body };
  (rules as Map<string, Record<string, unknown>>).set(id, updated);
  return NextResponse.json({ rule: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  (rules as Map<string, unknown>).delete(id);
  return NextResponse.json({ ok: true });
}
APIID_EOF
log "APIs de descuentos creadas"

# ============================================================
# 5) AGREGAR LINK EN SIDEBAR DE ADMIN
# ============================================================
title "Agregando Descuentos al menu admin"
python3 << 'PYEOF'
with open('app/admin/layout.tsx', 'r') as f:
    c = f.read()

old = '  { href: "/admin/coupons", label: "Cupones", icon: "🎟️" },'
new = '  { href: "/admin/coupons", label: "Cupones", icon: "🎟️" },\n  { href: "/admin/discounts", label: "Descuentos", icon: "🏷️" },'

if '/admin/discounts' not in c:
    c = c.replace(old, new)
    with open('app/admin/layout.tsx', 'w') as f:
        f.write(c)
    print("Link agregado al sidebar")
else:
    print("Ya estaba")
PYEOF
log "Sidebar actualizado"

echo ""
echo "==================================="
echo "Listo. Verificando build..."
npm run build 2>&1 | grep -E "error|warning|Compiled|Failed|Route" | head -20
echo ""
echo "Si el build paso:"
echo "git add . && git commit -m 'feat: descuentos admin + robots + fix duplicado' && git push"
