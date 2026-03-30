import Image from "next/image";
import Link from "next/link";
import type { CartItem as CartItemType } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { CartQuantityControls } from "./quantity-controls";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { product, quantity, lineTotal } = item;

  return (
    <div className="flex gap-4 py-5 border-b border-[--border] last:border-0">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="shrink-0">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-900 border border-[--border]">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IGZpbGw9IiMxODE4MWIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48L3N2Zz4="
            />
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-medium hover:text-zinc-300 transition-colors truncate"
        >
          {product.name}
        </Link>
        <p className="text-xs text-[--muted] capitalize">{product.category}</p>
        <p className="text-xs text-[--muted]">{formatPrice(product.price)} each</p>
      </div>

      {/* Quantity + total */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <p className="text-sm font-semibold">{formatPrice(lineTotal)}</p>
        <CartQuantityControls
          productId={product.id}
          quantity={quantity}
        />
      </div>
    </div>
  );
}
