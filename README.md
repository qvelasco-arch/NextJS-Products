# Vercel Swag Store

A demo e-commerce storefront built with Next.js 16 (App Router). Users can browse products, check real-time stock, and manage a shopping cart. No real payments are processed.

## Tech Stack

- **Next.js 16** — App Router, Server Components, Server Actions, `"use cache"`
- **React 19** — `useTransition`, `cache()`, portals
- **TypeScript**
- **Tailwind CSS v4**
- **Zod** — input validation on Server Actions
- **Lucide React** — icons
- **Vercel Analytics + Speed Insights**

## Features

- **Home page** — hero section, featured products, and promotional banner
- **Product listing** — paginated catalog with category and search filters
- **Product detail** — real-time stock indicator, editable quantity selector, Add to Cart
- **Cart drawer** — slides in from the header icon without leaving the page; supports editing and removing items inline
- **Stock-aware quantity selection** — quantity is always capped to available stock; recalculates after cart mutations
- **Smart Add to Cart** — if the item is already in the cart, subsequent adds set the quantity instead of accumulating

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── cart/route.ts          # Proxies cart data for client-side drawer
│   │   └── analytics/vitals/      # Web Vitals reporting endpoint
│   ├── cart/page.tsx              # Full cart page (direct URL access)
│   ├── products/[slug]/page.tsx   # Product detail page
│   ├── search/page.tsx            # Product listing with filters
│   └── page.tsx                   # Home page
├── components/
│   ├── cart/
│   │   ├── cart-drawer.tsx        # Slide-in cart drawer (client)
│   │   ├── cart-icon.tsx          # Server component — fetches cart count
│   │   ├── cart-icon-button.tsx   # Client wrapper — manages drawer state
│   │   ├── cart-item.tsx          # Individual cart item with controls
│   │   ├── cart-summary.tsx       # Order summary with checkout CTA
│   │   └── quantity-controls.tsx  # Editable +/- controls with trash button
│   ├── add-to-cart-button.tsx     # Client component — quantity + add action
│   ├── add-to-cart-section.tsx    # Server wrapper — fetches stock for button
│   ├── product-card.tsx           # Product card linking to detail page
│   ├── quantity-selector.tsx      # Reusable editable quantity input
│   ├── stock-indicator.tsx        # Real-time stock badge (Server Component)
│   └── ...                        # Header, footer, hero, search form, etc.
└── lib/
    ├── api.ts                     # All external API calls with cache strategies
    ├── cart-actions.ts            # Server Actions for cart mutations
    ├── types.ts                   # Shared TypeScript interfaces
    └── utils.ts                   # formatPrice and other helpers
```

## Caching Strategy

| Data | Strategy | Reason |
|------|----------|--------|
| Product list / detail | `"use cache"` + revalidate tags | Changes rarely |
| Stock | `cache: "no-store"` + `React.cache()` | Must be real-time; deduplicated per render |
| Cart | `cache: "no-store"` | Personal data, always fresh |
| Promotions | `"use cache"` + short TTL | Needs to propagate quickly |

## Getting Started

### Prerequisites

- Node.js 18+
- Access credentials for the Vercel Swag Store API

### Environment Variables

Create a `.env.local` file at the project root:

```env
API_BASE_URL=https://vercel-swag-store-api.vercel.app/api
API_BYPASS_TOKEN=your_token_here
```

### Installation

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## API Overview

The storefront consumes a hosted REST API. Key endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/products` | Paginated product list |
| `GET` | `/products/{slug}` | Single product by slug or id |
| `GET` | `/products/{id}/stock` | Real-time stock info |
| `GET` | `/categories` | Category list |
| `GET` | `/promotions` | Active promotions |
| `POST` | `/cart/create` | Create cart, returns token in header |
| `GET` | `/cart` | View cart (requires `x-cart-token`) |
| `POST` | `/cart` | Add item `{ productId, quantity }` |
| `PATCH` | `/cart/{productId}` | Update item quantity |
| `DELETE` | `/cart/{productId}` | Remove item |

The API token is stored in `.env.local` and injected server-side — it is never exposed to the client.

## Notes

- Prices are returned in cents (e.g. `3000` = `$30.00`) and formatted via `Intl.NumberFormat`
- Cart tokens expire after 24h of inactivity and are stored in an HTTP-only cookie
- This is a demo store — no real purchases are made
