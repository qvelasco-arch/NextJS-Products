import { fetchFeaturedProducts } from "@/lib/api";
import { ProductCard } from "@/components/product-card";

export async function FeaturedProducts() {
  const products = await fetchFeaturedProducts();

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Featured</h2>
        <a
          href="/search"
          className="text-sm text-[--muted] hover:text-white transition-colors"
        >
          View all →
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function FeaturedProductsSkeleton() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-32 bg-zinc-800 rounded animate-pulse" />
        <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-[--border]">
            <div className="aspect-square bg-zinc-900 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
