"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function CartIconButton({ count }: { count: number }) {
  const [open, setOpen] = useState(false);
  const [liveCount, setLiveCount] = useState(count);

  useEffect(() => { setLiveCount(count); }, [count]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-[--card-hover] transition-colors"
        aria-label={`Cart (${liveCount} items)`}
      >
        <ShoppingBag className="w-5 h-5" />
        {liveCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-white text-black rounded-full leading-none">
            {liveCount > 99 ? "99+" : liveCount}
          </span>
        )}
      </button>

      {open && (
        <CartDrawer
          onClose={() => setOpen(false)}
          onTotalItemsChange={setLiveCount}
        />
      )}
    </>
  );
}
