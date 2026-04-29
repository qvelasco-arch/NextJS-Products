# Vercel Swag Store — Guía técnica (video 10-20 min)

## ¿Qué es este proyecto?

Tienda e-commerce de demostración construida con Next.js 16 (App Router). Permite navegar productos, buscar por categoría, ver stock en tiempo real y gestionar un carrito. No procesa pagos reales.

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, lucide-react.

---

## Estructura de carpetas

```
src/
├── app/                  # Rutas (App Router)
│   ├── layout.tsx        # Layout raíz — Header + Footer en todas las páginas
│   ├── page.tsx          # Inicio (/)
│   ├── products/[slug]/  # Detalle de producto
│   ├── search/           # Búsqueda y filtros
│   └── cart/             # Carrito
├── components/           # Componentes reutilizables
└── lib/
    ├── types.ts          # Tipos TypeScript del dominio
    ├── utils.ts          # formatPrice(), cn()
    ├── api.ts            # Llamadas a la API externa
    └── cart-actions.ts   # Server Actions del carrito
```

---

## Capa de datos

### Tipos principales (`lib/types.ts`)

| Tipo | Uso |
|---|---|
| `Product` | Producto con `price` en centavos, `slug`, `images[]` |
| `Cart` | Carrito con `token`, `items[]`, `subtotal` |
| `CartItem` | Ítem con `product` embebido y `lineTotal` |
| `StockInfo` | `inStock`, `lowStock`, `stock` (cantidad) |
| `ApiResponse<T>` | Wrapper genérico de todas las respuestas de la API |

### API layer (`lib/api.ts`)

Funciones con caché (`"use cache"`) para datos estables:
- `fetchFeaturedProducts()` — 6 productos destacados
- `fetchProducts(params?)` — búsqueda/filtrado paginado
- `fetchProduct(slug)` — producto individual
- `fetchCategories()` — todas las categorías

Funciones sin caché para datos en tiempo real:
- `fetchStock(productId)` — stock actual
- `fetchCart(token)` — carrito del usuario

### Server Actions (`lib/cart-actions.ts`)

```ts
"use server"; // todas las funciones del archivo corren en el servidor
```

- `getOrCreateToken()` — lee la cookie `cart_token`, o crea un carrito nuevo
- `addToCart(productId, quantity)` — agrega ítem y llama `revalidatePath("/cart")`
- `updateQuantity(productId, quantity)` — actualiza cantidad
- `removeFromCart(productId)` — elimina ítem

El carrito se identifica con un token en cookie **HTTP-only** — no requiere login.

---

## Patrones arquitectónicos

### Server vs Client Components

| | Server Component | Client Component |
|---|---|---|
| Directiva | (ninguna — por defecto) | `"use client"` |
| Puede hacer fetch | ✅ directamente | ❌ necesita useEffect o Server Action |
| Puede usar useState | ❌ | ✅ |
| Puede usar onClick | ❌ | ✅ |
| JS enviado al cliente | Ninguno | Sí |

**Regla:** empujar la frontera `"use client"` lo más abajo posible en el árbol.

En este proyecto: `SearchForm`, `AddToCartButton`, `CartQuantityControls` y `CartSummary` son Client Components. Todo lo demás es Server Component.

### Suspense + Skeletons (streaming)

```tsx
<Suspense fallback={<FeaturedProductsSkeleton />}>
  <FeaturedProducts />   {/* async — hace fetch */}
</Suspense>
```

Sin `Suspense`: la página entera espera a todos los fetches.
Con `Suspense`: se envía el skeleton inmediatamente y el contenido real llega en streaming cuando el fetch termina.

### Consultas paralelas y deduplicación (problema N+1)

El problema N+1: cargar datos secuencialmente cuando podrías hacerlo en paralelo o con una sola query.

**Paralelo con `Promise.all`** — cuando dos fetches son independientes:

```ts
// search/page.tsx
const [{ products }, categories] = await Promise.all([
  fetchProducts(params),
  fetchCategories(),
]);
```

Sin esto: 400ms + 400ms = 800ms. Con esto: 400ms total.

**Deduplicación con `React.cache()`** — cuando el mismo dato se necesita en múltiples componentes del mismo render:

```ts
// lib/api.ts
import { cache } from "react";

export const fetchStock = cache(async (productId: string) => { ... });
```

En `/products/[slug]`, `StockIndicator` y `AddToCartSection` ambos llaman `fetchStock(productId)` para el mismo producto. Sin `cache()`, son 2 requests idénticos. Con `cache()`, el segundo componente obtiene el resultado en memoria — sin tocar la red.

`React.cache()` crea un nuevo memoize por cada request de servidor, así que no hay contaminación entre usuarios.

---

### Estrategia de caché

Tres perfiles definidos en `next.config.ts`:

| Perfil | stale | revalidate | expire | Usado en |
|---|---|---|---|---|
| `products` | 5 min | 1 min | 1 hora | Listados de productos |
| `catalog` | 5 min | 1 hora | 1 día | Producto individual, categorías |
| `promotions` | 30 seg | 1 seg | 1 min | Promoción activa |

`stale` = el cliente usa el dato sin preguntar.
`revalidate` = después de este tiempo, la siguiente request dispara un refresh en background.
`expire` = máximo absoluto.

---

## Páginas clave

### `/products/[slug]` — Generación estática

```ts
export async function generateStaticParams() {
  const slugs = await fetchAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

Pre-genera todas las páginas de producto en build time → tiempo de respuesta casi instantáneo. Stock y botón de carrito están en `Suspense` separados porque usan datos en tiempo real (sin caché).

### `/search` — searchParams + debounce

`SearchContent` es un async Server Component que recibe `searchParams` (los query params de la URL). `SearchForm` es un Client Component que actualiza la URL con `router.push()` después de un debounce de 400ms — eso triggeriza una re-renderización del Server Component.

### `/cart` — optimistic UI

`CartQuantityControls` usa `useTransition()` para actualizar la cantidad en pantalla inmediatamente, mientras la Server Action corre en background. `isPending` muestra un spinner durante la mutación.

---

## Configuración (`next.config.ts`)

```ts
{
  cacheComponents: true,   // activa "use cache" y cacheLife()
  cacheLife: { ... },      // perfiles personalizados
  images: {
    remotePatterns: [...]   // dominios autorizados para next/image
  }
}
```
