"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cloudinaryLoader } from "@/lib/image";

type Banner = {
  id: number;
  imageUrl: string;
  title?: string | null;
  subtitle?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  alt?: string | null;
  active?: boolean;
  order?: number;
};

const AUTOPLAY_MS = 5500;

export default function HeroCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/banners", { cache: "no-store" })
      .then(r => r.ok ? r.json() : [])
      .then((data: Banner[]) => {
        if (cancelled) return;
        setBanners(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, []);

  const start = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (banners.length <= 1) return;
    timer.current = setTimeout(() => setIdx(i => (i + 1) % banners.length), AUTOPLAY_MS);
  }, [banners.length]);

  useEffect(() => {
    start();
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [idx, start]);

  const go = (i: number) => {
    if (banners.length === 0) return;
    setIdx(((i % banners.length) + banners.length) % banners.length);
  };

  if (!loaded || banners.length === 0) return null;

  return (
    <section
      aria-label="Banners principales"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "#F7F1E5",
        maxWidth: "100%",
        margin: 0,
      }}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchX.current === null) return;
        const d = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(d) > 50) go(idx + (d > 0 ? -1 : 1));
        touchX.current = null;
      }}
    >
      <div style={{
        display: "flex",
        transform: `translateX(-${idx * 100}%)`,
        transition: "transform 700ms cubic-bezier(0.65,0,0.35,1)",
      }}>
        {banners.map((b, i) => (
          <div key={b.id} style={{
            minWidth: "100%",
            position: "relative",
            aspectRatio: "16/7",
            minHeight: 280,
          }}>
            <Image
              src={b.imageUrl}
              alt={b.alt || b.title || "Banner"}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              loader={cloudinaryLoader}
              priority={i === 0}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            {(b.title || b.ctaText) && (
              <>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,.15) 55%,transparent 100%)",
                }} />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "clamp(1.5rem,5vw,4rem)",
                  maxWidth: "min(680px,92%)",
                }}>
                  {b.subtitle && (
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "#FDFAF3",
                      marginBottom: "1rem",
                    }}>{b.subtitle}</span>
                  )}
                  {b.title && (
                    <h2 style={{
                      fontFamily: "var(--font-fraunces),Georgia,serif",
                      fontSize: "clamp(1.6rem,4vw,3rem)",
                      color: "#FDFAF3",
                      fontWeight: 400,
                      lineHeight: 1.1,
                      margin: "0 0 1.25rem",
                      letterSpacing: "-0.02em",
                      textShadow: "0 2px 10px rgba(0,0,0,.25)",
                    }}>{b.title}</h2>
                  )}
                  {b.ctaText && b.ctaUrl && (
                    <Link href={b.ctaUrl} style={{
                      display: "inline-block",
                      alignSelf: "flex-start",
                      background: "#C97B5C",
                      color: "#FDFAF3",
                      padding: "0.85rem 1.85rem",
                      borderRadius: 999,
                      fontWeight: 500,
                      fontSize: "0.92rem",
                      textDecoration: "none",
                      boxShadow: "0 4px 16px rgba(0,0,0,.15)",
                    }}>{b.ctaText} →</Link>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={() => go(idx - 1)}
            aria-label="Anterior"
            style={{
              position: "absolute", left: "1rem", top: "50%",
              transform: "translateY(-50%)",
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(253,250,243,.9)", border: "none",
              color: "#4A5D3A", fontSize: "1.5rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,.15)",
            }}
          >‹</button>
          <button
            onClick={() => go(idx + 1)}
            aria-label="Siguiente"
            style={{
              position: "absolute", right: "1rem", top: "50%",
              transform: "translateY(-50%)",
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(253,250,243,.9)", border: "none",
              color: "#4A5D3A", fontSize: "1.5rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,.15)",
            }}
          >›</button>
          <div style={{
            position: "absolute", bottom: "1.25rem", left: "50%",
            transform: "translateX(-50%)",
            display: "flex", gap: "0.5rem",
            padding: "0.5rem 0.75rem",
            background: "rgba(0,0,0,.25)", borderRadius: 999,
          }}>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === idx ? 28 : 8,
                  height: 8, borderRadius: 999,
                  background: i === idx ? "#FDFAF3" : "rgba(253,250,243,.5)",
                  border: "none", cursor: "pointer",
                  transition: "all 300ms", padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
