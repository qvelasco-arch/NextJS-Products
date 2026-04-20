"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Category } from "@/lib/types";

interface SearchFormProps {
  categories: Category[];
  defaultQuery?: string;
  defaultCategory?: string;
}


export function SearchForm({
  categories,
  defaultQuery = "",
  defaultCategory = "",
}: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultQuery);
  const [category, setCategory] = useState(defaultCategory);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushSearch = useCallback(
    (q: string, cat: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) {
        params.set("q", q);
      } else {
        params.delete("q");
      }
      if (cat) {
        params.set("category", cat);
      } else {
        params.delete("category");
      }
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Auto-search when query ≥ 3 chars
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length >= 3 || query.length === 0) {
      debounceRef.current = setTimeout(() => {
        pushSearch(query, category);
      }, 400);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Search immediately on category change
  useEffect(() => {
    pushSearch(query, category);
  }, [category]);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    pushSearch(query, category);
  }

  function handleClear() {
    setQuery("");
    pushSearch("", category);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--muted]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-[--card] border border-[--border] rounded-lg text-white placeholder:text-[--muted] focus:outline-none focus:border-zinc-500 transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[--muted] hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filter */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="py-2.5 px-3 text-sm bg-[--card] border border-[--border] rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer min-w-[160px]"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name} ({cat.productCount})
          </option>
        ))}
      </select>

      {/* Search button */}
      <button
        type="submit"
        className="py-2.5 px-5 text-sm font-medium bg-white text-black rounded-lg hover:bg-zinc-100 transition-colors shrink-0"
      >
        Search
      </button>
    </form>
  );
}
