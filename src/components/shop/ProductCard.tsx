"use client";
import type { ProductDataType } from "@/types";
import { useCustomContext } from "@/context/context";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface Props {
  product: ProductDataType;
}

const ProductCard = ({ product }: Props) => {
  const { addToCart, addToWishlist, openPreviewModal } = useCustomContext();
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleImageClick = () => {
    setShowActions(!showActions);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="group" ref={cardRef}>
      <div className="lg:min-h-72 min-h-60 bg-linear-to-br from-amber-50 to-orange-100 flex items-center justify-center relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <Image
          width={product.width}
          height={product.height}
          src={product.image}
          alt="food"
          className="transition-transform w-1/2 lg:w-3/4 duration-300 group-hover:scale-105 cursor-pointer lg:cursor-default"
          onClick={handleImageClick}
        />
        <div className="flex flex-col gap-2 absolute right-4 top-4">
          <button
            className="w-10 h-10 border border-gray-200 text-lg bg-white/90 backdrop-blur-sm text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 rounded-full shadow-sm"
            onClick={() => addToWishlist(product)}
          >
            <i className="fa-light fa-heart"></i>
          </button>
          <button
            className={`w-10 h-10 border border-gray-200 text-lg bg-white/90 backdrop-blur-sm text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 rounded-full shadow-sm ${
              showActions
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            } lg:opacity-0 lg:-translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0`}
            onClick={() => addToCart(product)}
          >
            <i className="fa-light fa-cart-shopping"></i>
          </button>
          <button
            className={`w-10 h-10 border border-gray-200 text-lg bg-white/90 backdrop-blur-sm text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 rounded-full shadow-sm ${
              showActions
                ? "opacity-100 translate-y-0 delay-75"
                : "opacity-0 -translate-y-2"
            } lg:opacity-0 lg:-translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:delay-75`}
            onClick={() => openPreviewModal(product)}
          >
            <i className="fa-light fa-eye"></i>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-b-xl shadow-sm p-4 lg:p-6 -mt-2">
        <div className="lg:py-4 py-3 lg:text-lg font-medium text-gray-800 flex items-center justify-between border-b border-gray-100">
          <h6 className="lg:text-2xl text-xl font-bold text-gray-900">
            ${Number(product.price).toFixed(2)}
          </h6>
          <h6 className="flex items-center gap-2">
            <i className="fa-solid fa-star text-amber-500"></i>
            <span className="text-gray-700">
              {product.rating.stars}({product.rating.reviews})
            </span>
          </h6>
        </div>
        <div className="pt-3 lg:pt-4">
          <a
            href={`/shop/${product.slug}`}
            className="text-xl font-semibold hover:text-rose-500 transition-colors duration-300"
          >
            {product.name}
          </a>
          <p className="font-medium mt-2 text-gray-600">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
