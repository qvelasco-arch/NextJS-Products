import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import type {
  Product,
  Category,
  Promotion,
  StockInfo,
  Cart,
  ApiResponse,
  PaginationMeta,
} from "./types";

const BASE_URL = process.env.API_BASE_URL!;
const BYPASS_TOKEN = process.env.API_BYPASS_TOKEN!;

const headers = {
  "x-vercel-protection-bypass": BYPASS_TOKEN,
  "Content-Type": "application/json",
};

// ─── Cached fetchers (stable data) ───────────────────────────────────────────

export async function fetchFeaturedProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("products");

  const res = await fetch(`${BASE_URL}/products?featured=true&limit=6`, {
    headers,
  });
  const json: ApiResponse<Product[]> = await res.json();
  return json.data;
}

export async function fetchProducts(params?: {
  search?: string;
  category?: string;
  limit?: number;
  page?: number;
}): Promise<{ products: Product[]; pagination: PaginationMeta }> {
  "use cache";
  cacheTag("products");
  cacheLife("products");

  const url = new URL(`${BASE_URL}/products`);
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.page) url.searchParams.set("page", String(params.page));

  const res = await fetch(url.toString(), { headers });
  const json: ApiResponse<Product[]> = await res.json();
  return { products: json.data, pagination: json.meta!.pagination };
}

export async function fetchProduct(slug: string): Promise<Product | null> {
  "use cache";
  cacheTag(`product-${slug}`);
  cacheLife("catalog");

  const res = await fetch(`${BASE_URL}/products/${slug}`, { headers });
  if (!res.ok) return null;
  const json: ApiResponse<Product> = await res.json();
  return json.data;
}

export async function fetchAllProductSlugs(): Promise<string[]> {
  "use cache";
  cacheTag("products");
  cacheLife("catalog");

  const res = await fetch(`${BASE_URL}/products?limit=100`, { headers });
  const json: ApiResponse<Product[]> = await res.json();
  return json.data.map((p) => p.slug);
}

export async function fetchCategories(): Promise<Category[]> {
  "use cache";
  cacheTag("categories");
  cacheLife("catalog");

  const res = await fetch(`${BASE_URL}/categories`, { headers });
  const json: ApiResponse<Category[]> = await res.json();
  return json.data;
}

export async function fetchPromotion(): Promise<Promotion | null> {
  "use cache";
  cacheTag("promotions");
  cacheLife("promotions");

  const res = await fetch(`${BASE_URL}/promotions`, { headers });
  if (!res.ok) return null;
  const json: ApiResponse<Promotion> = await res.json();
  return json.data?.active ? json.data : null;
}

// ─── Dynamic fetchers (no cache — real-time data) ────────────────────────────

export const fetchStock = cache(async (productId: string): Promise<StockInfo | null> => {
  const res = await fetch(`${BASE_URL}/products/${productId}/stock`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json: ApiResponse<StockInfo> = await res.json();
  return json.data;
});

export async function fetchCart(token: string): Promise<Cart | null> {
  const res = await fetch(`${BASE_URL}/cart`, {
    headers: { ...headers, "x-cart-token": token },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json: ApiResponse<Cart> = await res.json();
  return json.data;
}

export async function createCart(): Promise<string | null> {
  const res = await fetch(`${BASE_URL}/cart/create`, {
    method: "POST",
    headers,
    cache: "no-store",
  });
  return res.headers.get("x-cart-token");
}

export async function addCartItem(
  token: string,
  productId: string,
  quantity: number
): Promise<Cart | null> {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: { ...headers, "x-cart-token": token },
    body: JSON.stringify({ productId, quantity }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json: ApiResponse<Cart> = await res.json();
  return json.data;
}

export async function updateCartItem(
  token: string,
  productId: string,
  quantity: number
): Promise<Cart | null> {
  const res = await fetch(`${BASE_URL}/cart/${productId}`, {
    method: "PATCH",
    headers: { ...headers, "x-cart-token": token },
    body: JSON.stringify({ quantity }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json: ApiResponse<Cart> = await res.json();
  return json.data;
}

export async function removeCartItem(
  token: string,
  productId: string
): Promise<Cart | null> {
  const res = await fetch(`${BASE_URL}/cart/${productId}`, {
    method: "DELETE",
    headers: { ...headers, "x-cart-token": token },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json: ApiResponse<Cart> = await res.json();
  return json.data;
}
