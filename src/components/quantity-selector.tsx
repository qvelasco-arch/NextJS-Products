"use client";

import { useEffect, useState } from "react";
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
  const [inputValue, setInputValue] = useState(String(quantity));

  useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  function commit() {
    const val = parseInt(inputValue, 10);
    if (!isNaN(val) && val >= 1 && val <= max) {
      onChange(val);
    } else {
      setInputValue(String(quantity));
    }
  }

  function step(delta: number) {
    const next = Math.min(max, Math.max(1, quantity + delta));
    setInputValue(String(next));
    onChange(next);
  }

  return (
    <div className="flex items-center gap-0 border border-[--border] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={quantity <= 1}
        className="w-10 h-10 flex items-center justify-center text-[--muted] hover:text-white hover:bg-[--card-hover] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <input
        type="number"
        min={1}
        max={max}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
        className="w-12 text-center text-sm font-medium bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <button
        type="button"
        onClick={() => step(1)}
        disabled={quantity >= max}
        className="w-10 h-10 flex items-center justify-center text-[--muted] hover:text-white hover:bg-[--card-hover] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
