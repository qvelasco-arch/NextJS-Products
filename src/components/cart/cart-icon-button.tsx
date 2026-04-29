"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function CartIconButton({ count }: { count: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-[--card-hover] transition-colors"
        aria-label={`Cart (${count} items)`}
      >
        <ShoppingBag className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-white text-black rounded-full leading-none">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && <CartDrawer onClose={() => setOpen(false)} />}
    </>
  );
}
