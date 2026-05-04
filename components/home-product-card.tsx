"use client";

import Link from "next/link";
import { useCart } from "./cart-context";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  stock: number;
}

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");

function optimizeCard(url: string | null): string {
  if (!url) return "";
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", "/upload/w_400,h_400,c_pad,b_auto:predominant,f_auto,q_auto/");
  }
  return url;
}

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
      <Link href={"/products/" + product.id} style={{ textDecoration: "none", color: "inherit" }}>
        <div style={{
          width: "100%",
          aspectRatio: "1",
          borderRadius: 12,
          marginBottom: "0.6rem",
          overflow: "hidden",
          background: "linear-gradient(135deg, #EDE3CD 0%, #A8B584 100%)",
          cursor: "pointer",
        }}>
          {product.image && (
            <img
              src={optimizeCard(product.image)}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
             loading="lazy" />
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
