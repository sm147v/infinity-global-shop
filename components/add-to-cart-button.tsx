"use client";

import { useEffect, useState } from "react";
import { addItemToCart, isProductInCart, subscribeToCartUpdates } from "@/lib/cart";

type Props = {
  productId: number;
  name: string;
  price: number;
  image: string | null;
};

export function AddToCartButton({ productId, name, price, image }: Props) {
  const [isAdded, setIsAdded] = useState(() => isProductInCart(productId));

  useEffect(() => {
    return subscribeToCartUpdates(() => {
      setIsAdded(isProductInCart(productId));
    });
  }, [productId]);

  function onClick() {
    addItemToCart({
      productId,
      name,
      price,
      image,
      quantity: 1,
    });
    setIsAdded(true);
  }

  return (
    <button
      className={isAdded ? "btn border-emerald-200 bg-emerald-50 text-emerald-800" : "btn btn-primary"}
      onClick={onClick}
      type="button"
      aria-pressed={isAdded}
    >
      {isAdded ? "Ya agregado al carrito" : "Agregar al carrito"}
    </button>
  );
}
