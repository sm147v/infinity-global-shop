"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface WishlistContextType {
  items: number[];
  toggle: (productId: number) => void;
  has: (productId: number) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  // Lazy init: Read localStorage during first render only
  const [items, setItems] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("igs_wishlist");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(n => typeof n === "number") : [];
    } catch {
      return [];
    }
  });

  // Write to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("igs_wishlist", JSON.stringify(items));
  }, [items]);

  function toggle(productId: number) {
    setItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }

  function has(productId: number) {
    return items.includes(productId);
  }

  return (
    <WishlistContext.Provider value={{ items, toggle, has, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
