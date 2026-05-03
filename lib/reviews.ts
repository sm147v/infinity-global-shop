// Genera reseñas determinísticas por productId
// El mismo producto siempre tiene las mismas reseñas (no random)

const SAMPLE_REVIEWS = [
  { name: "María Camila R.", location: "El Poblado", text: "Llegó al día siguiente, todo perfecto y empacado con tanto detalle.", stars: 5 },
  { name: "Laura T.", location: "Laureles", text: "Por fin productos americanos sin pagar dólares ni esperar 3 semanas.", stars: 5 },
  { name: "Sofía M.", location: "Envigado", text: "Compré para toda mi familia y todas las vitaminas son originales.", stars: 5 },
  { name: "Daniela P.", location: "Belén", text: "Excelente atención por WhatsApp, súper personalizado.", stars: 5 },
  { name: "Valentina G.", location: "Sabaneta", text: "El producto exactamente como en la foto, calidad real.", stars: 4 },
  { name: "Ana L.", location: "Itagüí", text: "Lo recomiendo, muy buena experiencia desde el inicio.", stars: 5 },
  { name: "Camila V.", location: "El Poblado", text: "Los empaques súper cuidados, se nota el cariño en cada detalle.", stars: 5 },
  { name: "Isabella M.", location: "Laureles", text: "Llevo 2 pedidos y siempre llegan rápido y completos.", stars: 5 },
  { name: "Manuela R.", location: "Bello", text: "Buenos precios comparado con otras tiendas que importan.", stars: 4 },
  { name: "Juliana S.", location: "Envigado", text: "Me sorprendió la calidad, definitivamente vuelvo a comprar.", stars: 5 },
  { name: "Andrea P.", location: "El Poblado", text: "Muy profesionales, el seguimiento por WhatsApp es genial.", stars: 5 },
  { name: "Mariana L.", location: "Sabaneta", text: "Producto original, llegó antes de lo esperado.", stars: 5 },
];

export interface Review {
  name: string;
  location: string;
  text: string;
  stars: number;
}

// Hash simple para que el mismo productId genere siempre el mismo resultado
function seedFromId(id: number): number {
  return ((id * 9301 + 49297) % 233280);
}

export function getProductReviews(productId: number): {
  rating: number;
  count: number;
  reviews: Review[];
} {
  const seed = seedFromId(productId);

  // Rating entre 4.5 y 4.8 (decimales: .5, .6, .7, .8)
  const ratingOptions = [4.5, 4.6, 4.7, 4.8];
  const rating = ratingOptions[seed % ratingOptions.length];

  // Cantidad entre 23 y 187 reseñas
  const count = 23 + (seed % 165);

  // Seleccionar 3 reseñas distintas para mostrar
  const startIdx = seed % SAMPLE_REVIEWS.length;
  const reviews = [
    SAMPLE_REVIEWS[startIdx],
    SAMPLE_REVIEWS[(startIdx + 4) % SAMPLE_REVIEWS.length],
    SAMPLE_REVIEWS[(startIdx + 7) % SAMPLE_REVIEWS.length],
  ];

  return { rating, count, reviews };
}

export function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return "★".repeat(full) + (hasHalf ? "½" : "") + "☆".repeat(5 - full - (hasHalf ? 1 : 0));
}
