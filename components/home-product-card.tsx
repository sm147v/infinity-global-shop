"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "./cart-context";
import { WishlistButton } from "./wishlist-button";
import { cloudinaryLoader } from "@/lib/image";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  slug?: string | null;
}

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");

export function HomeProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQty } = useCart();
  const inCart = items.find(item => item.id === product.id);
  const qty = inCart?.quantity ?? 0;

  return (
    <div style={{
      background: "#FDFAF3",
      borderRadius: 18,
      padding: "0.65rem",
      border: "1px solid rgba(74, 93, 58, 0.08)",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ position: "relative", marginBottom: "0.6rem" }}>
        {product.stock > 0 && product.stock <= 5 && (
          <span style={{
            position: "absolute",
            top: 8, left: 8,
            background: "#C9533D",
            color: "white",
            fontSize: "0.62rem",
            fontWeight: 700,
            padding: "0.25rem 0.55rem",
            borderRadius: 100,
            zIndex: 2,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}>
            ¡Solo {product.stock}!
          </span>
        )}
        {product.stock === 0 && (
          <span style={{
            position: "absolute",
            top: 8, left: 8,
            background: "#4A4F45",
            color: "white",
            fontSize: "0.62rem",
            fontWeight: 700,
            padding: "0.25rem 0.55rem",
            borderRadius: 100,
            zIndex: 2,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            Agotado
          </span>
        )}
        <div style={{ position: "absolute", top: 6, right: 6, zIndex: 2 }}>
          <WishlistButton productId={product.id} size={32} />
        </div>
      <Link href={"/products/" + (product.slug || product.id)} style={{ textDecoration: "none", color: "inherit" }} prefetch={false}>
        <div style={{
          width: "100%",
          aspectRatio: "1",
          borderRadius: 12,
          overflow: "hidden",
          background: "linear-gradient(135deg, #EDE3CD 0%, #A8B584 100%)",
          cursor: "pointer",
          position: "relative",
        }}>
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              loader={cloudinaryLoader}
            />
          )}
        </div>

        <div style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: "0.88rem",
          fontWeight: 500,
          lineHeight: 1.2,
          color: "#4A5D3A",
          marginBottom: "0.4rem",
          minHeight: "2.1rem",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {product.name}
        </div>

        <div style={{
          fontSize: "0.98rem",
          fontWeight: 700,
          color: "#2A2E26",
          marginBottom: "0.5rem",
        }}>
          {fmt(product.price)}
        </div>
      </Link>
      </div>

      <div style={{ marginTop: "auto" }}>
        {qty === 0 ? (
          <button
            onClick={() => addItem(product)}
            style={{
              width: "100%",
              background: "#4A5D3A",
              color: "#F7F1E5",
              border: "none",
              padding: "0.65rem",
              borderRadius: 100,
              fontSize: "0.78rem",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              fontFamily: "inherit",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Agregar
          </button>
        ) : (
          <div style={{
            display: "flex",
            alignItems: "center",
            background: "#4A5D3A",
            borderRadius: 100,
            padding: "0.2rem",
            width: "100%",
            justifyContent: "space-between",
          }}>
            <button onClick={() => updateQty(product.id, -1)} style={qtyBtnStyle}>−</button>
            <span style={{
              color: "#F7F1E5",
              fontSize: "0.85rem",
              fontWeight: 600,
              fontFamily: "var(--font-fraunces), Georgia, serif",
            }}>
              {qty} en carrito
            </span>
            <button onClick={() => updateQty(product.id, 1)} disabled={qty >= product.stock} style={{ ...qtyBtnStyle, opacity: qty >= product.stock ? 0.4 : 1 }}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  border: "none",
  background: "#F7F1E5",
  color: "#4A5D3A",
  fontSize: "1.1rem",
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
