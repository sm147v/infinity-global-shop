# Hydration Error Fixes - Resumen de Cambios

## Problema Original

React/Next.js reportaba un error de hidratación (hydration mismatch) donde el HTML renderizado por el servidor no coincidía con lo que el cliente renderizaba después de la hidratación.

### Síntomas principales:
- El botón de wishlist mostraba `aria-label="Agregar a favoritos"` en el servidor pero `"Quitar de favoritos"` en el cliente
- El badge de contador de favoritos en el bottom nav solo aparecía en el cliente
- El SVG del corazón cambiaba de color entre servidor y cliente

## Causa Raíz

El problema estaba en componentes que intentaban leer `localStorage` durante la **inicialización del estado** (`useState` initializer):

```typescript
// ❌ PROBLEMA: initializer function intenta acceder a localStorage
const [items, setItems] = useState<number[]>(() => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("igs_wishlist");
  return JSON.parse(saved || "[]");
});
```

Aunque el código tenía `if (typeof window === "undefined")` para manejar SSR, el problema era:
1. **Servidor**: renderiza con `[]` (vacío)
2. **Cliente**: durante la hidratación inicial, React NO ejecuta el initializer nuevamente
3. **Después**: React detecta que el estado debe ser diferente basado en localStorage y regenera el árbol

Esto causa que componentes que dependen de ese estado (wishlist, cart count badge) renderizen diferente.

## Soluciones Implementadas

### 1. **Wishlist Context** (`components/wishlist-context.tsx`)

**Patrón**: "Deferred Hydration"

```typescript
// ✅ SOLUCIÓN: inicializar en empty state
const [items, setItems] = useState<number[]>([]);
const [isHydrated, setIsHydrated] = useState(false);

// Load desde localStorage DESPUÉS de la hidratación
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

// Guardar a localStorage solo después de hidratación
useEffect(() => {
  if (isHydrated) {
    localStorage.setItem("igs_wishlist", JSON.stringify(items));
  }
}, [items, isHydrated]);
```

**Cambios:**
- ✅ Estado inicial siempre `[]` (servidor y cliente coinciden)
- ✅ `useEffect` carga desde localStorage después de la hidratación
- ✅ Flag `isHydrated` previene guardar antes de que el cliente esté listo

---

### 2. **Cart Context** (`components/cart-context.tsx`)

**Aplicado el mismo patrón**:

```typescript
const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
const [isHydrated, setIsHydrated] = useState(false);

// Load después de hidratación
useEffect(() => {
  try {
    const saved = localStorage.getItem("igs_coupon");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object" && parsed.code && parsed.type) {
        setAppliedCoupon(parsed);
      }
    }
  } catch {
    localStorage.removeItem("igs_coupon");
  }
  
  refresh(); // Cargar carrito del navegador
  setIsHydrated(true);
}, [refresh]);

// Solo suscribirse a actualizaciones después de hidratación
useEffect(() => {
  if (!isHydrated) return;
  const unsubscribe = subscribeToCartUpdates(refresh);
  return unsubscribe;
}, [refresh, isHydrated]);
```

**Cambios:**
- ✅ Cupón aplicado se inicializa en `null`
- ✅ Se carga desde localStorage en un `useEffect`
- ✅ Carrito se actualiza después de la hidratación

---

### 3. **Welcome Popup** (`components/welcome-popup.tsx`)

**Problema**: El popup podía renderizarse en el cliente pero no en el servidor

```typescript
// ✅ SOLUCIÓN: No renderizar hasta después de hidratación
const [isHydrated, setIsHydrated] = useState(false);

useEffect(() => {
  const seen = localStorage.getItem("welcome_popup_seen");
  if (!seen) {
    const timer = setTimeout(() => setIsOpen(true), 3000);
    setIsHydrated(true);
    return () => clearTimeout(timer);
  }
  setIsHydrated(true);
}, []);

// Cambiar: if (!isOpen) return null;
// Por:
if (!isHydrated || !isOpen) return null;
```

**Cambios:**
- ✅ Espera a que se complete la hidratación antes de renderizar
- ✅ Evita mismatch de "popup abierto en cliente pero cerrado en servidor"

---

## Componentes Verificados y Considerados Seguros

Los siguientes componentes NO causaban problemas porque acceden a localStorage en handlers o callbacks, no en render:

1. **`components/site-header.tsx`** - ✅ Usa `useSyncExternalStore` correctamente (forma recomendada para Next.js 16)
2. **`components/admin-notifications.tsx`** - ✅ Lee localStorage en `fetchUpdates()` callback
3. **`components/product-edit-modal.tsx`** - ✅ Lee localStorage en handler `save()`
4. **`components/newsletter-form.tsx`** - ✅ Lee localStorage en handler `submit()`

## Validación

✅ **Build**: Compila exitosamente
```
✓ Compiled successfully in 1575ms
✓ Running TypeScript in 1960ms
✓ Generating static pages
```

✅ **TypeScript**: Sin errores

✅ **Tests**: No afectados - todos continúan pasando

## Patrones Aplicados

### Patrón: Deferred Hydration
**Cuándo usar:**
- Componentes que necesitan leer estado del cliente (localStorage, sessionStorage, etc.)
- Componentes que renderizan diferente basado en datos del navegador

**Implementación:**
```typescript
1. Inicializar estado con valor "neutral" (vacío, null, false)
2. Agregar flag `isHydrated`
3. En `useEffect` (sin dependencias), cargar datos del cliente
4. En render condicional, considerar `isHydrated`
```

### Alternativa: useSyncExternalStore
**Usado en:** `site-header.tsx`
```typescript
// Genera diferentes snapshots para servidor vs cliente
const showAdmin = useSyncExternalStore(
  subscribe,
  getClientSnapshot,    // Ejecutado en cliente
  getServerSnapshot     // Ejecutado en servidor
);
```

## Cambios de Comportamiento

### Antes:
- Favorites y cart badges mostraban diferente en SSR vs cliente
- Wishlist se cargaba inmediatamente (aunque con mismatch)

### Después:
- ✅ Servidor y cliente renderizán identicamente durante SSR
- ✅ Los datos del cliente (localStorage) se cargan inmediatamente después de la hidratación
- ✅ No hay mismatch de React
- ✅ User experience sin cambios (solo fix interno)

## Testing Manual

Para validar que los fixes funcionan:

1. **Verificar console en navegador:**
   ```
   - NO debe haber warnings de "hydration mismatch"
   - NO debe haber "Text content did not match"
   ```

2. **Verificar favoritos:**
   ```
   - Agregar producto a favoritos
   - El ícono debe cambiar a relleno inmediatamente
   - El badge debe actualizar en tiempo real
   ```

3. **Verificar carrito:**
   ```
   - Agregar producto al carrito
   - El badge debe actualizar
   - La coupon debe persistir si la recarga
   ```

4. **Verificar welcome popup:**
   ```
   - Debe mostrar después de 3 segundos
   - Debe recordar que fue visto (no mostrar en recargar)
   ```

## Referencias

- [Next.js Hydration Error docs](https://nextjs.org/docs/messages/react-hydration-error)
- [useSyncExternalStore API](https://react.dev/reference/react/useSyncExternalStore)
- [Handling Hydration in Next.js 16](https://nextjs.org/blog/next-16)

## Resumen

**Problema:** Hydration mismatch en wishlist y cart  
**Solución:** Deferred hydration pattern  
**Impacto:** Cero en UX, fix interno de React warnings  
**Status:** ✅ Completado y validado
