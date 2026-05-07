/**
 * Domain types for the e-commerce application
 * All types are properly defined with no `unknown`, `any`, or `Record<string, unknown>`
 */

// ============================================================================
// ADMIN DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
  todayCount: number;
  todayRevenue: number;
  monthCount: number;
  monthRevenue: number;
  byStatus: Record<string, number>;
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  name: string;
  image: string | null;
  product?: {
    id: number;
    name: string;
  };
}

export interface Order {
  id: number;
  orderNumber: string;
  email: string;
  phone: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  status: OrderStatus;
  total: number;
  createdAt: Date | string;
  items: OrderItem[];
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  images?: string[];
  category: string | null;
  longDescription?: string | null;
  features?: string[];
  brand?: string | null;
  createdAt: Date | string;
}

// ============================================================================
// REVIEW TYPES
// ============================================================================

export interface ProductReview {
  id: number;
  productId: number;
  rating: number;
  comment: string;
  author: string;
  customerName?: string;
  location?: string;
  createdAt: string;
}

// ============================================================================
// COUPON TYPES
// ============================================================================

export type CouponType = "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";

export interface Coupon {
  id: number;
  code: string;
  type: CouponType;
  value: number;
  description: string | null;
  maxUses: number | null;
  currentUses: number;
  active: boolean;
  expiresAt: Date | string | null;
  minPurchase?: number;
  validUntil?: Date | string | null;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface PaymentData {
  reference: string;
  totalAmount: number;
  currency: string;
  customerEmail: string;
  customerPhone: string;
}

// ============================================================================
// VALIDATION RESULT TYPE
// ============================================================================

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
