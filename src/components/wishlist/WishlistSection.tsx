"use client";
import Link from "next/link";
import { useCustomContext } from "@/context/context";
import Image from "next/image";

const WishlistSection = () => {
  const { wishlistList, deleteWishlistItem, moveWishlistToCart } =
    useCustomContext();
  const formatPrice = (value: number) => value.toFixed(2);
  return (
    <section
      className="bg-no-repeat"
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container py-20 lg:py-30 overflow-hidden">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Your Wishlist
          </h1>
          <p className="text-lg text-gray-600">
            {wishlistList.length > 0
              ? `You have ${wishlistList.length} item${
                  wishlistList.length > 1 ? "s" : ""
                } in your wishlist`
              : "Your wishlist is currently empty"}
          </p>
        </div>

        {wishlistList.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-zPink text-white">
                  <div className="grid grid-cols-12 gap-6 py-6 px-8 font-semibold text-lg">
                    <div className="col-span-6">Products</div>
                    <div className="col-span-3 text-center">Price</div>
                    <div className="col-span-3 text-center">Actions</div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {wishlistList.map((product) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-12 gap-6 py-6 px-8 items-center hover:bg-gray-50 transition-colors duration-200"
                    >
                      {/* Product Info */}
                      <div className="col-span-6 flex items-center gap-6">
                        <div className="relative group">
                          <Image
                            width={100}
                            height={100}
                            src={product.image}
                            alt="product"
                            className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-opacity duration-200"></div>
                        </div>
                        <div>
                          <Link
                            href={`/shop/${product.slug}`}
                            className="font-semibold text-xl text-gray-900 hover:text-zPink transition-colors duration-200 block mb-2"
                          >
                            {product.name}
                          </Link>
                          <p className="text-gray-600">
                            Rashers of streaky bacon
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-3 text-center">
                        <span className="text-2xl font-bold text-zPink">
                          ${formatPrice(product.price ?? 0)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-3 flex justify-center">
                        <button
                          className="w-12 h-12 border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-zPink hover:bg-zPink/10 transition-all duration-200 group"
                          onClick={() => deleteWishlistItem(product.slug)}
                        >
                          <Image
                            width={16}
                            height={20}
                            src="/assets/img/remove.png"
                            alt="icon"
                            className="group-hover:scale-110 transition-transform duration-200"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile/Tablet View */}
            <div className="lg:hidden space-y-4">
              {wishlistList.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg p-6 relative"
                >
                  {/* Remove Button */}
                  <button
                    className="absolute top-4 right-4 w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-zPink hover:bg-zPink/10 transition-all duration-200 group"
                    onClick={() => deleteWishlistItem(product.slug)}
                  >
                    <Image
                      width={16}
                      height={20}
                      src="/assets/img/remove.png"
                      alt="icon"
                      className="w-3 h-4 group-hover:scale-110 transition-transform duration-200"
                    />
                  </button>

                  <div className="flex items-start gap-4 pr-12">
                    <div className="relative group shrink-0">
                      <Image
                        width={100}
                        height={100}
                        src={product.image}
                        alt="product"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-opacity duration-200"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="font-semibold text-lg sm:text-xl text-gray-900 hover:text-zPink transition-colors duration-200 block mb-2 truncate"
                      >
                        {product.name}
                      </Link>
                      <p className="text-gray-600 text-sm sm:text-base mb-3">
                        Rashers of streaky bacon
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl sm:text-2xl font-bold text-zPink">
                          ${formatPrice(product.price ?? 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add to Cart Button */}
            <div className="flex justify-center lg:justify-end mt-12">
              <a
                role="button"
                onClick={moveWishlistToCart}
                className="ar-btn group gap-3 inline-flex items-center"
              >
                <span className="relative z-10 transition-all duration-500 group-hover:text-black">
                  Add All to Cart
                </span>
                <Image
                  width={33}
                  height={24}
                  src="/assets/img/arrow.png"
                  alt="icon"
                  className="group-hover:invert z-10"
                />
                <span className="absolute top-0 left-0 w-0 h-full bg-white transition-all duration-500 group-hover:w-full z-0"></span>
              </a>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg
                  className="w-12 h-12 text-gray-400"
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Start adding items you love to your wishlist and they'll appear
                here.
              </p>
              <Link
                href="/shop"
                className="ar-btn group gap-3 inline-flex items-center"
              >
                <span className="relative z-10 transition-all duration-500 group-hover:text-black">
                  Start Shopping
                </span>
                <Image
                  width={33}
                  height={24}
                  src="/assets/img/arrow.png"
                  alt="icon"
                  className="group-hover:invert z-10"
                />
                <span className="absolute top-0 left-0 w-0 h-full bg-white transition-all duration-500 group-hover:w-full z-0"></span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WishlistSection;
