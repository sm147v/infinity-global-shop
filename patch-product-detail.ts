import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('components/product-detail-client.tsx', 'utf8');

const oldBlock = `            <p style={{ fontSize: "0.95rem", color: "#4A4F45", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              {product.description}
            </p>

            <div style={{ background: "#FDFAF3", border: "1px solid #EDE3CD", borderRadius: 16, padding: "1rem", marginBottom: "1.5rem" }}>`;

const newBlock = `            <p style={{ fontSize: "0.95rem", color: "#4A4F45", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              {product.description}
            </p>

            {product.features && product.features.length > 0 && (
              <div style={{ background: "#FDFAF3", border: "1px solid #EDE3CD", borderRadius: 16, padding: "1rem", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#C97B5C", margin: "0 0 0.75rem" }}>
                  Características
                </p>
                {product.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", padding: "0.35rem 0", fontSize: "0.88rem", color: "#4A5D3A" }}>
                    <span style={{ color: "#C9A96E", fontWeight: 700, marginTop: "1px" }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            )}

            {product.longDescription && (
              <details style={{ marginBottom: "1.5rem" }}>
                <summary style={{ fontSize: "0.88rem", fontWeight: 600, color: "#4A5D3A", cursor: "pointer", padding: "0.75rem 1rem", background: "#FDFAF3", borderRadius: 12, border: "1px solid #EDE3CD", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>📖 Descripción completa</span>
                  <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>Ver más ▾</span>
                </summary>
                <div style={{ padding: "1rem", fontSize: "0.9rem", color: "#4A4F45", lineHeight: 1.7, whiteSpace: "pre-line", borderRadius: "0 0 12px 12px", border: "1px solid #EDE3CD", borderTop: "none", background: "#FDFAF3" }}>
                  {product.longDescription}
                </div>
              </details>
            )}

            <div style={{ background: "#FDFAF3", border: "1px solid #EDE3CD", borderRadius: 16, padding: "1rem", marginBottom: "1.5rem" }}>`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  writeFileSync('components/product-detail-client.tsx', content);
  console.log('✓ Patch aplicado correctamente');
} else {
  console.log('✗ No se encontró el bloque — revisa el archivo');
}
