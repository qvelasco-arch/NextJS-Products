"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { updateQuantity, removeFromCart } from "@/lib/cart-actions";
import { usePageStock } from "@/lib/stock-context";

interface CartQuantityControlsProps {
  productId: string;
  quantity: number;
  maxQuantity?: number | null;
  onMutate?: () => void;
}

export function CartQuantityControls({
  productId,
  quantity,
  maxQuantity,
  onMutate,
}: CartQuantityControlsProps) {
  const effectiveMax = maxQuantity ?? Infinity;
  const { setStock } = usePageStock();
  const [isPending, startTransition] = useTransition();
  const [localQty, setLocalQty] = useState(quantity);
  const [inputValue, setInputValue] = useState(String(quantity));
  const requestedQtyRef = useRef(quantity);

  useEffect(() => {
    if (!isPending) {
      if (quantity !== requestedQtyRef.current) {
        // Server capped the qty — real stock is at most this value
        setStock(productId, quantity);
      }
      requestedQtyRef.current = quantity;
      setLocalQty(quantity);
      setInputValue(String(quantity));
    }
  }, [quantity, isPending, productId, setStock]);

  function handleUpdate(newQty: number) {
    requestedQtyRef.current = newQty;
    setLocalQty(newQty);
    setInputValue(String(newQty));
    startTransition(async () => {
      await updateQuantity(productId, newQty);
      await onMutate?.();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeFromCart(productId);
      await onMutate?.();
    });
  }

  function commitInput() {
    const val = parseInt(inputValue, 10);
    if (isNaN(val) || val < 1) {
      setInputValue(String(localQty));
      return;
    }
    if (val > localQty && localQty >= effectiveMax) {
      setInputValue(String(localQty));
      return;
    }
    if (val !== localQty) {
      handleUpdate(Math.min(val, effectiveMax));
    } else {
      setInputValue(String(val));
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 border border-[--border] rounded-lg overflow-hidden">
        <button
          onClick={() => handleUpdate(Math.min(localQty - 1, effectiveMax))}
          disabled={isPending || localQty <= 1}
          className="w-8 h-8 flex items-center justify-center text-[--muted] hover:text-white hover:bg-[--card-hover] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {isPending ? (
          <span className="w-8 flex items-center justify-center">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[--muted]" />
          </span>
        ) : (
          <input
            type="number"
            min={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={commitInput}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            disabled={isPending}
            className="w-8 text-center text-sm font-medium bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        )}

        <button
          onClick={() => handleUpdate(localQty + 1)}
          disabled={isPending || localQty >= effectiveMax}
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
