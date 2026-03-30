import { connection } from "next/server";
import { fetchStock } from "@/lib/api";

interface StockIndicatorProps {
  productId: string;
}

export async function StockIndicator({ productId }: StockIndicatorProps) {
  await connection();
  const stock = await fetchStock(productId);

  if (!stock) {
    return (
      <div className="flex items-center gap-2 text-sm text-[--muted]">
        <span className="w-2 h-2 rounded-full bg-zinc-600" />
        Stock unavailable
      </div>
    );
  }

  if (!stock.inStock) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-400">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        Out of stock
      </div>
    );
  }

  if (stock.lowStock) {
    return (
      <div className="flex items-center gap-2 text-sm text-amber-400">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        Low stock — only {stock.stock} left
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-400">
      <span className="w-2 h-2 rounded-full bg-green-400" />
      In stock ({stock.stock} available)
    </div>
  );
}

export function StockIndicatorSkeleton() {
  return <div className="h-5 w-36 bg-zinc-800 rounded animate-pulse" />;
}
