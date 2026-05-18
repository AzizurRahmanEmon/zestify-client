"use client";

import Image from "next/image";

import { DashboardOrder, DashboardOrderItem, DashboardProduct } from "@/types";

interface UserDashboardOrderDetailsModalProps {
  open: boolean;
  order: DashboardOrder | null;
  onClose: () => void;
}

const hasProduct = (
  product: DashboardOrderItem["product"],
): product is DashboardProduct =>
  typeof product === "object" && product !== null && !Array.isArray(product);

const UserDashboardOrderDetailsModal = ({
  open,
  order,
  onClose,
}: UserDashboardOrderDetailsModalProps) => {
  if (!open || !order) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-150 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-160 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-900">
            Order Details - {order.orderNumber}
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-600"
                    : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-blue-100 text-blue-600"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <p className="font-bold">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Items</h4>
            <div className="space-y-4">
              {order.items.map((item, idx) => {
                const product = hasProduct(item.product) ? item.product : null;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="w-16 h-16 bg-white rounded-lg shrink-0 overflow-hidden">
                      <Image
                        src={product?.image || "/assets/img/dish-1.png"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900">{item.name}</h5>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-zPink">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%)</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-zPink">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {order.deliveryAddress && (
            <div className="bg-pink-50 p-4 rounded-xl">
              <h4 className="font-bold text-zPink mb-2 flex items-center gap-2">
                <i className="fa-solid fa-location-dot"></i>
                Delivery Address
              </h4>
              <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboardOrderDetailsModal;
