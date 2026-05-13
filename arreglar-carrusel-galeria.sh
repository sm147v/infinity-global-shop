#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# 🔧 ARREGLOS - Carrusel full-width + galería tipo Amazon
# ═══════════════════════════════════════════════════════════════

set -e
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}🔧 Arreglando carrusel + galería...${NC}"
echo ""

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ No estás en el proyecto Infinity${NC}"
    exit 1
fi

# ─── 1. Carrusel FULL WIDTH (pegado a los bordes) ───
echo -e "${YELLOW}📝 Haciendo el carrusel full-width...${NC}"

# Cambiar maxWidth: 1280px por width 100%
sed -i '' 's|maxWidth: "1280px",|maxWidth: "100%",|g' components/HeroCarousel.tsx
# Asegurar que no tenga margin auto que lo limite
sed -i '' 's|margin: "0 auto",|margin: 0,|g' components/HeroCarousel.tsx

echo -e "${GREEN}✓ Carrusel ahora full-width${NC}"
echo ""

# ─── 2. Galería tipo Amazon (responsive: vertical en desktop, horizontal en mobile) ───
echo -e "${YELLOW}📝 Mejorando galería estilo Amazon...${NC}"

cat > components/product-gallery.tsx << 'EOF'
"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { cloudinaryLoader } from "@/lib/image";

interface Props {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: Props) {
  const validImages = images.filter(Boolean);
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const touchStartX = useRef<number | null>(null);

  const mainImage = validImages[activeIdx] || "";

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50 && validImages.length > 1) {
      if (diff > 0 && activeIdx > 0) setActiveIdx(activeIdx - 1);
      if (diff < 0 && activeIdx < validImages.length - 1) setActiveIdx(activeIdx + 1);
    }
    touchStartX.current = null;
  }

  return (
    <div className="gallery-container">
      {/* Thumbnails verticales (desktop) */}
      {validImages.length > 1 && (
        <div className="thumbs-vertical">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              aria-label={`Ver imagen ${i + 1}`}
              style={{
                width: 70,
                height: 70,
                borderRadius: 10,
                overflow: "hidden",
                border: i === activeIdx ? "2px solid #4A5D3A" : "1px solid #EDE3CD",
                padding: 0,
                cursor: "pointer",
                background: "#FDFAF3",
                opacity: i === activeIdx ? 1 : 0.65,
                transition: "all 0.2s",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Image
                src={img}
                alt={`Vista ${i + 1}`}
                fill
                sizes="70px"
                style={{ objectFit: "cover", objectPosition: "center" }}
                loader={cloudinaryLoader}
              />
            </button>
          ))}
        </div>
      )}

      {/* Imagen principal */}
      <div
        className="main-image-wrapper"
        onMouseEnter={() => setZoomActive(true)}
        onMouseLeave={() => setZoomActive(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          width: "100%",
          aspectRatio: "1",
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(135deg, #EDE3CD, #FDFAF3)",
          border: "1px solid rgba(74, 93, 58, 0.08)",
          position: "relative",
          cursor: zoomActive ? "zoom-in" : "default",
        }}
      >
        {mainImage ? (
          <Image
            src={mainImage}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              transform: zoomActive ? "scale(1.8)" : "scale(1)",
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              transition: "transform 0.3s ease",
            }}
            loader={cloudinaryLoader}
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#4A5D3A",
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontStyle: "italic",
            padding: "2rem",
            textAlign: "center",
          }}>
            {productName}
          </div>
        )}

        {/* Flechas (solo si hay más de 1) */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIdx(activeIdx === 0 ? validImages.length - 1 : activeIdx - 1); }}
              aria-label="Imagen anterior"
              className="gallery-arrow gallery-arrow-left"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIdx((activeIdx + 1) % validImages.length); }}
              aria-label="Imagen siguiente"
              className="gallery-arrow gallery-arrow-right"
            >
              ›
            </button>
            <div className="gallery-counter">
              {activeIdx + 1} / {validImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails horizontales (móvil) */}
      {validImages.length > 1 && (
        <div className="thumbs-horizontal">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              aria-label={`Ver imagen ${i + 1}`}
              style={{
                flexShrink: 0,
                width: 60,
                height: 60,
                borderRadius: 10,
                overflow: "hidden",
                border: i === activeIdx ? "2px solid #4A5D3A" : "1px solid #EDE3CD",
                padding: 0,
                cursor: "pointer",
                background: "#FDFAF3",
                opacity: i === activeIdx ? 1 : 0.65,
                transition: "all 0.2s",
                position: "relative",
              }}
            >
              <Image
                src={img}
                alt={`Vista ${i + 1}`}
                fill
                sizes="60px"
                style={{ objectFit: "cover", objectPosition: "center" }}
                loader={cloudinaryLoader}
              />
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .gallery-container {
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
        }

        .thumbs-vertical {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 600px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .thumbs-horizontal {
          display: none;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.4rem;
          margin-top: 0.5rem;
        }

        .main-image-wrapper {
          flex: 1;
          max-width: calc(100% - 80px);
        }

        .gallery-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(253, 250, 243, 0.9);
          border: none;
          color: #4A5D3A;
          font-size: 1.4rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
          z-index: 5;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .main-image-wrapper:hover .gallery-arrow {
          opacity: 1;
        }

        .gallery-arrow-left { left: 12px; }
        .gallery-arrow-right { right: 12px; }

        .gallery-counter {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(74, 93, 58, 0.85);
          color: #F7F1E5;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 4;
        }

        /* MÓVIL: thumbs abajo, no a la izquierda */
        @media (max-width: 768px) {
          .gallery-container {
            flex-direction: column;
          }
          .thumbs-vertical {
            display: none;
          }
          .thumbs-horizontal {
            display: flex;
          }
          .main-image-wrapper {
            max-width: 100%;
          }
          .gallery-arrow {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
EOF

echo -e "${GREEN}✓ Galería actualizada (estilo Amazon)${NC}"
echo ""

# ─── 3. Reportar sobre la sección del HERO viejo ───
echo -e "${YELLOW}📝 Sobre la sección 'Productos USA originales en Medellín'...${NC}"
echo ""
echo -e "   La sección que aparece DEBAJO del carrusel sigue siendo tu HERO original."
echo -e "   El carrusel se agregó ENCIMA, pero el HERO sigue ahí."
echo ""
echo -e "${YELLOW}   ¿Quieres que la quite o solo la reduzca? Decídelo y ejecuta UNO:${NC}"
echo ""
echo -e "${BLUE}   Opción A - Quitar HERO completo (solo queda el carrusel):${NC}"
echo -e "   Esto requiere editar app/page.tsx manualmente — te explico abajo"
echo ""
echo -e "${BLUE}   Opción B - Dejar el HERO pero más pequeño${NC}"
echo -e "   No requiere cambios, solo ajustar padding"
echo ""

echo -e "${GREEN}✅ Carrusel + galería ya están arreglados${NC}"
echo ""
echo -e "${YELLOW}Ahora prueba con:${NC}"
echo -e "   ${GREEN}npm run dev${NC}"
echo ""
echo -e "   Verás:"
echo -e "   ✅ Carrusel pegado a los bordes"
echo -e "   ✅ Galería de producto tipo Amazon (thumbs a la izquierda)"
echo -e "   ✅ Zoom al hover, swipe en móvil, flechas, contador"
echo ""
