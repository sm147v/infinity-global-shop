"use client";

import { useCart, SHIPPING } from "./cart-context";
import Link from "next/link";

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal, itemCount } = useCart();

  const remaining = SHIPPING.FREE_THRESHOLD - subtotal;
  const isFree = subtotal >= SHIPPING.FREE_THRESHOLD;
  const progress = Math.min((subtotal / SHIPPING.FREE_THRESHOLD) * 100, 100);
  const shipping = isFree ? 0 : SHIPPING.COST;
  const total = subtotal + shipping;

  let shippingMsg: React.ReactNode;
  if (subtotal === 0) {
    shippingMsg = "Agrega productos para empezar 🌿";
  } else if (isFree) {
    shippingMsg = "🎉 ¡Envío gratis desbloqueado!";
  } else if (remaining <= 30000) {
    shippingMsg = <>¡Casi lo logras! Solo <em style={{color:"#C97B5C",fontStyle:"italic",fontWeight:600}}>{fmt(remaining)}</em> más ✨</>;
  } else {
    shippingMsg = <>Agrega <em style={{color:"#C97B5C",fontStyle:"italic",fontWeight:600}}>{fmt(remaining)}</em> más para <em style={{color:"#C97B5C",fontStyle:"italic",fontWeight:600}}>envío gratis</em> 🚚</>;
  }

  return (
    <>
      <div
        onClick={closeCart}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(42,46,38,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s",
        }}
      />

      <aside
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "100%", maxWidth: "420px",
          background: "#F7F1E5",
          zIndex: 201,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
          display: "flex", flexDirection: "column",
          boxShadow: "-10px 0 40px rgba(0,0,0,0.15)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{
          padding: "1.25rem", display: "flex",
          justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid #EDE3CD", background: "#FDFAF3",
        }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", color: "#4A5D3A", fontWeight: 500, margin: 0 }}>
            Tu carrito <span style={{ fontSize: "0.85rem", color: "#4A4F45", fontWeight: 400 }}>({itemCount})</span>
          </h2>
          <button onClick={closeCart} style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "#F7F1E5", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#2A2E26", cursor: "pointer",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{
          padding: "1.25rem",
          background: "linear-gradient(180deg,#FAF6EC 0%,#F7F1E5 100%)",
          borderBottom: "1px solid #EDE3CD",
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: "0.95rem",
            color: isFree ? "#5C8A5E" : "#4A5D3A",
            textAlign: "center", marginBottom: "0.85rem", fontWeight: 500,
          }}>
            {shippingMsg}
          </div>
          <div style={{
            height: 10, background: "#EDE3CD",
            borderRadius: 100, overflow: "hidden",
            marginBottom: "0.6rem",
          }}>
            <div style={{
              height: "100%",
              background: isFree
                ? "linear-gradient(90deg,#5C8A5E 0%,#4A5D3A 100%)"
                : "linear-gradient(90deg,#A8B584 0%,#6B7B4F 50%,#4A5D3A 100%)",
              width: `${progress}%`,
              borderRadius: 100,
              transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "#4A4F45" }}>
            <span style={{ color: "#5C8A5E", fontWeight: 600 }}>✓ $0</span>
            <span style={{ color: isFree ? "#5C8A5E" : "#4A4F45", fontWeight: isFree ? 600 : 400 }}>
              {isFree ? "✓" : "🚚"} $150k envío gratis
            </span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
              <div style={{
                width: 70, height: 70, borderRadius: "50%",
                background: "#FDFAF3",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1rem", color: "#4A5D3A",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              </div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.15rem", color: "#4A5D3A", margin: "0 0 0.4rem" }}>
                Tu carrito está vacío
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4A4F45", marginBottom: "1.25rem" }}>
                Empieza a explorar nuestros productos curados
              </p>
              <button onClick={closeCart} style={{
                background: "#4A5D3A", color: "#F7F1E5", border: "none",
                padding: "0.75rem 1.5rem", borderRadius: 100,
                fontSize: "0.85rem", fontWeight: 500, cursor: "pointer",
              }}>
                Ver productos
              </button>
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{
              display: "flex", gap: "0.85rem", padding: "1rem 1.25rem",
              borderBottom: "1px solid #EDE3CD", background: "#FDFAF3",
            }}>
              <div style={{
                width: 65, height: 65, borderRadius: 12,
                flexShrink: 0, overflow: "hidden",
                background: "linear-gradient(135deg,#EDE3CD,#A8B584)",
              }}>
                {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem", gap: "0.5rem" }}>
                  <div style={{
                    fontFamily: "Georgia, serif", fontSize: "0.85rem", fontWeight: 500,
                    color: "#4A5D3A", lineHeight: 1.2, flex: 1,
                  }}>
                    {item.name}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: "rgba(201,83,61,0.08)",
                      border: "1px solid rgba(201,83,61,0.2)",
                      color: "#C9533D", cursor: "pointer",
                      width: 28, height: 28, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", gap: "0.5rem" }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center",
                    background: "#F7F1E5", borderRadius: 100,
                    padding: "0.2rem", border: "1px solid rgba(74,93,58,0.1)",
                  }}>
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      style={{
                        width: 26, height: 26, borderRadius: "50%",
                        border: "none", background: "#FDFAF3", color: "#4A5D3A",
                        fontSize: "1rem", fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >−</button>
                    <span style={{
                      fontSize: "0.85rem", fontWeight: 600,
                      color: "#4A5D3A", minWidth: 26, textAlign: "center",
                    }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      disabled={item.quantity >= item.stock}
                      style={{
                        width: 26, height: 26, borderRadius: "50%",
                        border: "none", background: "#FDFAF3", color: "#4A5D3A",
                        fontSize: "1rem", fontWeight: 600,
                        cursor: item.quantity >= item.stock ? "not-allowed" : "pointer",
                        opacity: item.quantity >= item.stock ? 0.4 : 1,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >+</button>
                  </div>
                  <div style={{
                    fontFamily: "Georgia, serif", fontSize: "0.95rem",
                    fontWeight: 600, color: "#4A5D3A",
                  }}>
                    {fmt(Number(item.price) * item.quantity)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ padding: "1.25rem", background: "#FDFAF3", borderTop: "1px solid #EDE3CD" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", fontSize: "0.88rem", color: "#4A4F45" }}>
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "0.4rem 0", fontSize: "0.88rem",
              color: isFree ? "#5C8A5E" : "#4A4F45",
              fontWeight: isFree ? 600 : 400,
            }}>
              <span>Envío</span>
              <span>{isFree ? "GRATIS ✨" : fmt(SHIPPING.COST)}</span>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontFamily: "Georgia, serif", fontSize: "1.2rem",
              fontWeight: 600, color: "#4A5D3A",
              borderTop: "2px solid #4A5D3A",
              marginTop: "0.4rem", paddingTop: "0.6rem",
            }}>
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>

            <Link href="/checkout" onClick={closeCart} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              width: "100%", background: "#4A5D3A", color: "#F7F1E5",
              padding: "1rem", borderRadius: 100,
              fontSize: "0.95rem", fontWeight: 500,
              marginTop: "1rem", textDecoration: "none",
            }}>
              Pagar con Wompi
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </Link>

            <div style={{
              display: "flex", justifyContent: "center", gap: "0.4rem",
              marginTop: "0.85rem", fontSize: "0.62rem",
              color: "#4A4F45", alignItems: "center", flexWrap: "wrap",
            }}>
              <span>Aceptamos:</span>
              {["Visa","Master","PSE","Nequi"].map(m => (
                <span key={m} style={{
                  background: "#F7F1E5", padding: "0.2rem 0.45rem",
                  borderRadius: 6, fontWeight: 600,
                  border: "1px solid rgba(74,93,58,0.1)",
                }}>{m}</span>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
