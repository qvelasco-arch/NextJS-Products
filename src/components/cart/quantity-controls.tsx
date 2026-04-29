"use client";

import { useState, useTransition } from "react";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { updateQuantity, removeFromCart } from "@/lib/cart-actions";

interface CartQuantityControlsProps {
  productId: string;
  quantity: number;
}

export function CartQuantityControls({
  productId,
  quantity,
}: CartQuantityControlsProps) {
  const [isPending, startTransition] = useTransition();
  const [localQty, setLocalQty] = useState(quantity);

  function handleUpdate(newQty: number) {
    setLocalQty(newQty);
    startTransition(async () => {
      await updateQuantity(productId, newQty);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeFromCart(productId);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 border border-[--border] rounded-lg overflow-hidden">
        <button
          onClick={() => handleUpdate(localQty - 1)}
          disabled={isPending || localQty <= 1}
          className="w-8 h-8 flex items-center justify-center text-[--muted] hover:text-white hover:bg-[--card-hover] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="w-8 text-center text-sm font-medium">
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-[--muted]" />
          ) : (
            localQty
          )}
        </span>

        <button
          onClick={() => handleUpdate(localQty + 1)}
          disabled={isPending}
          className="w-8 h-8 flex items-center justify-center text-[--muted] hover:text-white hover:bg-[--card-hover] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <button
        onClick={handleRemove}
        disabled={isPending}
        className="w-8 h-8 flex items-center justify-center text-[--muted] hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Remove item"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
