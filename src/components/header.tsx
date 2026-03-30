import Link from "next/link";
import { Suspense } from "react";
import { CartIcon } from "@/components/cart/cart-icon";
import { Triangle } from "lucide-react";

function CartIconSkeleton() {
  return (
    <div className="w-10 h-10 rounded-full bg-[--card] animate-pulse" />
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[--border] bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity">
            <Triangle className="w-5 h-5 fill-white" />
            <span>Vercel Store</span>
          </Link>

          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-[--muted] hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/search"
              className="text-sm text-[--muted] hover:text-white transition-colors"
            >
              All Products
            </Link>
          </nav>

          {/* Cart */}
          <div className="flex items-center gap-2">
            <Suspense fallback={<CartIconSkeleton />}>
              <CartIcon />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
