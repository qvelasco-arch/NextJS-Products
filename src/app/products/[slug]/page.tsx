import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { fetchProduct, fetchAllProductSlugs } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
  StockIndicator,
  StockIndicatorSkeleton,
} from "@/components/stock-indicator";
import {
  AddToCartSection,
  AddToCartSectionSkeleton,
} from "@/components/add-to-cart-section";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await fetchAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0]
        ? [{ url: product.images[0], width: 800, height: 800, alt: product.name }]
        : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[--muted] mb-8">
        <a href="/" className="hover:text-white transition-colors">
          Home
        </a>
        <span>/</span>
        <a href="/search" className="hover:text-white transition-colors">
          Products
        </a>
        <span>/</span>
        <span className="text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Image — static */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-[--border]">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IGZpbGw9IiMxODE4MWIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48L3N2Zz4="
              preload
            />
          )}
        </div>

        {/* Product Info — static */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs text-[--muted] uppercase tracking-widest mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
          </div>

          {/* Stock — dynamic, in Suspense */}
          <Suspense fallback={<StockIndicatorSkeleton />}>
            <StockIndicator productId={product.id} />
          </Suspense>

          <p className="text-sm text-[--muted] leading-relaxed">
            {product.description}
          </p>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-[--muted] border border-[--border] rounded-full px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Add to Cart — dynamic (needs stock), in Suspense */}
          <Suspense fallback={<AddToCartSectionSkeleton />}>
            <AddToCartSection productId={product.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
