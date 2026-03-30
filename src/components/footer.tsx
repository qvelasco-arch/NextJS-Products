import Link from "next/link";
import { Triangle } from "lucide-react";

export async function Footer() {
  "use cache";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[--border] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
            <Triangle className="w-4 h-4 fill-white" />
            <span>Vercel Store</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-xs text-[--muted] hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/search" className="text-xs text-[--muted] hover:text-white transition-colors">
              Products
            </Link>
            <Link href="/cart" className="text-xs text-[--muted] hover:text-white transition-colors">
              Cart
            </Link>
          </nav>

          <p className="text-xs text-[--muted]">
            &copy; {year} Vercel, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
