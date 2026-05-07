"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface WishlistContextType {
  items: number[];
  toggle: (productId: number) => void;
  has: (productId: number) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "igs_wishlist";

function readWishlist(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed.filter(n => typeof n === "number");
    }
  } catch { /* ignore */ }
  return [];
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount — empty array means no cascading
  useEffect(() => {
    setItems(readWishlist());
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist whenever items change (only after hydration)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const toggle = useCallback((productId: number) => {
    setItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const has = useCallback((productId: number) => {
    return items.includes(productId);
  }, [items]);

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
