export type CartItem = {
  productId: number;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
};

const STORAGE_KEY = "igs_cart_v1";
const CART_UPDATED_EVENT = "igs-cart-updated";

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.productId === "number" &&
    typeof v.name === "string" &&
    typeof v.price === "number" &&
    (typeof v.image === "string" || v.image === null) &&
    typeof v.quantity === "number"
  );
}

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown[];
    return parsed
      .filter(isCartItem)
      .map((item) => ({ ...item, quantity: Math.max(1, Math.min(20, item.quantity)) }));
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function isProductInCart(productId: number): boolean {
  return loadCart().some((item) => item.productId === productId);
}

export function subscribeToCartUpdates(onUpdate: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (!event.key || event.key === STORAGE_KEY) {
      onUpdate();
    }
  };

  window.addEventListener(CART_UPDATED_EVENT, onUpdate);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
    window.removeEventListener("storage", onStorage);
  };
}

export function addItemToCart(item: CartItem): CartItem[] {
  const cart = loadCart();
  const found = cart.find((cartItem) => cartItem.productId === item.productId);

  if (found) {
    found.quantity = Math.min(20, found.quantity + item.quantity);
  } else {
    cart.push({ ...item, quantity: Math.min(20, Math.max(1, item.quantity)) });
  }

  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  saveCart([]);
}
