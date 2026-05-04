"use client";

import { useWishlist } from "./wishlist-context";

export function WishlistButton({ productId, size = 36 }: { productId: number; size?: number }) {
  const { toggle, has } = useWishlist();
  const isFav = has(productId);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(productId); }}
      aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(253, 250, 243, 0.95)",
        border: "1px solid rgba(74, 93, 58, 0.1)",
        backdropFilter: "blur(8px)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        transition: "transform 0.2s",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill={isFav ? "#C97B5C" : "none"}
        stroke={isFav ? "#C97B5C" : "#4A5D3A"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "all 0.2s" }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
}
