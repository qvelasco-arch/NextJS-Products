import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getCartToken } from "@/lib/cart-actions";
import { fetchCart, fetchStock } from "@/lib/api";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your Vercel Swag Store shopping cart.",
};

async function CartContent() {
  const token = await getCartToken();
  const cart = token ? await fetchCart(token) : null;
  const isEmpty = !cart || cart.items.length === 0;

  const stockByProductId: Record<string, number> = {};
  if (cart && !isEmpty) {
    const stocks = await Promise.all(cart.items.map((item) => fetchStock(item.product.id)));
    cart.items.forEach((item, i) => {
      stockByProductId[item.product.id] = stocks[i]?.stock ?? Infinity;
    });
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-zinc-700 mb-6" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-sm text-[--muted] mb-8">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 bg-white text-black font-medium text-sm px-6 py-3 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Cart items */}
      <div className="lg:col-span-2">
        <div className="bg-[--card] border border-[--border] rounded-xl px-4">
          {cart.items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              stock={stockByProductId[item.product.id]}
            />
          ))}
        </div>
        <div className="mt-4">
          <Link
            href="/search"
            className="text-sm text-[--muted] hover:text-white transition-colors"
          >
            ← Continue shopping
          </Link>
        </div>
      </div>

      {/* Summary */}
      <div>
        <CartSummary subtotal={cart.subtotal} totalItems={cart.totalItems} />
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-5 border-b border-[--border]">
            <div className="w-20 h-20 rounded-lg bg-zinc-900 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-zinc-800 rounded animate-pulse" />
              <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-64 bg-zinc-900 rounded-xl animate-pulse" />
    </div>
  );
}

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Your Cart</h1>
      <Suspense fallback={<CartSkeleton />}>
        <CartContent />
      </Suspense>
    </div>
  );
}
