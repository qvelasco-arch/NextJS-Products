import { connection } from "next/server";
import { fetchStock } from "@/lib/api";
import { AddToCartButton } from "@/components/add-to-cart-button";

interface AddToCartSectionProps {
  productId: string;
}

export async function AddToCartSection({ productId }: AddToCartSectionProps) {
  await connection();
  const stock = await fetchStock(productId);

  return (
    <div className="border-t border-[--border] pt-6">
      <AddToCartButton
        productId={productId}
        maxStock={stock?.stock ?? 0}
        inStock={stock?.inStock ?? false}
      />
    </div>
  );
}

export function AddToCartSectionSkeleton() {
  return (
    <div className="border-t border-[--border] pt-6 space-y-4">
      <div className="h-5 w-36 bg-zinc-800 rounded animate-pulse" />
      <div className="h-11 w-full bg-zinc-800 rounded-lg animate-pulse" />
    </div>
  );
}
