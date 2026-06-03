"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { DashboardFavoriteItem } from "@/types";

const FAVORITES_PER_PAGE = 6;

interface UserDashboardFavoritesProps {
  favorites: DashboardFavoriteItem[];
}

const UserDashboardFavorites = ({ favorites }: UserDashboardFavoritesProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(favorites.length / FAVORITES_PER_PAGE);
  const paginatedFavorites = favorites.slice(
    (currentPage - 1) * FAVORITES_PER_PAGE,
    currentPage * FAVORITES_PER_PAGE,
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-primary font-bold text-stone-900">
          Most Ordered Items
        </h2>
        {favorites.length > 0 && (
          <span className="text-sm text-stone-400">{favorites.length} items</span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {paginatedFavorites.map((item) => (
          <div
            key={item._id}
            className="bg-[#f8f5f2] rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col border border-stone-100"
          >
            <div className="h-56 bg-stone-200 overflow-hidden">
              <Image
                src={item.image || "/assets/img/dish-1.png"}
                alt={item.name}
                width={400}
                height={256}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col bg-white">
              <span className="text-[11px] font-semibold text-zPink bg-zPink/5 border border-zPink/10 px-3 py-1 rounded-full w-fit uppercase tracking-wide">
                {item.category}
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-3 mb-2">
                {item.name}
              </h3>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                <span className="text-xl font-black text-zPink">
                  ${item.price ? item.price.toFixed(2) : "0.00"}
                </span>
                <Link
                  href={`/shop/${item.slug || item._id}`}
                  className="px-5 py-2 bg-zPink text-white rounded-lg hover:bg-pink-700 transition-all duration-300 text-sm font-semibold"
                >
                  Order Again
                </Link>
              </div>
            </div>
          </div>
        ))}
        {favorites.length === 0 && (
          <div className="col-span-full text-center py-12">
            <i className="fa-solid fa-heart-crack text-5xl text-stone-200 mb-4 block"></i>
            <h3 className="text-lg font-bold text-stone-900">
              No favorites yet
            </h3>
            <p className="text-stone-500 mt-2">
              Your most ordered items will appear here automatically.
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 pt-5 border-t border-stone-100">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:border-zPink hover:text-zPink disabled:opacity-40 disabled:pointer-events-none transition-colors text-sm"
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                currentPage === page
                  ? "bg-zPink text-white"
                  : "border border-stone-200 text-stone-600 hover:border-zPink hover:text-zPink"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:border-zPink hover:text-zPink disabled:opacity-40 disabled:pointer-events-none transition-colors text-sm"
          >
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDashboardFavorites;
