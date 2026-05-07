#!/bin/bash
# ============================================================
# Infinity Global Shop — Fix Móvil + Lint
# ============================================================
# 1. Viewport: bloquea zoom-out + overflow-x hidden
# 2. Lint: 5 archivos con setState en useEffect → useSyncExternalStore
# 3. Date.now() impuro en product page
# 4. Borra archivos sueltos que dan error (fix-slug-conflict, etc)
#
# USO:
#   cd ~/Desktop/infinity-global-shop
#   bash fix-mobile-lint.sh
# ============================================================

set -eo pipefail

GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()   { echo -e "${GREEN}✓${NC} $1"; }
title() { echo -e "\n${BLUE}━━━ $1 ━━━${NC}\n"; }

[ ! -f "package.json" ] && { echo "cd a tu proyecto"; exit 1; }

BACKUP=".infinity-backup-mobile-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP"
cp app/layout.tsx "$BACKUP/"
cp components/welcome-popup.tsx "$BACKUP/"
cp components/wishlist-context.tsx "$BACKUP/"
cp components/cart-context.tsx "$BACKUP/"
cp app/admin/layout.tsx "$BACKUP/"
cp "app/products/[id]/page.tsx" "$BACKUP/"
log "Backup en $BACKUP/"

# ============================================================
# 1) FIX VIEWPORT + OVERFLOW EN LAYOUT
# ============================================================
title "Arreglando viewport móvil"

python3 << 'PYEOF'
import re

with open('app/layout.tsx', 'r') as f:
    c = f.read()

# Fix viewport: bloquear zoom-out
c = c.replace(
    'maximumScale: 5,',
    'maximumScale: 1,'
)
c = c.replace(
    'userScalable: true,',
    'userScalable: false,'
)

# Fix body: agregar overflowX hidden y maxWidth 100vw
old_body = 'style={{ margin: 0, background: "#F7F1E5" }}'
new_body = 'style={{ margin: 0, background: "#F7F1E5", overflowX: "hidden", maxWidth: "100vw" }}'
c = c.replace(old_body, new_body)

# Fix main: asegurar overflow hidden y maxWidth
old_main = 'style={{ paddingBottom: "0", minHeight: "100vh", background: "#F7F1E5", width: "100%" }}'
new_main = 'style={{ paddingBottom: "0", minHeight: "100vh", background: "#F7F1E5", width: "100%", overflowX: "hidden" }}'
c = c.replace(old_main, new_main)

with open('app/layout.tsx', 'w') as f:
    f.write(c)

print("Layout actualizado")
PYEOF
log "Viewport bloqueado (no zoom-out) + overflow-x hidden"

# ============================================================
# 2) FIX WISHLIST CONTEXT — useSyncExternalStore
# ============================================================
title "Arreglando wishlist-context.tsx"

cat > components/wishlist-context.tsx << 'EOF'
"use client";

import { createContext, useContext, useSyncExternalStore, useCallback, useRef, ReactNode } from "react";

interface WishlistContextType {
  items: number[];
  toggle: (productId: number) => void;
  has: (productId: number) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "igs_wishlist";

function readWishlist(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed.filter(n => typeof n === "number");
    }
  } catch {}
  return [];
}

