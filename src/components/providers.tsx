"use client";

import { StockProvider } from "@/lib/stock-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <StockProvider>{children}</StockProvider>;
}
