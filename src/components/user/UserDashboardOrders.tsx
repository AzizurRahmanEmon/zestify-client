"use client";

import { useState } from "react";
import Link from "next/link";

import { DashboardOrder } from "@/types";

const ORDERS_PER_PAGE = 5;

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
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-primary font-bold text-stone-900">Order History</h2>
        {orders.length > 0 && (
          <span className="text-sm text-stone-400">{orders.length} total</span>
        )}
      </div>
      <div className="space-y-4">
        {paginatedOrders.map((order) => (
          <div
            key={order._id}
            className="border border-stone-100 rounded-xl p-5 hover:shadow-md hover:border-stone-200 transition-all duration-300 bg-[#f8f5f2]/50"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  {order.orderNumber}
                </h3>
                <p className="text-sm text-stone-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`mt-2 sm:mt-0 px-3 py-1.5 rounded-full text-xs font-semibold w-max ${statusClassName(
                  order.status,
                )}`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <p className="text-stone-500 text-sm">{order.items.length} items</p>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-stone-900">
                  ${order.totalAmount.toFixed(2)}
                </span>
                <button
                  onClick={() => onOpenOrderDetails(order)}
                  className="px-4 py-2 bg-zPink text-white rounded-lg hover:bg-pink-700 transition-colors duration-300 text-sm font-semibold"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <i className="fa-solid fa-receipt text-5xl text-stone-200 mb-4 block"></i>
            <h3 className="text-lg font-bold text-stone-900">No orders yet</h3>
            <p className="text-stone-500 mt-2">
              When you make an order, it will appear here.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-block px-6 py-3 bg-zPink text-white rounded-xl font-bold hover:bg-pink-700 transition-all"
            >
              Start Ordering
            </Link>
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

export default UserDashboardOrders;
