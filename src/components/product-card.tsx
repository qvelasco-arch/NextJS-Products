import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-[--card] border border-[--border] rounded-xl overflow-hidden hover:border-zinc-600 hover:bg-[--card-hover] transition-all duration-200"
    >
      <div className="relative aspect-square bg-zinc-900 overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IGZpbGw9IiMxODE4MWIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48L3N2Zz4="
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[--muted]">
            No image
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1">
        <p className="text-xs text-[--muted] uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="text-sm font-medium leading-snug group-hover:text-white transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm font-semibold mt-1">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
