"use client";
import Image from "next/image";
import { useCustomContext } from "@/context/context";
import Link from "next/link";
interface Props {
  isWishlistModalOpen: boolean;
  closeWishlistModal: () => void;
}
const WishlistModal = ({ isWishlistModalOpen, closeWishlistModal }: Props) => {
  const { wishlistList, deleteWishlistItem, moveWishlistToCart } =
    useCustomContext();
  const formatPrice = (value: number) => value.toFixed(2);

  return (
    <>
      {/* Modal Overlay */}
      <div
        className={`ar-modal-overlay ${isWishlistModalOpen ? "show" : "hide"}`}
        onClick={closeWishlistModal}
      />

      {/* Modal Body */}
      <div className={`ar-modal-body ${isWishlistModalOpen ? "show" : "hide"}`}>
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Wishlist</h2>
              <p className="text-sm text-gray-500">
                {wishlistList.length}{" "}
                {wishlistList.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-200 hover:border-zPink hover:bg-zPink hover:text-white transition-all duration-200 group"
            onClick={closeWishlistModal}
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
          {wishlistList.length > 0 ? (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6">
                <div className="space-y-4 py-4">
                  {wishlistList.map((product) => (
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
                          className="w-16 h-auto sm:w-20 aspect-square object-cover rounded-lg shadow-md"
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

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Add to Cart Button */}
                        <button
                          className="px-4 py-2 bg-zPink text-white rounded-lg font-medium text-sm hover:bg-opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
                          onClick={moveWishlistToCart}
                        >
                          Add to Cart
                        </button>

                        {/* Remove Button */}
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-200"
                          onClick={() => deleteWishlistItem(product.slug)}
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

              {/* Actions */}
              <div className="border-t border-gray-100 p-6 space-y-4">
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/wishlist"
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    View Full Wishlist
                  </Link>
                  <button
                    onClick={moveWishlistToCart}
                    className="flex-1 bg-zPink text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Add All to Cart
                  </button>
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
                      d="M32 8C24.268 8 18 14.268 18 22c0 10 14 26 14 26s14-16 14-26c0-7.732-6.268-14-14-14z"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="22"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                    />
                    <path
                      d="M28 42L36 42"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="3 3"
                      opacity="0.4"
                    />
                    <path
                      d="M26 46L38 46"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="3 3"
                      opacity="0.4"
                    />
                    <path
                      d="M30 50L34 50"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="3 3"
                      opacity="0.3"
                    />
                    <circle
                      cx="32"
                      cy="38"
                      r="1.5"
                      fill="currentColor"
                      opacity="0.3"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Save items you love for later!
                </p>
                <a
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-zPink text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200"
                  onClick={closeWishlistModal}
                >
                  Browse Products
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

export default WishlistModal;
