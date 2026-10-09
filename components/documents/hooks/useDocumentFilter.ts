"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RequestDocumentItem } from "../services";


export const ALL_CATEGORIES = "All";

export function useDocumentFilter(documents: RequestDocumentItem[]) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = useMemo(
    () => [ALL_CATEGORIES, ...new Set(documents.map((d) => d.category))],
    [documents],
  );

  const [activeCategory, setActiveCategory] = useState(() => {
    const fromUrl = searchParams.get("category");
    return fromUrl && categories.includes(fromUrl) ? fromUrl : ALL_CATEGORIES;
  });

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== ALL_CATEGORIES)
      params.set("category", activeCategory);
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());

    const next = params.toString();
    if (next === searchParams.toString()) return;

    router.replace(next ? `?${next}` : "?", { scroll: false });
  }, [activeCategory, debouncedQuery, router, searchParams]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return documents.filter((d) => {
      const matchesCategory =
        activeCategory === ALL_CATEGORIES || d.category === activeCategory;
      const matchesQuery =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [documents, activeCategory, debouncedQuery]);

  const counts = useMemo(() => {
    const result: Record<string, number> = {
      [ALL_CATEGORIES]: documents.length,
    };
    for (const d of documents)
      result[d.category] = (result[d.category] ?? 0) + 1;
    return result;
  }, [documents]);

  const reset = () => {
    setQuery("");
    setDebouncedQuery("");
    setActiveCategory(ALL_CATEGORIES);
  };

  return {
    categories,
    activeCategory,
    setActiveCategory,
    query,
    setQuery,
    filtered,
    counts,
    reset,
  };
}
