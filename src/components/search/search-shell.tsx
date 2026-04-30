"use client";

import { useTransition, type ReactNode } from "react";
import { SearchForm } from "./search-form";
import type { Category } from "@/lib/types";

function ResultsSkeleton() {
  return (
    <>
      <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden border border-[--border]"
          >
            <div className="aspect-square bg-zinc-900 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function SearchShell({
  categories,
  children,
}: {
  categories: Category[];
  children: ReactNode;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div className="mb-8">
        <SearchForm categories={categories} startTransition={startTransition} />
      </div>
      {isPending ? <ResultsSkeleton /> : children}
    </>
  );
}
