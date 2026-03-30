import { Suspense } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import {
  FeaturedProducts,
  FeaturedProductsSkeleton,
} from "@/components/featured-products";
import {
  PromotionalBanner,
  PromotionalBannerSkeleton,
} from "@/components/promotional-banner";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Shop the official Vercel swag collection. Minimal gear for developers who ship.",
  openGraph: {
    title: "Vercel Swag Store",
    description:
      "Shop the official Vercel swag collection. Minimal gear for developers who ship.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      {/* Promotional Banner — cached with short TTL */}
      <Suspense fallback={<PromotionalBannerSkeleton />}>
        <PromotionalBanner />
      </Suspense>

      {/* Hero — fully static */}
      <Hero />

      {/* Featured Products — cached */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </div>
    </>
  );
}
