"use client";

type Props = {
  shopSearchTerm: string;
  setShopSearchTerm: (v: string) => void;
  shopSelectedCategory: string;
  setShopSelectedCategory: (v: string) => void;
  shopSelectedTags: string[];
  setShopSelectedTags: (v: string[]) => void;
  shopMinPrice: number;
  shopMaxPrice: number;
  clearAllShopFilters: () => void;
};

const ActiveFilters = ({
  shopSearchTerm,
  setShopSearchTerm,
  shopSelectedCategory,
  setShopSelectedCategory,
  shopSelectedTags,
  setShopSelectedTags,
  shopMinPrice,
  shopMaxPrice,
  clearAllShopFilters,
}: Props) => {

  const hasActiveFilters =
    shopSearchTerm ||
    shopSelectedCategory ||
    shopSelectedTags.length > 0 ||
    shopMinPrice !== 6 ||
    shopMaxPrice !== 56;

  if (!hasActiveFilters) return null;

  const removeTag = (tag: string) => {
    setShopSelectedTags(shopSelectedTags.filter((t: string) => t !== tag));
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h6 className="font-semibold text-gray-700">Active Filters:</h6>
        <button
          onClick={clearAllShopFilters}
          className="text-sm text-zPink hover:text-zPink/80 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {shopSearchTerm && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm">
            <span className="text-gray-600">Search:</span>
            <span className="font-medium">{shopSearchTerm}</span>
            <button
              onClick={() => setShopSearchTerm("")}
              className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Remove search filter"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        )}

        {shopSelectedCategory && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium">{shopSelectedCategory}</span>
            <button
              onClick={() => setShopSelectedCategory("")}
              className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Remove category filter"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        )}

        {shopSelectedTags.map((tag: string) => (
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

        {(shopMinPrice !== 6 || shopMaxPrice !== 56) && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">
              ${shopMinPrice} - ${shopMaxPrice}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
