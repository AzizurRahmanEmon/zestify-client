"use client";
import React, { useEffect } from "react";
import type { ChangeEvent } from "react";
import ProductCard from "./ProductCard";
import ShopSearchForm from "@/components/form/ShopSearchForm";
import { useShopFilters } from "@/hooks/useShopFilters";
import ActiveFilters from "./ActiveFilters";
import type { ProductDataType } from "@/types";
const productTags = [
  {
    id: 1,
    tag: "chicken",
  },
  {
    id: 2,
    tag: "healthy",
  },
  {
    id: 3,
    tag: "popular",
  },
  {
    id: 4,
    tag: "seafood",
  },
  {
    id: 5,
    tag: "spicy",
  },
  {
    id: 6,
    tag: "vegetarian",
  },
];
interface Props {
  products: ProductDataType[];
}
const ShopSection = ({ products }: Props) => {
  const {
    shopSearchTerm,
    setShopSearchTerm,
    shopSelectedCategory,
    setShopSelectedCategory,
    shopSelectedSort,
    setShopSelectedSort,
    shopSelectedTags,
    setShopSelectedTags,
    shopMinPrice,
    setShopMinPrice,
    shopMaxPrice,
    setShopMaxPrice,
    currentProducts,
    filteredProducts,
    categoryCount,
    shopCurrentPage,
    setShopCurrentPage,
    totalPages,
    indexOfFirstProduct,
    indexOfLastProduct,
    handleShopTagClick,
    clearAllShopFilters,
  } = useShopFilters(products);

  // Price filter slider
  useEffect(() => {
    updateSliderRange();
  }, [shopMinPrice, shopMaxPrice]);

  const updateSliderRange = () => {
    const min = 0;
    const max = 99;
    const percent1 = ((shopMinPrice - min) / (max - min)) * 100;
    const percent2 = ((shopMaxPrice - min) / (max - min)) * 100;

    const sliderRange = document.querySelector(".slider-range") as HTMLElement;
    if (sliderRange) {
      sliderRange.style.left = `${percent1}%`;
      sliderRange.style.width = `${percent2 - percent1}%`;
    }
  };

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value < shopMaxPrice) {
      setShopMinPrice(value);
    } else {
      setShopMinPrice(shopMaxPrice - 1);
    }
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value > shopMinPrice) {
      setShopMaxPrice(value);
    } else {
      setShopMaxPrice(shopMinPrice + 1);
    }
  };
  return (
    <section
      className="py-20 lg:py-30"
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container">
        <div className="flex flex-col-reverse lg:flex-row justify-between gap-12 overflow-hidden">
          {/* Filters Sidebar */}
          <div className="lg:max-w-75 w-full pt-5">
            {/* Search */}
            <div className="">
              <h5 className="text-xl font-semibold">Search</h5>
              <ShopSearchForm
                searchTerm={shopSearchTerm}
                setSearchTerm={setShopSearchTerm}
              />
            </div>

            {/* Categories */}
            <div className="mt-6">
              <h5 className="text-xl font-semibold">Categories</h5>
              <ul className="mt-6">
                {Object.entries(categoryCount).map(([category, count]) => (
                  <li
                    key={category}
                    onClick={() =>
                      setShopSelectedCategory(
                        shopSelectedCategory === category ? "" : category,
                      )
                    }
                    className={`flex items-center justify-between py-3 border-b border-[#DDDDDD] cursor-pointer hover:text-zPink ${
                      shopSelectedCategory === category ? "text-zPink" : ""
                    }`}
                  >
                    <h6>{category}</h6>
                    <h6>({count})</h6>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="mt-6">
              <h5 className="text-xl font-semibold">Filter by price</h5>
              <div className="mt-6 relative">
                <div className="rounded h-1 bg-zPink opacity-20 w-full absolute top-1/2 transform -translate-y-1/2"></div>
                <div className="slider-range rounded h-1 bg-red-500 absolute top-1/2 transform -translate-y-1/2"></div>
                <input
                  type="range"
                  min="0"
                  max="99"
                  value={shopMinPrice}
                  onChange={handleMinChange}
                  className="absolute -top-2 w-full appearance-none bg-transparent pointer-events-none"
                  id="min-range"
                />
                <input
                  type="range"
                  min="0"
                  max="99"
                  value={shopMaxPrice}
                  onChange={handleMaxChange}
                  className="absolute -top-2 w-full appearance-none bg-transparent pointer-events-none"
                  id="max-range"
                />
              </div>
              <h6 className="mt-10">
                <span className="text-lg font-semibold">Price</span> : $
                {shopMinPrice} - ${shopMaxPrice}
              </h6>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <h5 className="text-2xl font-semibold">Popular Tags</h5>
              <ul className="mt-6 flex flex-wrap gap-4">
                {productTags.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleShopTagClick(item.tag)}
                    className={`border rounded py-2 px-3 transition bg-white cursor-pointer ${
                      shopSelectedTags.includes(item.tag)
                        ? "border-zPink text-zPink"
                        : "text-textColor border-textColor hover:border-zPink hover:text-zPink"
                    }`}
                  >
                    {item.tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <ActiveFilters
              shopSearchTerm={shopSearchTerm}
              setShopSearchTerm={setShopSearchTerm}
              shopSelectedCategory={shopSelectedCategory}
              setShopSelectedCategory={setShopSelectedCategory}
              shopSelectedTags={shopSelectedTags}
              setShopSelectedTags={setShopSelectedTags}
              shopMinPrice={shopMinPrice}
              shopMaxPrice={shopMaxPrice}
              clearAllShopFilters={clearAllShopFilters}
            />

            {currentProducts.length > 0 && (
              <div className="flex items-center flex-col sm:flex-row sm:justify-between gap-6 justify-center">
                <h6 className="md:text-2xl text-xl font-semibold">
                  Showing {indexOfFirstProduct + 1}–
                  {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                  {filteredProducts.length} results
                </h6>
                <div className="relative max-w-57.5">
                  <select
                    value={shopSelectedSort}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setShopSelectedSort(e.target.value as any)
                    }
                    className="bg-transparent border border-[#797979] h-14 px-9 rounded-md outline-none focus:border-zPink w-full text-textColor pr-10 appearance-none"
                  >
                    <option value="">Sort By</option>
                    <option value="popularity">Popularity</option>
                    <option value="rating">Average Rating</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                  </select>
                  <div className="absolute top-1/2 -translate-y-1/2 right-5 text-textColor">
                    <i className="fa-solid fa-caret-down"></i>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-10 lg:mt-15">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <li key={product.slug}>
                    <ProductCard product={product} />
                  </li>
                ))
              ) : (
                <div className="font-semibold text-2xl text-textColor col-span-2">
                  <p>No items found matching your filters.</p>
                </div>
              )}
            </ul>

            {/* Pagination */}
            {totalPages > 0 && (
              <ul className="flex items-center justify-center gap-2 mt-10">
                <li>
                  <button
                    onClick={() =>
                      setShopCurrentPage(Math.max(shopCurrentPage - 1, 1))
                    }
                    disabled={shopCurrentPage === 1}
                    className="pagination-btn-2"
                  >
                    <i className="fa-solid fa-caret-left"></i>
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <li key={pageNum}>
                      <button
                        onClick={() => setShopCurrentPage(pageNum)}
                        className={`pagination-btn-2 ${
                          shopCurrentPage === pageNum ? "active" : ""
                        }`}
                      >
                        {pageNum}
                      </button>
                    </li>
                  ),
                )}
                <li>
                  <button
                    onClick={() =>
                      setShopCurrentPage(
                        Math.min(shopCurrentPage + 1, totalPages),
                      )
                    }
                    disabled={shopCurrentPage === totalPages}
                    className="pagination-btn-2"
                  >
                    <i className="fa-solid fa-caret-right"></i>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
