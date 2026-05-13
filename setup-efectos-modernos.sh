#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# ✨ EFECTOS MODERNOS - Tilt 3D, Scroll Reveal, Parallax
# ═══════════════════════════════════════════════════════════════
# Mejoras visuales premium sin librerías externas
# Cero impacto en velocidad - solo CSS + JS nativo
# ═══════════════════════════════════════════════════════════════

set -e
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  ✨ Setup Efectos Modernos                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ No estás en el proyecto${NC}"
    exit 1
fi

mkdir -p components

# ─── 1. Componente TiltCard (wrapper que agrega efecto 3D) ───
echo -e "${YELLOW}📝 Creando TiltCard (efecto 3D en hover)...${NC}"

cat > components/TiltCard.tsx << 'EOF'
"use client";
import { useRef } from "react";

/**
 * TiltCard - Wrapper que agrega efecto 3D sutil al hover.
 * Inspirado en las tarjetas de productos de Apple.
 * Solo se activa en desktop (no en touch).
 */
export function TiltCard({ children, intensity = 8 }: { children: React.ReactNode; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    // No tilt en mobile
    if (window.matchMedia("(hover: none)").matches) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -intensity;
    const ry = ((x - cx) / cx) * intensity;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
EOF
echo -e "${GREEN}✓ TiltCard creado${NC}"

# ─── 2. Componente ScrollReveal (fade-in al hacer scroll) ───
echo -e "${YELLOW}📝 Creando ScrollReveal (fade-in al scroll)...${NC}"

cat > components/ScrollReveal.tsx << 'EOF'
"use client";
import { useEffect, useRef, useState } from "react";

/**
 * ScrollReveal - Wrapper que hace fade-in suave cuando el elemento
 * entra en el viewport. Usa IntersectionObserver (nativo, 0 KB).
 */
export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const transforms = {
    up: "translateY(30px)",
    down: "translateY(-30px)",
    left: "translateX(30px)",
    right: "translateX(-30px)",
    scale: "scale(0.95)",
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[direction],
        transition: "opacity 700ms cubic-bezier(0.25, 0.1, 0.25, 1), transform 700ms cubic-bezier(0.25, 0.1, 0.25, 1)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
EOF
echo -e "${GREEN}✓ ScrollReveal creado${NC}"

# ─── 3. Componente ParallaxHero (efecto parallax en HERO) ───
echo -e "${YELLOW}📝 Creando ParallaxHero (parallax suave)...${NC}"

cat > components/ParallaxHero.tsx << 'EOF'
"use client";
import { useEffect, useRef } from "react";

/**
 * ParallaxHero - Aplica un efecto parallax sutil al hacer scroll.
 * Las formas del HERO se mueven a diferentes velocidades creando profundidad.
 */
export function ParallaxHero({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Desactivar en mobile y en usuarios que prefieren reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 1024) return;

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = el!.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) {
            ticking = false;
            return;
          }
          const scrolled = -rect.top * 0.15;
          const shapes = el!.querySelectorAll("[data-parallax]");
          shapes.forEach((shape, i) => {
            const speed = 1 + i * 0.2;
            (shape as HTMLElement).style.transform = `translateY(${scrolled * speed * 0.3}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div ref={ref}>{children}</div>;
}
EOF
echo -e "${GREEN}✓ ParallaxHero creado${NC}"

# ─── 4. Estilos globales con smooth scroll + animaciones ───
echo -e "${YELLOW}📝 Agregando estilos globales modernos...${NC}"

# Verificar si existe globals.css
GLOBALS_FILE=""
if [ -f "app/globals.css" ]; then
    GLOBALS_FILE="app/globals.css"
elif [ -f "styles/globals.css" ]; then
    GLOBALS_FILE="styles/globals.css"
fi

if [ -n "$GLOBALS_FILE" ]; then
    if grep -q "MODERN-EFFECTS-START" "$GLOBALS_FILE"; then
        echo -e "${GREEN}✓ Estilos modernos ya estaban${NC}"
    else
        cat >> "$GLOBALS_FILE" << 'EOF'

/* ═══════════════════════════════════════════════ */
/* MODERN-EFFECTS-START                            */
/* Efectos visuales modernos sin librerías        */
/* ═══════════════════════════════════════════════ */

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Animación fade-in al cargar */
@keyframes modernFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.modern-fade-in {
  animation: modernFadeIn 800ms cubic-bezier(0.25, 0.1, 0.25, 1) both;
}

/* Glow effect en botones primarios al hover */
.glow-on-hover {
  position: relative;
  overflow: hidden;
}

.glow-on-hover::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.glow-on-hover:hover::before {
  left: 100%;
}

/* Float animation para hero shapes */
@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.float-shape {
  animation: floatY 6s ease-in-out infinite;
  will-change: transform;
}

.float-shape-delay {
  animation: floatY 7s ease-in-out infinite;
  animation-delay: -2s;
  will-change: transform;
}

/* MODERN-EFFECTS-END */
EOF
        echo -e "${GREEN}✓ Estilos agregados a ${GLOBALS_FILE}${NC}"
    fi
else
    echo -e "${YELLOW}⚠ No encontré globals.css, salteando estilos${NC}"
fi
echo ""

# ─── 5. Aplicar TiltCard al HomeProductCard sin tocarlo ───
echo -e "${YELLOW}🎨 Aplicando efecto tilt 3D a tarjetas de producto...${NC}"

# Hacemos un wrapper en la home en vez de tocar el card
# Esto se hace modificando app/page.tsx para envolver los productos
if grep -q "TiltCard" app/page.tsx; then
    echo -e "${GREEN}✓ TiltCard ya aplicado${NC}"
else
    # Agregar imports al inicio
    sed -i '' '1s|^|import { TiltCard } from "@/components/TiltCard";\nimport { ScrollReveal } from "@/components/ScrollReveal";\n|' app/page.tsx
    echo -e "${GREEN}✓ Imports agregados${NC}"

    # Envolver HomeProductCard con TiltCard
    # Buscar y reemplazar los HomeProductCard
    perl -i -pe 's|<HomeProductCard key=\{p\.id\}|<TiltCard key={p.id}><HomeProductCard|g; s|stock: p\.stock, slug: p\.slug \}\} />|stock: p.stock, slug: p.slug }} /></TiltCard>|g' app/page.tsx

    echo -e "${GREEN}✓ Productos envueltos con TiltCard${NC}"
fi
echo ""

# ─── Resumen ───
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ TODO LISTO                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Efectos agregados:${NC}"
echo -e "  ✨ ${BLUE}Tilt 3D${NC} en tarjetas de productos (hover)"
echo -e "  ✨ ${BLUE}Scroll reveal${NC} (componente listo para usar)"
echo -e "  ✨ ${BLUE}Parallax${NC} (componente listo para usar)"
echo -e "  ✨ ${BLUE}Smooth scroll${NC} global"
echo -e "  ✨ ${BLUE}Glow on hover${NC} en botones (clase .glow-on-hover)"
echo -e "  ✨ ${BLUE}Float animation${NC} para hero shapes (clase .float-shape)"
echo ""
echo -e "${YELLOW}Ahora corre:${NC}"
echo -e "  ${GREEN}npm run dev${NC}"
echo ""
echo -e "${YELLOW}Si todo bien:${NC}"
echo -e "  ${GREEN}git add .${NC}"
echo -e "  ${GREEN}git commit -m \"feat: efectos visuales modernos (tilt, scroll reveal, parallax)\"${NC}"
echo -e "  ${GREEN}git push${NC}"
echo ""
echo -e "${BLUE}━━━ Cómo usar los nuevos componentes ━━━${NC}"
echo ""
echo -e "${YELLOW}Envolver cualquier sección con scroll reveal:${NC}"
echo -e '   <ScrollReveal delay={100} direction="up">'
echo -e '     <tu contenido />'
echo -e '   </ScrollReveal>'
echo ""
echo -e "${YELLOW}Agregar glow a botones existentes:${NC}"
echo -e '   <Link className="glow-on-hover" ... >'
echo ""
echo -e "${YELLOW}Agregar float a formas del HERO:${NC}"
echo -e '   <div className="float-shape" ...>'
echo -e '   <div className="float-shape-delay" ...>'
echo ""
