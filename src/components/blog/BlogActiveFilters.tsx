"use client";
import { useBlogFilters } from "@/hooks/useBlogFilters";

const BlogActiveFilters = () => {
  const {
    blogSearchTerm,
    setBlogSearchTerm,
    blogSelectedCategory,
    setBlogSelectedCategory,
    blogSelectedTags,
    setBlogSelectedTags,
    clearAllBlogFilters,
  } = useBlogFilters();

  const hasActiveFilters =
    blogSearchTerm || blogSelectedCategory || blogSelectedTags.length > 0;

  if (!hasActiveFilters) return null;

  const removeTag = (tag: string) => {
    setBlogSelectedTags(blogSelectedTags.filter((t: string) => t !== tag));
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h6 className="font-semibold text-gray-700">Active Filters:</h6>
        <button
          onClick={clearAllBlogFilters}
          className="text-sm text-zPink hover:text-zPink/80 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {blogSearchTerm && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm">
            <span className="text-gray-600">Search:</span>
            <span className="font-medium">{blogSearchTerm}</span>
            <button
              onClick={() => setBlogSearchTerm("")}
              className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Remove search filter"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        )}

        {blogSelectedCategory && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium">{blogSelectedCategory}</span>
            <button
              onClick={() => setBlogSelectedCategory("")}
              className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Remove category filter"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        )}

        {blogSelectedTags.map((tag: string) => (
          <div
            key={tag}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm"
          >
            <span className="text-gray-600">Tag:</span>
            <span className="font-medium capitalize">{tag}</span>
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={`Remove ${tag} tag filter`}
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogActiveFilters;
