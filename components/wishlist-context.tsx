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

  // Load from localStorage after hydration
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readWishlist());
    setHydrated(true);
  }, []);

  // Persist whenever items change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
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
