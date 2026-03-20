"use client";

import { useState } from "react";
import { addItemToCart } from "@/lib/cart";

type Props = {
  productId: number;
  name: string;
  price: number;
  image: string | null;
};

export function AddToCartButton({ productId, name, price, image }: Props) {
  const [isAdded, setIsAdded] = useState(false);

  function onClick() {
    addItemToCart({
      productId,
      name,
      price,
      image,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  }

  return (
    <button className="btn btn-primary" onClick={onClick} type="button">
      {isAdded ? "Agregado" : "Agregar al carrito"}
    </button>
  );
}
