"use client";

import Image from "next/image";
import Link from "next/link";

import { DashboardFavoriteItem } from "@/types";

interface UserDashboardFavoritesProps {
  favorites: DashboardFavoriteItem[];
}

const UserDashboardFavorites = ({ favorites }: UserDashboardFavoritesProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Most Ordered Items
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((item) => (
          <div
            key={item._id}
            className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
          >
            <div className="h-64 bg-gray-200 overflow-hidden">
              <Image
                src={item.image || "/assets/img/dish-1.png"}
                alt={item.name}
                width={400}
                height={256}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <span className="text-xs font-medium text-zPink bg-pink-50 px-3 py-1 rounded-full w-fit">
                {item.category}
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">
                {item.name}
              </h3>
              <div className="flex items-center justify-between mt-auto pt-4">
                <span className="text-2xl font-black text-zPink">
                  ${item.price ? item.price.toFixed(2) : "0.00"}
                </span>
                <Link
                  href={`/shop/${item.slug || item._id}`}
                  className="px-6 py-2.5 bg-zPink text-white rounded-xl hover:bg-pink-600 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-pink-200"
                >
                  Order Again
                </Link>
              </div>
            </div>
          </div>
        ))}
        {favorites.length === 0 && (
          <div className="col-span-full text-center py-12">
            <i className="fa-solid fa-heart-crack text-6xl text-gray-200 mb-4 block"></i>
            <h3 className="text-xl font-bold text-gray-900">
              No favorites yet
            </h3>
            <p className="text-gray-500 mt-2">
              Your most ordered items will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardFavorites;
