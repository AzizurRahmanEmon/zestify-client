"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const HeaderSearchForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (pathname === "/shop") {
      const urlSearch = searchParams?.get("search") || "";
      setSearchInput(urlSearch);
    } else {
      setSearchInput("");
    }
  }, [pathname, searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearch = searchInput.trim();
    if (trimmedSearch) {
      router.push(`/shop?search=${encodeURIComponent(trimmedSearch)}`);
    } else {
      router.push("/shop");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleClear = () => {
    setSearchInput("");
    if (pathname === "/shop") {
      router.push("/shop");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>;
      handleSubmit(syntheticEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-70 group"
      role="search"
      aria-label="Search"
    >
      <div className="relative flex items-center bg-gray-50/80 backdrop-blur-sm rounded-full border border-gray-200/60 transition-all duration-300 group-hover:border-gray-300 group-focus-within:border-pink-400 group-focus-within:shadow-lg group-focus-within:shadow-pink-400/10 group-focus-within:bg-white">
        <button
          type="submit"
          className="absolute left-4 text-gray-500 hover:text-zPink focus:outline-none focus:text-zPink transition-colors duration-200 z-10"
          aria-label="Submit search"
        >
          <i
            className="fa-solid fa-magnifying-glass text-sm"
            aria-hidden="true"
          ></i>
        </button>

        <input
          type="text"
          value={searchInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm rounded-full"
          autoComplete="off"
        />

        {searchInput && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            aria-label="Clear search"
          >
            <i className="fa-solid fa-xmark text-xs" aria-hidden="true"></i>
          </button>
        )}
      </div>
    </form>
  );
};

export default HeaderSearchForm;
