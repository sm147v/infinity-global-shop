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
