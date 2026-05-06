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
  // Initialize as empty - server and client must match during SSR
  const [items, setItems] = useState<number[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after client hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem("igs_wishlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter(n => typeof n === "number"));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsHydrated(true);
  }, []);

  // Write to localStorage whenever items change (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("igs_wishlist", JSON.stringify(items));
    }
  }, [items, isHydrated]);

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
