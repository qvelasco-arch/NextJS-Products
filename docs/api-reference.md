# API Reference — Vercel Swag Store

Referencia técnica de la API externa que consume este proyecto: endpoints, estructuras de datos y la razón detrás de cada decisión de diseño.

---

## Conexión

```
Base URL:  https://vercel-swag-store-api.vercel.app/api
Auth:      x-vercel-protection-bypass: <token>  (header en cada request)
```

El token de bypass se guarda en `.env.local` como `API_BYPASS_TOKEN`. Se inyecta en todos los fetches desde `lib/api.ts` vía el objeto `headers` compartido — no se expone al cliente.

---

## Endpoints

### Productos

| Método | Path | Descripción |
|--------|------|-------------|
| `GET` | `/products` | Lista paginada. Params: `page`, `limit`, `category`, `search`, `featured` |
| `GET` | `/products/{slug}` | Producto individual por slug (o id) |
| `GET` | `/products/{id}/stock` | Stock en tiempo real de un producto |

**¿Por qué stock es un endpoint separado?**
Los datos del producto (nombre, precio, descripción) cambian raramente → se pueden cachear horas o días. El stock cambia con cada compra → necesita `cache: "no-store"`. Si stock estuviera dentro del producto, no podríamos cachear nada. Separarlo permite aplicar estrategias de caché distintas a cada parte.

### Categorías y Promociones

| Método | Path | Descripción |
|--------|------|-------------|
| `GET` | `/categories` | Lista de categorías con `productCount` |
| `GET` | `/promotions` | Promoción activa actual (si existe) |

### Carrito

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/cart/create` | Crea un carrito nuevo. Devuelve `x-cart-token` en el **header** de respuesta |
| `GET` | `/cart` | Ver carrito. Requiere `x-cart-token` en el header |
| `POST` | `/cart` | Agregar ítem `{ productId, quantity }` |
| `PATCH` | `/cart/{productId}` | Actualizar cantidad `{ quantity }` |
| `DELETE` | `/cart/{productId}` | Eliminar ítem |

**¿Por qué el token está en el header de respuesta de `/cart/create` y no en el body?**
Es una convención de APIs de carrito sin autenticación: el token es una credencial de sesión, no un dato de negocio. Ponerlo en el header lo separa semánticamente del `data` del response. En el proyecto, `createCart()` lo captura con `res.headers.get("x-cart-token")`.

**¿Por qué un token en cookie y no un carrito en localStorage?**
La cookie es HTTP-only — JavaScript del cliente no puede leerla ni robarla (XSS). El Server Component y los Server Actions la leen directamente desde el servidor con `cookies()` de Next.js, sin pasar por el cliente.

---

## Estructuras de datos

### `ApiResponse<T>`

Todas las respuestas envuelven su payload en este formato:

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    pagination: PaginationMeta;
  };
}
```

**¿Por qué un wrapper genérico?**
Permite que el cliente siempre sepa dónde está el dato (`data`) y los metadatos (`meta.pagination`), sin importar el endpoint. Alternativa sin wrapper: cada endpoint tiene su propia forma de respuesta → más código de normalización en el cliente.

### `Product`

```ts
interface Product {
  id: string;
  slug: string;        // URL-friendly: "vercel-cap-black"
  name: string;
  description: string;
  price: number;       // en centavos: 3000 = $30.00
  currency: string;    // "USD"
  category: string;
  images: string[];    // URLs absolutas
  tags: string[];
  featured: boolean;
  createdAt: string;
}
```

**¿Por qué `price` en centavos?**
Los números de punto flotante en JavaScript no representan decimales exactamente: `0.1 + 0.2 = 0.30000000000000004`. Usar enteros (centavos) elimina ese problema por completo. `formatPrice()` en `lib/utils.ts` convierte a string con `Intl.NumberFormat` solo para mostrar.

**¿Por qué `slug` además de `id`?**
El `slug` es legible por humanos y estable → sirve como URL (`/products/vercel-cap-black`) y para SEO. El `id` es opaco (UUID) → se usa internamente para referencias en el carrito y stock, donde la legibilidad no importa.

### `StockInfo`

```ts
interface StockInfo {
  productId: string;
  stock: number;       // cantidad exacta
  inStock: boolean;    // true si stock > 0
  lowStock: boolean;   // true si stock <= umbral bajo (definido por la API)
}
```

La API devuelve tanto el booleano `inStock` como el número `stock`. Los componentes usan `inStock` para el caso binario (mostrar/ocultar botón) y `stock` para el mensaje de cantidad. `lowStock` ya viene calculado por la API, así la lógica del umbral vive en un solo lugar.

### `Cart` y `CartItem`

```ts
interface CartItem {
  productId: string;
  quantity: number;
  product: Product;    // embebido — no requiere fetch adicional
  lineTotal: number;   // price × quantity, ya calculado
  addedAt: string;
}

interface Cart {
  token: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;    // suma de lineTotals
  currency: string;
  createdAt: string;
  updatedAt: string;
}
```

**¿Por qué `product` está embebido en `CartItem`?**
Sin embedding, para renderizar el carrito necesitarías: 1 fetch del carrito + N fetches de productos (uno por ítem) → problema N+1 clásico. Con embedding, un solo `GET /cart` devuelve todo lo necesario para renderizar la página completa.

**¿Por qué `lineTotal` y `subtotal` vienen de la API y no se calculan en el cliente?**
Evita inconsistencias si el precio de un producto cambia mientras el carrito está abierto. El servidor siempre tiene el precio correcto. Además, si se implementan descuentos o cupones, la lógica vive en un solo lugar.

### `PaginationMeta`

```ts
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

Los booleanos `hasNextPage` / `hasPreviousPage` son redundantes (se pueden derivar de `page` y `totalPages`), pero los incluye la API para comodidad del cliente — evitan cálculos en el componente de paginación.

---

## Decisiones de caché por endpoint

| Endpoint | Estrategia | Razón |
|----------|------------|-------|
| `/products` | `"use cache"` + perfil `products` (revalida c/1 min) | Cambia poco, pero puede actualizarse con nuevos productos |
| `/products/{slug}` | `"use cache"` + perfil `catalog` (revalida c/1 hora) | Datos de producto muy estables |
| `/products/{id}/stock` | `cache: "no-store"` + `React.cache()` | Debe ser tiempo real; `React.cache()` evita fetches duplicados en el mismo render |
| `/categories` | `"use cache"` + perfil `catalog` | Cambia rarísimo |
| `/promotions` | `"use cache"` + perfil `promotions` (revalida c/1 seg) | Necesita propagarse rápido pero sigue siendo cacheable |
| `/cart/*` | `cache: "no-store"` | Dato personal, siempre debe ser fresco |
