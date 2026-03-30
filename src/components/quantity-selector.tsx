"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  max?: number;
  onChange: (quantity: number) => void;
}

export function QuantitySelector({
  quantity,
  max = 99,
  onChange,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-0 border border-[--border] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="w-10 h-10 flex items-center justify-center text-[--muted] hover:text-white hover:bg-[--card-hover] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-12 text-center text-sm font-medium">{quantity}</span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="w-10 h-10 flex items-center justify-center text-[--muted] hover:text-white hover:bg-[--card-hover] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
