"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartState } from "@/components/commerce/cart-client";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const { addItem } = useCartState();
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleAdd() {
    addItem(productId, quantity);
    setFeedback("Added to cart");
    window.setTimeout(() => setFeedback(null), 1500);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="number"
        min={1}
        max={10}
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
        className="h-11 w-24 rounded-lg border border-gray-300 px-3"
      />
      <button onClick={handleAdd} className="rounded-full bg-brand px-6 py-2.5 font-semibold text-white">
        Add to cart
      </button>
      <Link href="/cart" className="rounded-full border border-gray-300 px-6 py-2.5 font-semibold text-gray-700">
        Go to cart
      </Link>
      {feedback ? <p className="text-sm text-gray-700">{feedback}</p> : null}
    </div>
  );
}

