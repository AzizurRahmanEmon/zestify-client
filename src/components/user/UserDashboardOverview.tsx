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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-shopping-bag"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {stats.totalOrders}
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">Total Orders</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-dollar-sign"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              ${(stats.totalSpent || 0).toFixed(2)}
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">Total Spent</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-zPink to-pink-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-star"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {loyaltyPoints}
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">Loyalty Points</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
          <button
            onClick={onViewAllOrders}
            className="text-zPink hover:text-pink-600 font-medium text-sm"
          >
            View All →
          </button>
        </div>

        <div className="space-y-4">
          {orders.slice(0, 3).map((order) => (
            <div
              key={order._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer"
              onClick={() => onOpenOrderDetails(order)}
            >
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className="w-12 h-12 bg-zPink/10 rounded-xl flex items-center justify-center text-zPink">
                  <i className="fa-solid fa-receipt"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600">
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
                <span className="font-bold text-gray-900">
                  ${(order.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-8">
              <i className="fa-solid fa-box-open text-4xl text-gray-300 mb-3 block"></i>
              <p className="text-gray-500">No orders found yet</p>
              <Link
                href="/menu"
                className="text-zPink font-medium mt-2 inline-block"
              >
                Order something delicious!
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-linear-to-br from-zPink to-pink-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/menu"
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-300 text-center group"
          >
            <i className="fa-solid fa-utensils text-3xl mb-2 group-hover:scale-110 transition-transform duration-300"></i>
            <p className="font-medium">Browse Menu</p>
          </Link>
          <Link
            href="/reservation"
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-300 text-center group"
          >
            <i className="fa-solid fa-calendar text-3xl mb-2 group-hover:scale-110 transition-transform duration-300"></i>
            <p className="font-medium">Make Reservation</p>
          </Link>
          <button
            onClick={onViewFavorites}
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-300 text-center group"
          >
            <i className="fa-solid fa-heart text-3xl mb-2 group-hover:scale-110 transition-transform duration-300"></i>
            <p className="font-medium">My Favorites</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardOverview;
