import { fetchPromotion } from "@/lib/api";
import { Tag } from "lucide-react";

export async function PromotionalBanner() {
  const promo = await fetchPromotion();

  if (!promo) return null;

  return (
    <div className="w-full bg-white text-black py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 shrink-0" />
          <span className="font-semibold text-sm">{promo.title}</span>
        </div>
        <span className="text-sm text-zinc-600 hidden sm:block">—</span>
        <span className="text-sm text-zinc-700">{promo.description}</span>
        {promo.code && (
          <span className="inline-flex items-center gap-1 bg-black text-white text-xs font-mono px-2.5 py-1 rounded-full">
            {promo.code}
          </span>
        )}
      </div>
    </div>
  );
}

export function PromotionalBannerSkeleton() {
  return <div className="w-full h-12 bg-zinc-900 animate-pulse" />;
}
