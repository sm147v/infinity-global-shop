// Neutralizado: reseñas reales se leen desde la DB via /api/reviews y <ProductReviews>.
export interface Review { name: string; location: string; text: string; stars: number; }
export function getProductReviews(_productId: number): { rating: number; count: number; reviews: Review[] } {
  return { rating: 0, count: 0, reviews: [] };
}
