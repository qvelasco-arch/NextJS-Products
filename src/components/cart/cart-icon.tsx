import { getCartToken } from "@/lib/cart-actions";
import { fetchCart } from "@/lib/api";
import { CartIconButton } from "@/components/cart/cart-icon-button";

export async function CartIcon() {
  const token = await getCartToken();
  const cart = token ? await fetchCart(token) : null;
  const count = cart?.totalItems ?? 0;

  return <CartIconButton count={count} />;
}
