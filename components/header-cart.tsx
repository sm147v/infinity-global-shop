"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, startTransition } from "react";
import { CartItem, clearCart, loadCart, subscribeToCartUpdates } from "@/lib/cart";

export function HeaderCart() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const previousCountRef = useRef(0);
  const [isOpen, setIsOpen] = useState(false);
  const [pulseBadge, setPulseBadge] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(loadCart());
    sync();

    return subscribeToCartUpdates(sync);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    const previousCount = previousCountRef.current;
    if (itemCount > previousCount) {
      startTransition(() => setPulseBadge(true));
      const timeout = window.setTimeout(() => setPulseBadge(false), 320);
      previousCountRef.current = itemCount;
      return () => window.clearTimeout(timeout);
    }

    previousCountRef.current = itemCount;
  }, [itemCount]);

  return (
    <div className="header-cart" ref={rootRef}>
      <button
        type="button"
        className="cart-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Abrir mini carrito"
      >
        <span className="cart-icon" aria-hidden>
          Bag
        </span>
        <span>Carrito</span>
        <span className={pulseBadge ? "cart-badge cart-badge-pulse" : "cart-badge"}>{itemCount}</span>
      </button>

      {isOpen && (
        <div className="cart-popover" role="dialog" aria-label="Resumen del carrito">
          <div className="cart-popover-head">
            <h3>Tu carrito</h3>
            <span>{itemCount} items</span>
          </div>

          {items.length === 0 ? (
            <div className="soft-panel p-3">
              <p className="text-sm muted">Aun no agregas productos.</p>
              <Link className="btn mt-3 w-full" href="/products" onClick={() => setIsOpen(false)}>
                Ver productos
              </Link>
            </div>
          ) : (
            <div className="cart-preview-list">
              {items.slice(0, 3).map((item) => (
                <article key={item.productId} className="cart-preview-item">
                  <div className="cart-preview-main">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-preview-thumb"
                       loading="lazy" />
                    ) : (
                      <div className="cart-preview-thumb cart-preview-thumb-empty" aria-hidden />
                    )}
                    <div>
                      <p className="cart-preview-name">{item.name}</p>
                      <p className="text-xs muted">{item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </article>
              ))}
              {items.length > 3 && (
                <p className="cart-more-items text-xs muted">+ {items.length - 3} productos mas en el carrito</p>
              )}
            </div>
          )}

          {items.length > 0 && (
            <>
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <button
                className="btn btn-danger mt-3 w-full"
                type="button"
                onClick={() => {
                  clearCart();
                  setIsOpen(false);
                }}
              >
                Vaciar carrito
              </button>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link className="btn w-full" href="/products" onClick={() => setIsOpen(false)}>
                  Seguir comprando
                </Link>
                <Link className="btn btn-primary w-full" href="/checkout" onClick={() => setIsOpen(false)}>
                  Ir a pagar
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
