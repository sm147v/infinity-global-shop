export type CartItem = {
  productId: number;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
};

const STORAGE_KEY = "igs_cart_v1";
const CART_UPDATED_EVENT = "igs-cart-updated";

// ── Respaldo en memoria: si localStorage falla (Instagram iOS, modo privado),
//    el carrito sigue funcionando durante la sesión ──
let memoryCart: CartItem[] = [];
let useMemoryFallback = false;

// Detecta si localStorage es usable
function storageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  if (useMemoryFallback) return false;
  try {
    const testKey = "__igs_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    useMemoryFallback = true;
    return false;
  }
}

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

function normalize(items: CartItem[]): CartItem[] {
  return items.map((item) => ({
    ...item,
    quantity: Math.max(1, Math.min(20, item.quantity)),
  }));
}

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  // Si localStorage no sirve, usar memoria
  if (!storageAvailable()) {
    return normalize(memoryCart);
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown[];
    return normalize(parsed.filter(isCartItem));
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;

  const normalized = normalize(items);

  // Siempre guardar en memoria como respaldo
  memoryCart = normalized;

  // Intentar guardar en localStorage; si falla, ya tenemos memoria
  if (storageAvailable()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch {
      useMemoryFallback = true;
    }
  }

  // Notificar a los componentes (esto siempre funciona)
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
