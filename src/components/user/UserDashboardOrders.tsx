"use client";

import Link from "next/link";

import { DashboardOrder } from "@/types";

interface UserDashboardOrdersProps {
  orders: DashboardOrder[];
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

const UserDashboardOrders = ({
  orders,
  onOpenOrderDetails,
}: UserDashboardOrdersProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {order.orderNumber}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`mt-2 sm:mt-0 px-4 py-2 rounded-full text-sm font-medium w-max ${statusClassName(
                  order.status,
                )}`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <p className="text-gray-600">{order.items.length} items</p>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </span>
                <button
                  onClick={() => onOpenOrderDetails(order)}
                  className="px-4 py-2 bg-zPink text-white rounded-lg hover:bg-pink-600 transition-colors duration-300 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <i className="fa-solid fa-receipt text-6xl text-gray-200 mb-4 block"></i>
            <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mt-2">
              When you make an order, it will appear here.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-block px-6 py-3 bg-zPink text-white rounded-xl font-bold hover:bg-pink-600 transition-all"
            >
              Start Ordering
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardOrders;
