"use client";

import { useState } from "react";
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

  const mainImage = validImages[activeIdx] || "";

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  return (
    <div>
      <div
        onMouseEnter={() => setZoomActive(true)}
        onMouseLeave={() => setZoomActive(false)}
        onMouseMove={handleMouseMove}
        style={{
          width: "100%",
          aspectRatio: "1",
          borderRadius: 24,
          overflow: "hidden",
          background: "linear-gradient(135deg, #EDE3CD, #FDFAF3)",
          border: "1px solid rgba(74, 93, 58, 0.08)",
          marginBottom: validImages.length > 1 ? "0.85rem" : 0,
          position: "relative",
          cursor: zoomActive ? "zoom-in" : "default",
        }}
      >
        {mainImage ? (
          <Image
            src={mainImage}
            alt={productName}
            fill
            sizes="(max-width: 640px) 100vw, 600px"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              transform: zoomActive ? "scale(1.8)" : "scale(1)",
              transformOrigin: zoomPos.x + "% " + zoomPos.y + "%",
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
      </div>

      {validImages.length > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.4rem" }}>
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                flexShrink: 0,
                width: 70,
                height: 70,
                borderRadius: 12,
                overflow: "hidden",
                border: i === activeIdx ? "2px solid #4A5D3A" : "1px solid #EDE3CD",
                padding: 0,
                cursor: "pointer",
                background: "#FDFAF3",
                opacity: i === activeIdx ? 1 : 0.7,
                transition: "all 0.2s",
              }}
            >
              <Image
                src={img}
                alt={"Vista " + (i + 1)}
                fill
                sizes="70px"
                style={{ objectFit: "cover", objectPosition: "center" }}
                loader={cloudinaryLoader}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
