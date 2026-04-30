"use client";

import { createContext, useCallback, useContext, useRef } from "react";

type StockContextType = {
  getStock: (productId: string) => number | undefined;
  setStock: (productId: string, stock: number) => void;
};

const StockContext = createContext<StockContextType | null>(null);

export function StockProvider({ children }: { children: React.ReactNode }) {
  const stockRef = useRef<Record<string, number>>({});

  const getStock = useCallback((productId: string) => stockRef.current[productId], []);
  const setStock = useCallback((productId: string, stock: number) => {
    stockRef.current[productId] = stock;
  }, []);

  return (
    <StockContext.Provider value={{ getStock, setStock }}>
      {children}
    </StockContext.Provider>
  );
}

export function usePageStock() {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error("usePageStock must be used inside StockProvider");
  return ctx;
}
