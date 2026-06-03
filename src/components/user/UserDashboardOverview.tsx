"use client";

import Link from "next/link";

import { DashboardOrder, DashboardStats } from "@/types";

interface UserDashboardOverviewProps {
  stats: DashboardStats;
  loyaltyPoints: number;
  orders: DashboardOrder[];
  onViewAllOrders: () => void;
  onViewFavorites: () => void;
  onOpenOrderDetails: (order: DashboardOrder) => void;
}

const statusClassName = (status: DashboardOrder["status"]) => {
  if (status === "delivered") {
    return "bg-green-100 text-green-600";
  }

  if (status === "pending") {
    return "bg-yellow-100 text-yellow-600";
  }

  return "bg-blue-100 text-blue-600";
};

const UserDashboardOverview = ({
  stats,
  loyaltyPoints,
  orders,
  onViewAllOrders,
  onViewFavorites,
  onOpenOrderDetails,
}: UserDashboardOverviewProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-zPink/10 rounded-xl flex items-center justify-center text-zPink text-lg group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-shopping-bag"></i>
            </div>
            <span className="text-2xl font-bold text-stone-900">
              {stats.totalOrders}
            </span>
          </div>
          <h3 className="text-stone-500 font-medium text-sm">Total Orders</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-green-600 text-lg group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-dollar-sign"></i>
            </div>
            <span className="text-2xl font-bold text-stone-900">
              ${(stats.totalSpent || 0).toFixed(2)}
            </span>
          </div>
          <h3 className="text-stone-500 font-medium text-sm">Total Spent</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 group lg:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center text-zOrange text-lg group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-star"></i>
            </div>
            <span className="text-2xl font-bold text-stone-900">
              {loyaltyPoints}
            </span>
          </div>
          <h3 className="text-stone-500 font-medium text-sm">Loyalty Points</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-primary font-bold text-stone-900">Recent Orders</h2>
          <button
            onClick={onViewAllOrders}
            className="text-zPink hover:text-pink-700 font-semibold text-sm flex items-center gap-1.5 transition-colors"
          >
            View All
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
        </div>

        <div className="space-y-3">
          {orders.slice(0, 3).map((order) => (
            <div
              key={order._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#f8f5f2] rounded-xl hover:bg-stone-100 transition-all duration-300 cursor-pointer border border-stone-100"
              onClick={() => onOpenOrderDetails(order)}
            >
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-zPink shadow-sm">
                  <i className="fa-solid fa-receipt text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    {order.orderNumber}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()} •{" "}
                    {order.items.length} items
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusClassName(
                    order.status,
                  )}`}
                >
                  {order.status.toUpperCase()}
                </span>
                <span className="font-bold text-stone-900 text-sm">
                  ${(order.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-10">
              <i className="fa-solid fa-box-open text-4xl text-stone-300 mb-3 block"></i>
              <p className="text-stone-500">No orders found yet</p>
              <Link
                href="/menu"
                className="text-zPink font-semibold mt-2 inline-block hover:underline"
              >
                Order something delicious!
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-linear-to-br from-gray-900 via-gray-900 to-black rounded-2xl p-8 text-white shadow-xl border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-8 w-24 h-24 bg-zPink rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 left-8 w-20 h-20 bg-zOrange rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-primary font-bold mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/menu"
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-zPink/30 transition-all duration-300 text-center group"
            >
              <i className="fa-solid fa-utensils text-2xl mb-3 text-zPink group-hover:scale-110 transition-transform duration-300 block"></i>
              <p className="font-medium text-sm text-gray-200">Browse Menu</p>
            </Link>
            <Link
              href="/reservation"
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-zPink/30 transition-all duration-300 text-center group"
            >
              <i className="fa-solid fa-calendar text-2xl mb-3 text-zOrange group-hover:scale-110 transition-transform duration-300 block"></i>
              <p className="font-medium text-sm text-gray-200">Make Reservation</p>
            </Link>
            <button
              onClick={onViewFavorites}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-zPink/30 transition-all duration-300 text-center group"
            >
              <i className="fa-solid fa-heart text-2xl mb-3 text-red-400 group-hover:scale-110 transition-transform duration-300 block"></i>
              <p className="font-medium text-sm text-gray-200">My Favorites</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardOverview;
