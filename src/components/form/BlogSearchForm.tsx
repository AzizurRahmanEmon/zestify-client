"use client";
import { useBlogFilters } from "@/hooks/useBlogFilters";

const BlogSearchForm = () => {
  const { blogSearchTerm, searchbarOnchange } = useBlogFilters();

  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative">
      <input
        id="blogSearch"
        type="text"
        placeholder="Search posts..."
        aria-label="blogSearch"
        aria-required="true"
        value={blogSearchTerm}
        onChange={searchbarOnchange}
        className="w-full px-4 py-3 pr-12 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-Zpink/20 focus:bg-white transition-all duration-200"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-zPink text-white rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors duration-200"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
};

export default BlogSearchForm;
