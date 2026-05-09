"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCustomContext } from "@/context/context";
import { getCurrentCustomer } from "@/lib/auth";

const CartSection = () => {
  const router = useRouter();
  const { cartList, updateQuantity, deleteItem } = useCustomContext();
  const formatPrice = (value: number) => value.toFixed(2);

  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = cartList.reduce(
    (total, product) => total + product.price * (product.quantity || 1),
    0,
  );

  const handleCheckout = () => {
    const customer = getCurrentCustomer() as any;
    if (!customer?.token) {
      toast.error("Please login to proceed with checkout.", {
        autoClose: 4000,
      });
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  return (
    <section
      className="bg-no-repeat min-h-screen"
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container py-20 lg:py-30 overflow-hidden">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Your Cart
          </h1>
          <p className="text-lg text-gray-600">
            {cartList.length > 0
              ? `You have ${cartList.length} item${
                  cartList.length > 1 ? "s" : ""
                } in your cart`
              : "Your cart is currently empty"}
          </p>
        </div>

        {cartList.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="hidden lg:block mb-12">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-zPink text-white">
                  <div className="grid grid-cols-12 gap-6 py-6 px-8 font-semibold text-lg">
                    <div className="col-span-4">Products</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Total Price</div>
                    <div className="col-span-2 text-center">Actions</div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartList.map((product) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-12 gap-6 py-6 px-8 items-center hover:bg-gray-50 transition-colors duration-200"
                    >
                      {/* Product Info */}
                      <div className="col-span-4 flex items-center gap-6">
                        <div className="relative group">
                          <Image
                            width={100}
                            height={100}
                            src={product.image}
                            alt="product"
                            className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black-10 rounded-xl transition-opacity duration-200"></div>
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
                      <div className="col-span-2 text-center">
                        <span className="text-xl font-bold text-zPink">
                          ${formatPrice(product.price ?? 0)}
                        </span>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden">
                          <button
                            className="w-10 h-10 flex items-center justify-center hover:bg-zPink hover:text-white transition-all duration-200"
                            onClick={() => updateQuantity(product.slug, -1)}
                          >
                            <i className="fa-light fa-minus"></i>
                          </button>
                          <span className="w-12 h-10 flex items-center justify-center font-semibold bg-white border-x border-gray-200">
                            {product.quantity || 1}
                          </span>
                          <button
                            className="w-10 h-10 flex items-center justify-center hover:bg-zPink hover:text-white transition-all duration-200"
                            onClick={() => updateQuantity(product.slug, 1)}
                          >
                            <i className="fa-light fa-plus"></i>
                          </button>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="col-span-2 text-center">
                        <span className="text-xl font-bold text-zPink">
                          $
                          {(product.price * (product.quantity || 1)).toFixed(2)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex justify-center">
                        <button
                          className="w-12 h-12 border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-zPink hover:bg-zPink transition-all duration-200 group"
                          onClick={() => deleteItem(product.slug)}
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
            <div className="lg:hidden space-y-4 mb-12">
              {cartList.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg p-6 relative"
                >
                  {/* Remove Button */}
                  <button
                    className="absolute top-4 right-4 w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-zPink hover:bg-zPink transition-all duration-200 group"
                    onClick={() => deleteItem(product.slug)}
                  >
                    <Image
                      width={16}
                      height={20}
                      src="/assets/img/remove.png"
                      alt="icon"
                      className="w-3 h-4 group-hover:scale-110 transition-transform duration-200"
                    />
                  </button>

                  <div className="flex items-start gap-4 pr-12 mb-4">
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
                      <div className="flex items-center justify-between text-lg sm:text-xl font-bold text-zPink">
                        <span>${formatPrice(product.price ?? 0)}</span>
                        <span>
                          $
                          {(product.price * (product.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden">
                      <button
                        className="w-12 h-12 flex items-center justify-center hover:bg-zPink hover:text-white transition-all duration-200"
                        onClick={() => updateQuantity(product.slug, -1)}
                      >
                        <i className="fa-light fa-minus"></i>
                      </button>
                      <span className="w-16 h-12 flex items-center justify-center font-semibold bg-white border-x border-gray-200">
                        {product.quantity || 1}
                      </span>
                      <button
                        className="w-12 h-12 flex items-center justify-center hover:bg-zPink hover:text-white transition-all duration-200"
                        onClick={() => updateQuantity(product.slug, 1)}
                      >
                        <i className="fa-light fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8 space-y-2">
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900 font-semibold">
                  ${formatPrice(subtotal)}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between items-center text-lg text-green-700">
                  <span className="font-medium">Coupon Discount:</span>
                  <span className="font-bold">
                    -${formatPrice(couponDiscount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-2xl font-bold pt-2 border-t border-gray-100">
                <span className="text-gray-900">Total:</span>
                <span className="text-zPink">
                  ${formatPrice(Math.max(0, subtotal - couponDiscount))}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col lg:flex-row justify-end items-center gap-6">
              {/* Checkout Button */}
              <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                <button onClick={handleCheckout} className="ar-btn group gap-3">
                  <span className="relative z-10 transition-all duration-500 group-hover:text-black">
                    Proceed to Checkout
                  </span>
                  <Image
                    width={33}
                    height={24}
                    src="/assets/img/arrow.png"
                    alt="icon"
                    className="group-hover:invert z-10"
                  />
                  <span className="absolute top-0 left-0 w-0 h-full bg-white transition-all duration-500 group-hover:w-full z-0"></span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Add some delicious items to your cart to get started with your
                order.
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

export default CartSection;
