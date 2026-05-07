import { readFileSync, writeFileSync } from 'fs';

// Fix 1: search modal - usar slug
let search = readFileSync('components/search-modal.tsx', 'utf8');
search = search.replace(
  `href={"/products/" + p.id}`,
  `href={"/products/" + (p.slug || p.id)}`
);
// Agregar slug al tipo Product
search = search.replace(
  `interface Product {
  id: number;
  name: string;
  price: number | string;
  image: string | null;
  category: string;
  stock: number;
}`,
  `interface Product {
  id: number;
  name: string;
  price: number | string;
  image: string | null;
  category: string;
  stock: number;
  slug?: string | null;
}`
);
// Agregar slug al select de la API
writeFileSync('components/search-modal.tsx', search);
console.log('✓ search-modal.tsx — slug fix');

// Fix 2: agregar slug al API de búsqueda
let api = readFileSync('app/api/products/search/route.ts', 'utf8');
api = api.replace(
  `select: { id: true, name: true, price: true, image: true, category: true, stock: true }`,
  `select: { id: true, name: true, price: true, image: true, category: true, stock: true, slug: true }`
);
writeFileSync('app/api/products/search/route.ts', api);
console.log('✓ search/route.ts — slug en select');

// Fix 3: badge de originalidad en product-detail-client
let detail = readFileSync('components/product-detail-client.tsx', 'utf8');
const badgeBlock = `
            {/* Badge originalidad */}
            <div style={{ background: "linear-gradient(135deg, rgba(74,93,58,0.06), rgba(201,169,110,0.08))", border: "1px solid #EDE3CD", borderRadius: 14, padding: "0.85rem 1rem", marginBottom: "1.5rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>🛡️</span>
              <div>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#4A5D3A", margin: "0 0 0.25rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  100% Original · Importado de USA
                </p>
                <p style={{ fontSize: "0.78rem", color: "#4A4F45", margin: 0, lineHeight: 1.5 }}>
                  Todos nuestros productos son comprados directamente en tiendas y cadenas oficiales de Estados Unidos. Llegan sellados, con fecha de vencimiento vigente y sin intermediarios.
                </p>
              </div>
            </div>`;

// Insertar antes del bloque de beneficios de envío
detail = detail.replace(
  `            <div style={{ background: "#FDFAF3", border: "1px solid #EDE3CD", borderRadius: 16, padding: "1rem", marginBottom: "1.5rem" }}>
              {[
                { icon: "🚚", text: "Envío gratis en pedidos +$150.000" },`,
  badgeBlock + `
            <div style={{ background: "#FDFAF3", border: "1px solid #EDE3CD", borderRadius: 16, padding: "1rem", marginBottom: "1.5rem" }}>
              {[
                { icon: "🚚", text: "Envío gratis en pedidos +$150.000" },`
);
writeFileSync('components/product-detail-client.tsx', detail);
console.log('✓ product-detail-client.tsx — badge originalidad');
