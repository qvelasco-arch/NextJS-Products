"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import type { Cart } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/components/cart/cart-item";

interface CartDrawerProps {
  onClose: () => void;
}

function CartSkeleton() {
  return (
    <div className="p-4 space-y-5">
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="w-20 h-20 rounded-lg bg-zinc-900 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-40 bg-zinc-800 rounded animate-pulse" />
            <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartDrawer({ onClose }: CartDrawerProps) {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data);
    router.refresh();
  }, [router]);

  useEffect(() => {
    setMounted(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!mounted) return null;

  const isEmpty = !cart || cart.items.length === 0;

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-[--border] z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[--border] shrink-0">
          <h2 className="text-lg font-semibold">
            Your Cart{cart && cart.totalItems > 0 ? ` (${cart.totalItems})` : ""}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[--muted] hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <CartSkeleton />
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
              <ShoppingBag className="w-12 h-12 text-zinc-700" />
              <p className="text-sm font-medium">Your cart is empty</p>
              <button
                onClick={onClose}
                className="text-sm text-[--muted] hover:text-white transition-colors"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="px-4">
              {cart!.items.map((item) => (
                <CartItem key={item.productId} item={item} onMutate={refresh} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !isEmpty && (
          <div className="shrink-0 border-t border-[--border] p-5 space-y-4">
            <div className="flex justify-between text-sm text-[--muted]">
              <span>Shipping</span>
              <span className="text-green-400 text-xs font-medium uppercase tracking-wide">Free</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">{formatPrice(cart!.subtotal)}</span>
            </div>
            <button
              className="w-full py-3 bg-white text-black font-medium text-sm rounded-lg hover:bg-zinc-100 transition-colors"
              onClick={() => alert("Checkout not implemented in this demo.")}
            >
              Checkout
            </button>
            <p className="text-xs text-[--muted] text-center">
              This is a demo store. No real purchases are made.
            </p>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
