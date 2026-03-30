"use client";
import { useCustomContext } from "@/context/context";
import Image from "next/image";
interface Props {
  isCartModalOpen: boolean;
  closeCartModal: () => void;
}
const CartModal = ({ isCartModalOpen, closeCartModal }: Props) => {
  const { cartList, updateQuantity, deleteItem } = useCustomContext();
  const formatPrice = (value: number) => value.toFixed(2);

  // Calculate total
  const calculateTotal = () => {
    return cartList
      .reduce((total, product) => {
        return total + product.price * (product.quantity || 1);
      }, 0)
      .toFixed(2);
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        className={`ar-modal-overlay ${isCartModalOpen ? "show" : "hide"}`}
        onClick={closeCartModal}
      />

      {/* Modal Body */}
      <div className={`ar-modal-body ${isCartModalOpen ? "show" : "hide"}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zPink rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <p className="text-sm text-gray-500">
                {cartList.length} {cartList.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-200 hover:border-zPink hover:bg-zPink hover:text-white transition-all duration-200 group"
            onClick={closeCartModal}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {cartList.length > 0 ? (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6">
                <div className="space-y-4 py-4">
                  {cartList.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row sm:justify-start sm:text-start justify-center text-center items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      {/* Product Image */}
                      <div className="relative shrink-0">
                        <Image
                          width={80}
                          height={80}
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base truncate mb-1">
                          <a
                            href={`/shop/${product.slug}`}
                            className="hover:text-zPink transition-colors duration-200"
                          >
                            {product.name}
                          </a>
                        </h3>
                        <p className="text-lg font-bold text-zPink">
                          ${formatPrice(product.price ?? 0)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-zPink hover:text-white transition-all duration-200 text-sm"
                            onClick={() => updateQuantity(product.slug, -1)}
                          >
                            <i className="fa-light fa-minus"></i>
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-gray-200">
                            {product.quantity || 1}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-zPink hover:text-white transition-all duration-200 text-sm"
                            onClick={() => updateQuantity(product.slug, 1)}
                          >
                            <i className="fa-light fa-plus"></i>
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-200 ml-2"
                          onClick={() => deleteItem(product.slug)}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Actions */}
              <div className="border-t border-gray-100 p-6 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-zPink">
                    ${calculateTotal()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/cart"
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    View Full Cart
                  </a>
                  <a
                    href="/checkout"
                    className="flex-1 bg-zPink text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Proceed to Checkout
                  </a>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-sm mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 64 64"
                    fill="none"
                    className="text-gray-400"
                  >
                    <path
                      d="M8 16L12.8 16.8L15.2 38.4C15.4 40.4 17 42 19 42H47C48.8 42 50.4 40.6 50.8 38.8L54 24H18"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <path
                      d="M8 8H4"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="24"
                      cy="50"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                    />
                    <circle
                      cx="44"
                      cy="50"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                    />
                    <path
                      d="M22 28L42 28"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="3 3"
                      opacity="0.4"
                    />
                    <path
                      d="M22 32L38 32"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="3 3"
                      opacity="0.4"
                    />
                    <path
                      d="M22 36L35 36"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="3 3"
                      opacity="0.3"
                    />
                    <circle
                      cx="32"
                      cy="30"
                      r="1.5"
                      fill="currentColor"
                      opacity="0.3"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Add some delicious items to get started!
                </p>
                <a
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-zPink text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200"
                  onClick={closeCartModal}
                >
                  Start Shopping
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal;
