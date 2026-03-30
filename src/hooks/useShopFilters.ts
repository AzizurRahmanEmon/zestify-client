// hooks/useShopFilters.ts
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { ProductDataType } from "@/types";

type SortOption =
  | ""
  | "popularity"
  | "rating"
  | "price-low-high"
  | "price-high-low";

interface CategoryCount {
  [key: string]: number;
}

export const useShopFilters = (products: ProductDataType[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get values from URL
  const shopSearchTerm = searchParams?.get("search") ?? "";
  const shopSelectedCategory = searchParams?.get("category") ?? "";
  const shopSelectedSort = (searchParams?.get("sort") ?? "") as SortOption;
  const shopSelectedTags =
    searchParams?.get("tags")?.split(",").filter(Boolean) ?? [];
  const shopMinPrice = parseFloat(searchParams?.get("minPrice") ?? "6");
  const shopMaxPrice = parseFloat(searchParams?.get("maxPrice") ?? "56");
  const shopCurrentPage = parseInt(searchParams?.get("page") ?? "1");

  // Constants
  const productsPerPage = 9;

  // Calculate category counts
  const categoryCount: CategoryCount = useMemo(() => {
    return (products ?? []).reduce((acc: CategoryCount, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...(products ?? [])];

    if (shopSearchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(shopSearchTerm.toLowerCase()),
      );
    }

    if (shopSelectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === shopSelectedCategory,
      );
    }

    filtered = filtered.filter((product) => {
      const productPrice = product.price;
      return productPrice >= shopMinPrice && productPrice <= shopMaxPrice;
    });

    if (shopSelectedTags.length > 0) {
      filtered = filtered.filter((product) =>
        shopSelectedTags.some((tag) => product.tags.includes(tag)),
      );
    }

    if (shopSelectedSort) {
      switch (shopSelectedSort) {
        case "price-low-high":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-high-low":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating.stars - a.rating.stars);
          break;
        case "popularity":
          filtered.sort((a, b) => b.rating.reviews - a.rating.reviews);
          break;
      }
    }

    return filtered;
  }, [
    shopSearchTerm,
    shopSelectedCategory,
    shopSelectedTags,
    shopSelectedSort,
    shopMinPrice,
    shopMaxPrice,
    products,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = shopCurrentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

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
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [searchParams, router, pathname],
  );

  // Individual setters
  const setShopSearchTerm = useCallback(
    (value: string | ((prev: string) => string)) => {
      const newValue =
        typeof value === "function" ? value(shopSearchTerm) : value;
      updateFilters({ search: newValue, page: 1 });
    },
    [shopSearchTerm, updateFilters],
  );

  const setShopSelectedCategory = useCallback(
    (value: string | ((prev: string) => string)) => {
      const newValue =
        typeof value === "function" ? value(shopSelectedCategory) : value;
      updateFilters({ category: newValue, page: 1 });
    },
    [shopSelectedCategory, updateFilters],
  );

  const setShopSelectedSort = useCallback(
    (value: SortOption | ((prev: SortOption) => SortOption)) => {
      const newValue =
        typeof value === "function" ? value(shopSelectedSort) : value;
      updateFilters({ sort: newValue, page: 1 });
    },
    [shopSelectedSort, updateFilters],
  );

  const setShopSelectedTags = useCallback(
    (value: string[] | ((prev: string[]) => string[])) => {
      const newValue =
        typeof value === "function" ? value(shopSelectedTags) : value;
      updateFilters({ tags: newValue, page: 1 });
    },
    [shopSelectedTags, updateFilters],
  );

  const setShopMinPrice = useCallback(
    (value: number | ((prev: number) => number)) => {
      const newValue =
        typeof value === "function" ? value(shopMinPrice) : value;
      updateFilters({ minPrice: newValue, page: 1 });
    },
    [shopMinPrice, updateFilters],
  );

  const setShopMaxPrice = useCallback(
    (value: number | ((prev: number) => number)) => {
      const newValue =
        typeof value === "function" ? value(shopMaxPrice) : value;
      updateFilters({ maxPrice: newValue, page: 1 });
    },
    [shopMaxPrice, updateFilters],
  );

  const setShopCurrentPage = useCallback(
    (value: number | ((prev: number) => number)) => {
      const newValue =
        typeof value === "function" ? value(shopCurrentPage) : value;
      updateFilters({ page: newValue });
    },
    [shopCurrentPage, updateFilters],
  );

  // Helper functions
  const handleShopTagClick = useCallback(
    (tag: string) => {
      setShopSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
      );
    },
    [setShopSelectedTags],
  );

  const clearAllShopFilters = useCallback(() => {
    router.push(pathname ?? "/", { scroll: false });
  }, [router, pathname]);
  return {
    // Filter values
    shopSearchTerm,
    shopSelectedCategory,
    shopSelectedSort,
    shopSelectedTags,
    shopMinPrice,
    shopMaxPrice,
    shopCurrentPage,

    // Setters
    setShopSearchTerm,
    setShopSelectedCategory,
    setShopSelectedSort,
    setShopSelectedTags,
    setShopMinPrice,
    setShopMaxPrice,
    setShopCurrentPage,

    // Helper functions
    handleShopTagClick,
    clearAllShopFilters,

    // Computed values
    filteredProducts,
    currentProducts,
    categoryCount,
    totalPages,
    productsPerPage,
    indexOfFirstProduct,
    indexOfLastProduct,
  };
};
