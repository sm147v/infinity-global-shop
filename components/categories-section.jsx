"use client";

import Link from "next/link";
import { Pill, Sparkles, Scissors, Heart } from "lucide-react";

const categories = [
  { icon: Pill, name: "Vitaminas", desc: "Nature's Bounty, GNC, Spring Valley", href: "/products?category=Vitaminas", accent: "#4A5D3A" },
  { icon: Sparkles, name: "Belleza", desc: "Cuidado facial y corporal", href: "/products?category=Belleza", accent: "#C97B5C" },
  { icon: Scissors, name: "Cabello", desc: "Tratamientos y crecimiento", href: "/products?category=Cabello", accent: "#8B7140" },
  { icon: Heart, name: "Salud diaria", desc: "Suplementos y bienestar", href: "/products?category=Salud", accent: "#A85E42" },
];

export function CategoriesSection() {
  return (
    <section style={{ padding: "3rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C97B5C", marginBottom: "0.5rem", display: "block" }}>
          — Curado por categorías
        </span>
        <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(1.85rem, 4vw, 2.6rem)", fontWeight: 400, lineHeight: 1.1, color: "#4A5D3A", letterSpacing: "-0.02em" }}>
          Encuentra lo que <em style={{ fontStyle: "italic", fontWeight: 300, color: "#C97B5C" }}>tu cuerpo pide</em>
        </h2>
      </div>

      <div className="categories-grid">
        {categories.map(({ icon: Icon, name, desc, href, accent }) => (
          <Link key={name} href={href} className="category-card" style={{ "--accent": accent }}>
            <div className="category-icon-wrap">
              <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.2rem", fontWeight: 500, color: "#4A5D3A", margin: "0 0 0.3rem" }}>{name}</h3>
            <p style={{ fontSize: "0.82rem", color: "#4A4F45", margin: 0, lineHeight: 1.4 }}>{desc}</p>
            <span className="category-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>

      <style>{`
        .categories-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
        @media (min-width: 1024px) {
          .categories-grid { grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
        }
        .category-card {
          position: relative; display: block; padding: 1.5rem 1.25rem;
          background: #FDFAF3; border: 1px solid rgba(74, 93, 58, 0.1);
          border-radius: 16px; text-decoration: none;
          transition: all 0.3s ease; overflow: hidden;
        }
        .category-card:hover {
          background: #fff; border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(74, 93, 58, 0.08);
        }
        .category-icon-wrap {
          width: 52px; height: 52px; border-radius: 50%;
          background: color-mix(in srgb, var(--accent) 12%, transparent);
          color: var(--accent);
          display: inline-flex; align-items: center; justify-content: center;
          margin-bottom: 0.85rem; transition: transform 0.3s ease;
        }
        .category-card:hover .category-icon-wrap { transform: scale(1.08); }
        .category-arrow {
          position: absolute; bottom: 1.25rem; right: 1.25rem;
          color: var(--accent); opacity: 0; transform: translateX(-4px);
          transition: all 0.3s ease; font-size: 1.1rem;
        }
        .category-card:hover .category-arrow { opacity: 1; transform: translateX(0); }
      `}</style>
    </section>
  );
}
