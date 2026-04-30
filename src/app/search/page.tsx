import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { SearchShell } from "@/components/search/search-shell";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse and search the full Vercel swag collection.",
  openGraph: {
    title: "All Products — Vercel Swag Store",
    description: "Browse and search the full Vercel swag collection.",
    url: "/search",
  },
};

interface SearchParams {
  q?: string;
  category?: string;
}

async function SearchPageContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "", category = "" } = await searchParams;
  const [{ products }, categories] = await Promise.all([
    fetchProducts({
      search: q || undefined,
      category: category || undefined,
      limit: q || category ? 5 : 20,
    }),
    fetchCategories(),
  ]);

  const results =
    products.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-lg font-medium mb-2">No products found</p>
        <p className="text-sm text-[--muted]">
          Try a different search term or category.
        </p>
      </div>
    ) : (
      <div>
        <p className="text-sm text-[--muted] mb-6">
          {q || category
            ? `${products.length} result${products.length !== 1 ? "s" : ""} found`
            : `Showing ${products.length} products`}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );

  return <SearchShell categories={categories}>{results}</SearchShell>;
}

function PageSkeleton() {
  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row gap-3">
        <div className="h-10 flex-1 bg-zinc-900 rounded-lg animate-pulse" />
        <div className="h-10 w-40 bg-zinc-900 rounded-lg animate-pulse" />
        <div className="h-10 w-24 bg-zinc-900 rounded-lg animate-pulse" />
      </div>
      <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden border border-[--border]"
          >
            <div className="aspect-square bg-zinc-900 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">All Products</h1>
        <p className="text-sm text-[--muted]">
          Browse and search our full collection of Vercel swag.
        </p>
      </div>
      <Suspense fallback={<PageSkeleton />}>
        <SearchPageContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
