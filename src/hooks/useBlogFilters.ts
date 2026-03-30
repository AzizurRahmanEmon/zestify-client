// hooks/useBlogFilters.ts
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useBlogFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get values from URL
  const blogSearchTerm = searchParams?.get("search") ?? "";
  const blogSelectedCategory = searchParams?.get("category") ?? "";
  const blogSelectedTags =
    searchParams?.get("tags")?.split(",").filter(Boolean) ?? [];
  const blogCurrentPage = parseInt(searchParams?.get("page") ?? "1");

  // Constants
  const postsPerPage = 8;

  // Update URL helper function
  const updateFilters = useCallback(
    (updates: Record<string, string | number | string[] | null>) => {
      const newParams = new URLSearchParams(searchParams?.toString() ?? "");

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === undefined) {
          newParams.delete(key);
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            newParams.delete(key);
          } else {
            newParams.set(key, value.join(","));
          }
        } else {
          newParams.set(key, String(value));
        }
      });

      const queryString = newParams.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
    },
    [searchParams, router, pathname],
  );

  // Individual setters
  const setBlogSearchTerm = useCallback(
    (value: string | ((prev: string) => string)) => {
      const newValue =
        typeof value === "function" ? value(blogSearchTerm) : value;
      updateFilters({ search: newValue, page: 1 });
    },
    [blogSearchTerm, updateFilters],
  );

  const setBlogSelectedCategory = useCallback(
    (value: string | ((prev: string) => string)) => {
      const newValue =
        typeof value === "function" ? value(blogSelectedCategory) : value;
      updateFilters({ category: newValue, page: 1 });
    },
    [blogSelectedCategory, updateFilters],
  );

  const setBlogSelectedTags = useCallback(
    (value: string[] | ((prev: string[]) => string[])) => {
      const newValue =
        typeof value === "function" ? value(blogSelectedTags) : value;
      updateFilters({ tags: newValue, page: 1 });
    },
    [blogSelectedTags, updateFilters],
  );

  const setBlogCurrentPage = useCallback(
    (value: number | ((prev: number) => number)) => {
      const newValue =
        typeof value === "function" ? value(blogCurrentPage) : value;
      updateFilters({ page: newValue });
    },
    [blogCurrentPage, updateFilters],
  );

  // Helper functions
  const toggleTag = useCallback(
    (tag: string) => {
      setBlogSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
      );
    },
    [setBlogSelectedTags],
  );

  const toggleCategory = useCallback(
    (category: string) => {
      setBlogSelectedCategory((prev) => (prev === category ? "" : category));
    },
    [setBlogSelectedCategory],
  );

  const toggleNextPage = useCallback(
    (index: number) => {
      setBlogCurrentPage(index + 1);
    },
    [setBlogCurrentPage],
  );

  const searchbarOnchange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBlogSearchTerm(e.target.value);
    },
    [setBlogSearchTerm],
  );
  const clearAllBlogFilters = useCallback(() => {
    router.push(pathname ?? "/");
  }, [router, pathname]);

  return {
    // Filter values
    blogSearchTerm,
    blogSelectedCategory,
    blogSelectedTags,
    blogCurrentPage,

    // Setters
    setBlogSearchTerm,
    setBlogSelectedCategory,
    setBlogSelectedTags,
    setBlogCurrentPage,

    // Helper functions
    toggleTag,
    toggleCategory,
    toggleNextPage,
    searchbarOnchange,
    clearAllBlogFilters,

    postsPerPage,
  };
};
