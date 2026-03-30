import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    products: {
      stale: 60 * 5,        // 5 min
      revalidate: 60,        // 1 min
      expire: 60 * 60,       // 1 hour
    },
    catalog: {
      stale: 60 * 5,        // 5 min
      revalidate: 60 * 60,  // 1 hour
      expire: 60 * 60 * 24, // 1 day
    },
    promotions: {
      stale: 30,             // 30 sec
      revalidate: 1,         // 1 sec
      expire: 60,            // 1 min
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i8qy5y6gxkdgdcv9.public.blob.vercel-storage.com",
        pathname: "/storefront/**",
      },
    ],
  },
};

export default nextConfig;
