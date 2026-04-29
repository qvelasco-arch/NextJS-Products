"use client";

import { useState } from "react";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { addToCart } from "@/lib/cart-actions";
import { QuantitySelector } from "@/components/quantity-selector";

const MAX_PER_ORDER = 10;

interface AddToCartButtonProps {
  productId: string;
  maxStock: number;
  inStock: boolean;
}

export function AddToCartButton({
  productId,
  maxStock,
  inStock,
}: AddToCartButtonProps) {
  const effectiveMax = Math.min(MAX_PER_ORDER, maxStock);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleAddToCart() {
    setStatus("loading");
    const result = await addToCart(productId, quantity);
    if (result.success) {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-[--muted]">Quantity</span>
        <div className="flex flex-col gap-1">
          <QuantitySelector
            quantity={quantity}
            max={effectiveMax}
            onChange={setQuantity}
          />
          {MAX_PER_ORDER <= maxStock && (
            <p className="text-xs text-[--muted]">Max {MAX_PER_ORDER} per order</p>
          )}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!inStock || status === "loading"}
        className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-white text-black font-medium text-sm rounded-lg hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
        {status === "success" && <Check className="w-4 h-4" />}
        {status === "idle" || status === "error" ? (
          <ShoppingBag className="w-4 h-4" />
        ) : null}
        {status === "loading"
          ? "Adding..."
          : status === "success"
          ? "Added!"
          : status === "error"
          ? "Try again"
          : inStock
          ? "Add to Cart"
          : "Out of Stock"}
      </button>
    </div>
  );
}
