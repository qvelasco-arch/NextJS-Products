'use client'
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  totalItems: number;
}

export function CartSummary({ subtotal, totalItems }: CartSummaryProps) {
  return (
    <div className="bg-[--card] border border-[--border] rounded-xl p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-[--muted]">
          <span>
            Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
          </span>
          <span className="text-white font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[--muted]">
          <span>Shipping</span>
          <span className="text-green-400 text-xs font-medium uppercase tracking-wide">
            Free
          </span>
        </div>
      </div>

      <div className="border-t border-[--border] mt-4 pt-4 flex justify-between">
        <span className="font-semibold">Total</span>
        <span className="font-bold text-lg">{formatPrice(subtotal)}</span>
      </div>

      <button
        className="w-full mt-6 py-3 bg-white text-black font-medium text-sm rounded-lg hover:bg-zinc-100 transition-colors"
        onClick={() => alert("Checkout not implemented in this demo.")}
      >
        Checkout
      </button>

      <p className="text-xs text-[--muted] text-center mt-3">
        This is a demo store. No real purchases are made.
      </p>
    </div>
  );
}
