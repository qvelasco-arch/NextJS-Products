# Vercel Swag Store — Technical Guide (10-20 min video)

## What is this project?

A demo e-commerce storefront built with Next.js 16 (App Router). Users can browse products, search by category, check real-time stock, and manage a shopping cart. No real payments are processed.

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, lucide-react.

---

## Folder Structure

```
src/
├── app/                  # Routes (App Router)
│   ├── layout.tsx        # Root layout — Header + Footer on every page
│   ├── page.tsx          # Home (/)
│   ├── products/[slug]/  # Product detail
│   ├── search/           # Search and filters
│   └── cart/             # Shopping cart
├── components/           # Reusable components
└── lib/
    ├── types.ts          # Domain TypeScript types
    ├── utils.ts          # formatPrice(), cn()
    ├── api.ts            # External API calls
    └── cart-actions.ts   # Cart Server Actions
```

---

## Data Layer

### Core Types (`lib/types.ts`)

| Type | Purpose |
|---|---|
| `Product` | Product with `price` in cents, `slug`, `images[]` |
| `Cart` | Cart with `token`, `items[]`, `subtotal` |
| `CartItem` | Item with embedded `product` and `lineTotal` |
| `StockInfo` | `inStock`, `lowStock`, `stock` (quantity) |
| `ApiResponse<T>` | Generic wrapper for all API responses |

### API Layer (`lib/api.ts`)

Cached functions (`"use cache"`) for stable data:
- `fetchFeaturedProducts()` — 6 featured products
- `fetchProducts(params?)` — paginated search and filtering
- `fetchProduct(slug)` — single product
- `fetchCategories()` — all categories

Uncached functions for real-time data:
- `fetchStock(productId)` — current stock level
- `fetchCart(token)` — user's cart

### Server Actions (`lib/cart-actions.ts`)

```ts
"use server"; // every function in this file runs on the server
```

- `getOrCreateToken()` — reads the `cart_token` cookie, or creates a new cart
- `addToCart(productId, quantity)` — adds item and calls `revalidatePath("/cart")`
- `updateQuantity(productId, quantity)` — updates quantity
- `removeFromCart(productId)` — removes item

The cart is identified by a token in an **HTTP-only cookie** — no login required.

---

## Architectural Patterns

### Server vs Client Components

| | Server Component | Client Component |
|---|---|---|
| Directive | (none — default) | `"use client"` |
| Can fetch data | ✅ directly | ❌ needs useEffect or Server Action |
| Can use useState | ❌ | ✅ |
| Can use onClick | ❌ | ✅ |
| JS sent to client | None | Yes |

**Rule:** push the `"use client"` boundary as far down the component tree as possible.

In this project: `SearchForm`, `AddToCartButton`, `CartQuantityControls`, and `CartSummary` are Client Components. Everything else is a Server Component.

### Suspense + Skeletons (Streaming)

```tsx
<Suspense fallback={<FeaturedProductsSkeleton />}>
  <FeaturedProducts />   {/* async — fetches data */}
</Suspense>
```

Without `Suspense`: the entire page waits for all fetches to finish.
With `Suspense`: the skeleton is sent immediately and the real content streams in when the fetch completes.

### Parallel Queries and Deduplication (N+1 Problem)

The N+1 problem: loading data sequentially when you could load it in parallel or with a single query.

**Parallel with `Promise.all`** — when two fetches are independent:

```ts
// search/page.tsx
const [{ products }, categories] = await Promise.all([
  fetchProducts(params),
  fetchCategories(),
]);
```

Without this: 400ms + 400ms = 800ms. With this: 400ms total.

**Deduplication with `React.cache()`** — when the same data is needed across multiple components in the same render:

```ts
// lib/api.ts
import { cache } from "react";

export const fetchStock = cache(async (productId: string) => { ... });
```

In `/products/[slug]`, both `StockIndicator` and `AddToCartSection` call `fetchStock(productId)` for the same product. Without `cache()`, that's 2 identical network requests. With `cache()`, the second component gets the result from memory — no network hit.

`React.cache()` creates a fresh memoization scope per server request, so there's no cross-user contamination.

---

### Caching Strategy

Three profiles defined in `next.config.ts`:

| Profile | stale | revalidate | expire | Used in |
|---|---|---|---|---|
| `products` | 5 min | 1 min | 1 hour | Product listings |
| `catalog` | 5 min | 1 hour | 1 day | Single product, categories |
| `promotions` | 30 sec | 1 sec | 1 min | Active promotion |

`stale` = the client uses the cached data without checking.
`revalidate` = after this time, the next request triggers a background refresh.
`expire` = absolute maximum lifetime.

---

## Key Pages

### `/products/[slug]` — Static Generation

```ts
export async function generateStaticParams() {
  const slugs = await fetchAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

Pre-generates all product pages at build time → near-instant response. Stock and the cart button are in separate `Suspense` boundaries because they use real-time data (no cache).

### `/search` — searchParams + Debounce

`SearchContent` is an async Server Component that reads `searchParams` (URL query params). `SearchForm` is a Client Component that updates the URL with `router.push()` after a 400ms debounce — that triggers a re-render of the Server Component with the new params.

### `/cart` — Optimistic UI

`CartQuantityControls` uses `useTransition()` to update the quantity on screen immediately while the Server Action runs in the background. `isPending` shows a spinner during the mutation.

---

## Configuration (`next.config.ts`)

```ts
{
  cacheComponents: true,   // enables "use cache" and cacheLife()
  cacheLife: { ... },      // custom profiles
  images: {
    remotePatterns: [...]   // authorized domains for next/image
  }
}
```
