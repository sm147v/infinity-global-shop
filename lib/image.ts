/**
 * Image optimization utilities for Next.js Image component with Cloudinary
 */

import { ImageLoader } from "next/image";

/**
 * Next.js loader for Cloudinary - handles automatic image transformations
 * Replaces /upload/ with /upload/{transformations} in the URL
 */
export const cloudinaryLoader: ImageLoader = ({ src, width, quality = 75 }) => {
  if (!src) return "";

  if (src.includes("cloudinary.com")) {
    // Cloudinary URL transformation
    const transformations = `w_${width},c_limit,f_auto,q_${quality}`;
    return src.replace("/upload/", `/upload/${transformations}/`);
  }

  return src;
};

/**
 * Optimize Cloudinary URL for product cards (fixed 400x400)
 * @deprecated Use next/image with cloudinaryLoader instead
 */
export function optimizeCard(url: string | null): string {
  if (!url) return "";
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", "/upload/w_400,h_400,c_pad,b_auto:predominant,f_auto,q_auto/");
  }
  return url;
}

/**
 * Optimize Cloudinary URL for product details gallery (full resolution)
 * @deprecated Use next/image with cloudinaryLoader instead
 */
export function optimizeImage(url: string | null): string {
  if (!url) return "";
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }
  return url;
}

/**
 * Optimize Cloudinary URL for product thumbnails (70x70 preview)
 * @deprecated Use next/image with cloudinaryLoader instead
 */
export function thumbImage(url: string | null): string {
  if (!url) return "";
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", "/upload/w_70,h_70,c_fill,g_auto,f_auto,q_auto/");
  }
  return url;
}

/**
 * Get image dimensions for next/image
 * Returns placeholder dimensions if actual dimensions are unknown
 */
export const IMAGE_SIZES = {
  // Product cards
  CARD_WIDTH: 400,
  CARD_HEIGHT: 400,
  // Product gallery main image
  GALLERY_WIDTH: 600,
  GALLERY_HEIGHT: 600,
  // Thumbnails
  THUMB_WIDTH: 70,
  THUMB_HEIGHT: 70,
  // Cart/header
  CART_WIDTH: 80,
  CART_HEIGHT: 80,
  // Admin upload
  UPLOAD_WIDTH: 600,
  UPLOAD_HEIGHT: 400,
} as const;
