import Link from "next/link";
import { getCartToken } from "@/lib/cart-actions";
import { fetchCart } from "@/lib/api";
import { ShoppingBag } from "lucide-react";

export async function CartIcon() {
  const token = await getCartToken();
  const cart = token ? await fetchCart(token) : null;
  const count = cart?.totalItems ?? 0;

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-[--card-hover] transition-colors"
      aria-label={`Cart (${count} items)`}
    >
      <ShoppingBag className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-white text-black rounded-full leading-none">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
