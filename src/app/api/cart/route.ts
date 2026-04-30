import { getCartToken } from "@/lib/cart-actions";
import { fetchCart } from "@/lib/api";

export async function GET() {
  const token = await getCartToken();
  if (!token) return Response.json(null);
  const cart = await fetchCart(token);
  return Response.json(cart ?? null);
}