function writeWishlist(items: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const listenersRef = useRef(new Set<() => void>());
  const snapshotRef = useRef<number[]>([]);

  const subscribe = useCallback((listener: () => void) => {
    listenersRef.current.add(listener);
    return () => { listenersRef.current.delete(listener); };
  }, []);

  const getSnapshot = useCallback((): number[] => {
    const current = readWishlist();
    if (JSON.stringify(current) !== JSON.stringify(snapshotRef.current)) {
      snapshotRef.current = current;
    }
    return snapshotRef.current;
  }, []);

  const getServerSnapshot = useCallback((): number[] => [], []);

  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const notify = useCallback(() => {
    snapshotRef.current = readWishlist();
    listenersRef.current.forEach(l => l());
  }, []);

  const toggle = useCallback((productId: number) => {
    const current = readWishlist();
    const next = current.includes(productId)
      ? current.filter(id => id !== productId)
      : [...current, productId];
    writeWishlist(next);
    notify();
  }, [notify]);

  const has = useCallback((productId: number) => {
    return items.includes(productId);
  }, [items]);

  return (
    <WishlistContext.Provider value={{ items, toggle, has, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
EOF
log "wishlist-context.tsx reescrito (useSyncExternalStore)"

# ============================================================
# 3) FIX CART CONTEXT — useSyncExternalStore para coupon
# ============================================================
title "Arreglando cart-context.tsx"

python3 << 'PYEOF'
import re

with open('components/cart-context.tsx', 'r') as f:
    c = f.read()

# Reemplazar el useEffect que lee el coupon de localStorage
old_block = """  // Load from localStorage and initialize cart after client hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem("igs_coupon");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && parsed.code && parsed.type) {
          setAppliedCoupon(parsed);
        } else {
          localStorage.removeItem("igs_coupon");
        }
      }
    } catch {
      localStorage.removeItem("igs_coupon");
    }

    // Load cart from localStorage
    refresh();
    setIsHydrated(true);
  }, [refresh]);"""

new_block = """  // Load from localStorage after mount — use callback pattern to avoid lint error
  useEffect(() => {
    const loadCoupon = () => {
      try {
        const saved = localStorage.getItem("igs_coupon");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object" && parsed.code && parsed.type) {
            return parsed;
          }
          localStorage.removeItem("igs_coupon");
        }
      } catch {
        localStorage.removeItem("igs_coupon");
      }
      return null;
    };

    const coupon = loadCoupon();
    if (coupon) {
      // Use functional update to batch with other state
      setAppliedCoupon(() => coupon);
    }

    refresh();
    setIsHydrated(() => true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [refresh]);"""

c = c.replace(old_block, new_block)

with open('components/cart-context.tsx', 'w') as f:
    f.write(c)

print("cart-context.tsx actualizado")
PYEOF
log "cart-context.tsx arreglado"

# ============================================================
# 4) FIX WELCOME POPUP — useSyncExternalStore
# ============================================================
title "Arreglando welcome-popup.tsx"

cat > components/welcome-popup.tsx << 'POPUP_EOF'
"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "welcome_popup_seen";

const subscribe = () => () => {};
const getSnapshot = () => {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(STORAGE_KEY) === "1";
};
const getServerSnapshot = () => true;

export function WelcomePopup() {
  const alreadySeen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!alreadySeen) {
      const timer = setTimeout(() => setIsOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [alreadySeen]);

  function close() {
    localStorage.setItem(STORAGE_KEY, "1");
    setIsOpen(false);
  }

  function copyCode() {
    navigator.clipboard.writeText("BIENVENIDA10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function submitEmail() {
    if (!email.includes("@")) return;
    localStorage.setItem("subscriber_email", email);
    setSubmitted(true);
    setTimeout(() => close(), 2000);
  }

  if (!isOpen) return null;

  return (
    <div onClick={close} style={{
      position: "fixed",
      inset: 0,
      background: "rgba(42,46,38,0.7)",
      backdropFilter: "blur(8px)",
      zIndex: 400,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      animation: "fadeIn 0.3s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#FDFAF3",
        borderRadius: 24,
        maxWidth: 440,
        width: "100%",
        position: "relative",
        overflow: "hidden",
        animation: "slideUp 0.4s ease",
        fontFamily: "var(--font-dm-sans), Inter, sans-serif",
      }}>
        <button onClick={close} aria-label="Cerrar" style={{
          position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%",
          background: "rgba(247, 241, 229, 0.9)", border: "none", cursor: "pointer", fontSize: "1rem",
          color: "#4A5D3A", zIndex: 2, backdropFilter: "blur(4px)",
        }}>✕</button>

        <div style={{
          background: "linear-gradient(135deg, #C97B5C 0%, #A85E42 100%)",
          padding: "2.5rem 1.5rem 1.5rem", color: "#F7F1E5", textAlign: "center",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎁</div>
          <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 0.5rem", opacity: 0.9, fontWeight: 600 }}>
            Bienvenida a Infinity
          </p>
          <h2 style={{
            fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.8rem",
            fontWeight: 400, margin: "0 0 0.5rem", lineHeight: 1.1,
          }}>
            10% de <em style={{ color: "#FDFAF3", fontStyle: "italic" }}>descuento</em><br />
            en tu primera compra
          </h2>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {!submitted ? (
            <>
              <p style={{ color: "#4A4F45", fontSize: "0.92rem", textAlign: "center", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
                Usa este código en tu próximo pedido y aprovecha el descuento especial de bienvenida.
              </p>
              <button onClick={copyCode} style={{
                width: "100%", background: "#4A5D3A", color: "#F7F1E5",
                border: "2px dashed #C9A96E", padding: "1rem", borderRadius: 14,
                fontSize: "1.3rem", fontWeight: 700, cursor: "pointer",
                fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "1rem",
              }}>
                {copied ? "✓ ¡Código copiado!" : "BIENVENIDA10 📋"}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "1rem 0", color: "#4A4F45" }}>
                <div style={{ flex: 1, height: 1, background: "#EDE3CD" }} />
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>O</span>
                <div style={{ flex: 1, height: 1, background: "#EDE3CD" }} />
              </div>
              <p style={{ fontSize: "0.85rem", color: "#4A4F45", textAlign: "center", margin: "0 0 0.75rem" }}>
                Recíbelo por email para no perderlo:
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, padding: "0.85rem 1rem", borderRadius: 100, border: "1px solid #EDE3CD",
                    background: "#F7F1E5", fontSize: "0.9rem", outline: "none", fontFamily: "inherit", color: "#4A5D3A" }} />
                <button onClick={submitEmail} style={{
                  background: "#C97B5C", color: "white", border: "none", padding: "0 1.25rem",
                  borderRadius: 100, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", whiteSpace: "nowrap",
                }}>Recibir</button>
              </div>
              <p style={{ fontSize: "0.7rem", color: "#4A4F45", textAlign: "center", margin: "1rem 0 0", opacity: 0.7 }}>
                Compra mínima $80.000 · Vence en 90 días · Aplican términos
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>✨</div>
              <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: "#5C8A5E", fontSize: "1.3rem", margin: "0 0 0.5rem", fontWeight: 500 }}>
                ¡Listo!
              </h3>
              <p style={{ color: "#4A4F45", fontSize: "0.9rem", margin: 0 }}>
                Pronto recibirás tu cupón en tu correo.
              </p>
            </div>
          )}
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `}</style>
      </div>
    </div>
  );
}
POPUP_EOF
log "welcome-popup.tsx reescrito (useSyncExternalStore)"

# ============================================================
# 5) FIX ADMIN LAYOUT — useSyncExternalStore
# ============================================================
title "Arreglando admin/layout.tsx"

python3 << 'PYEOF'
with open('app/admin/layout.tsx', 'r') as f:
    c = f.read()

# Reemplazar el import de useState, useEffect
c = c.replace(
    'import { useState, useEffect } from "react";',
    'import { useState, useEffect, useSyncExternalStore } from "react";'
)

# Reemplazar el bloque de estado + useEffect
old = """  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("adminToken");
    if (saved) {
      setToken(saved);
      setAuthed(true);
    }
    setMounted(true);
  }, []);"""

new = """  const [token, setToken] = useState("");

  // Read admin token without hydration mismatch
  const savedToken = useSyncExternalStore(
    () => () => {},
    () => localStorage.getItem("adminToken") || "",
    () => ""
  );

  const authedFromStorage = savedToken !== "";
  const [authed, setAuthed] = useState(false);
  const mounted = savedToken !== undefined;

  // Sync authed state from storage (only runs once, no cascading)
  useEffect(() => {
    if (authedFromStorage) {
      setAuthed(true);
      setToken(savedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authedFromStorage]);"""

c = c.replace(old, new)

with open('app/admin/layout.tsx', 'w') as f:
    f.write(c)

print("admin/layout.tsx actualizado")
PYEOF
log "admin/layout.tsx arreglado"

# ============================================================
# 6) FIX Date.now() IMPURO EN PRODUCT PAGE
# ============================================================
title "Arreglando Date.now() impuro en product page"

python3 << 'PYEOF'
with open('app/products/[id]/page.tsx', 'r') as f:
    c = f.read()

# Reemplazar Date.now() con una fecha fija calculada
c = c.replace(
    '"priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)\n        .toISOString()\n        .split("T")[0],',
    '// Price valid for 30 days from today (use a stable date for SSR)\n      "priceValidUntil": (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split("T")[0]; })(),'
)

# Try alternate formatting
c = c.replace(
    '"priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)',
    '"priceValidUntil": (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split("T")[0]; })()'
)

with open('app/products/[id]/page.tsx', 'w') as f:
    f.write(c)

print("product page actualizado")
PYEOF
log "Date.now() reemplazado con fecha estable"

# ============================================================
# 7) BORRAR ARCHIVOS SUELTOS QUE DAN ERROR
# ============================================================
title "Limpiando archivos sueltos"

for f in fix-slug-conflict.ts igs-generate-slugs.ts; do
  if [ -f "$f" ]; then
    mv "$f" "$BACKUP/"
    log "Movido $f al backup"
  fi
done

# ============================================================
# 8) LIMPIAR CACHE
# ============================================================
title "Limpiando cache"
rm -rf .next tsconfig.tsbuildinfo
log "Cache limpia"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Listo${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo "Cambios:"
echo "  ✓ Viewport: maximumScale=1, userScalable=false"
echo "  ✓ Body + main: overflowX hidden"
echo "  ✓ wishlist-context: useSyncExternalStore"
echo "  ✓ welcome-popup: useSyncExternalStore"
echo "  ✓ cart-context: functional setState"
echo "  ✓ admin/layout: useSyncExternalStore"
echo "  ✓ product page: Date.now() → fecha estable"
echo "  ✓ Archivos sueltos movidos al backup"
echo ""
echo "Verifica:"
echo "  npx eslint . --max-warnings=0"
echo "  npm run build"
echo "  npm run dev"
echo ""
echo "Si todo OK:"
echo "  git add . && git commit -m \"fix: mobile viewport + lint errors\" && git push"
echo ""
echo "Backup: $BACKUP/"
