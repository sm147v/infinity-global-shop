"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { loadCart, saveCart, addItemToCart, clearCart as libClear, subscribeToCartUpdates, CartItem as LibCartItem } from "@/lib/cart";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  description: string | null;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  value: number;
  discount: number;
  freeShipping: boolean;
}

interface AddItemInput {
  id: number;
  name: string;
  price: number;
  image: string | null;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: AddItemInput) => void;
  updateQty: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (coupon: AppliedCoupon | null) => void;
}

const FREE_SHIPPING_THRESHOLD = 150000;
const SHIPPING_COST = 8000;

const CartContext = createContext<CartContextType | undefined>(undefined);

function libToCtx(items: LibCartItem[]): CartItem[] {
  return items.map(item => ({
    id: item.productId,
    name: item.name,
    price: item.price,
    image: item.image,
    stock: 99,
    quantity: item.quantity,
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from storage after hydration
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(libToCtx(loadCart()));
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("igs_coupon");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object" && parsed.code && parsed.type) {
            setAppliedCoupon(parsed);
          }
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  function applyCoupon(coupon: AppliedCoupon | null) {
    setAppliedCoupon(coupon);
    if (coupon) {
      localStorage.setItem("igs_coupon", JSON.stringify(coupon));
    } else {
      localStorage.removeItem("igs_coupon");
    }
  }

  const refresh = useCallback(() => {
    setItems(libToCtx(loadCart()));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const unsubscribe = subscribeToCartUpdates(refresh);
    return unsubscribe;
  }, [refresh, hydrated]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (product: AddItemInput) => {
    addItemToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const updateQty = (id: number, delta: number) => {
    const cart = loadCart();
    const item = cart.find(x => x.productId === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      saveCart(cart.filter(x => x.productId !== id));
    } else if (newQty <= 20) {
      item.quantity = newQty;
      saveCart(cart);
    }
  };

  const removeItem = (id: number) => {
    const cart = loadCart();
    saveCart(cart.filter(x => x.productId !== id));
  };

  const clearCart = () => {
    libClear();
  };

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, openCart, closeCart,
      addItem, updateQty, removeItem, clearCart,
      subtotal, itemCount,
      appliedCoupon, applyCoupon,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const SHIPPING = {
  FREE_THRESHOLD: FREE_SHIPPING_THRESHOLD,
  COST: SHIPPING_COST,
};
