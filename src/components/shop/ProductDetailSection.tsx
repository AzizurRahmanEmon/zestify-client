"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProductTabContents from "./ProductTabContents";
import RelatedProductSection from "./RelatedProductSection";
import ReviewForm from "@/components/form/ReviewForm";
import type { ProductDataType } from "@/types";
import { useCustomContext } from "@/context/context";
import Image from "next/image";
import type { NutritionInfo, ProductReviewsResponse } from "@/lib/api";
import { getProductReviews } from "@/lib/api";

interface Props {
  product: ProductDataType;
  nutrition: NutritionInfo | null;
  initialReviews: ProductReviewsResponse;
  relatedProducts: ProductDataType[];
}

const ProductDetailSection = ({
  product,
  nutrition,
  initialReviews,
  relatedProducts,
}: Props) => {
  const { addToCart, addToWishlist } = useCustomContext();

  // Track quantity state
  const [quantity, setQuantity] = useState(1);
  const [reviewsData, setReviewsData] =
    useState<ProductReviewsResponse>(initialReviews);

  const handleQuantityChange = (type: "increase" | "decrease") => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : prev,
    );
  };

  useEffect(() => {
    setReviewsData(initialReviews);
  }, [initialReviews]);

  const refreshReviews = useCallback(async () => {
    const latest = await getProductReviews(product.slug, {
      page: 1,
      limit: 20,
    });
    setReviewsData(latest);
  }, [product.slug]);

  const averageRating = useMemo(() => {
    const fromReviews = Number(reviewsData.averageRating || 0);
    return fromReviews > 0 ? fromReviews : Number(product.rating?.stars || 0);
  }, [reviewsData.averageRating, product.rating?.stars]);

  const reviewsCount = useMemo(() => {
    const fromReviews = Number(reviewsData.reviewsCount || 0);
    return fromReviews > 0 ? fromReviews : Number(product.rating?.reviews || 0);
  }, [reviewsData.reviewsCount, product.rating?.reviews]);

  const starFillCount = Math.round(averageRating);

  return (
    <section
      className="overflow-hidden"
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container py-20 lg:py-30">
        <div className="flex items-center flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-20 overflow-hidden">
          <div className="max-w-160 aspect-[1.2] w-4/5 xl:w-1/2 bg-[#F2EDE1] flex items-center justify-center">
            <Image
              width={400}
              height={400}
              src={product.image}
              alt="img"
              className="max-h-143.25 w-3/4 object-cover"
            />
          </div>
          <div className="text-center lg:text-start">
            <h6 className="font-semibold text-xl xl:text-2xl text-textColor">
              ${Number(product.price).toFixed(2)}{" "}
              <span className="text-base text-zPink line-through">
                ${Number(product.price + 30).toFixed(2)}
              </span>
            </h6>
            <h3 className="mt-3 text-4xl md:text-5xl xl:text-6xl font-primary">
              {product.name}
            </h3>

            <p className="mt-3 md:mt-5 ar-subtitle w-[90%] mx-auto lg:mx-0">
              {product.description}
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-3 text-lg text-starFilled mt-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <i
                  key={i}
                  className={`fa-solid fa-star ${
                    i < starFillCount ? "text-starFilled" : "text-gray-300"
                  }`}
                ></i>
              ))}
              <h6 className="font-semibold text-textColor text-base">
                ({reviewsCount} Reviews)
              </h6>
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-col md:flex-row md:justify-center lg:justify-start items-center gap-5 xl:gap-8 mt-10">
              <div className="w-48 h-14 bg-white border border-[#dddddd] leading-14 relative rounded flex items-center justify-between px-4">
                <button
                  className="w-11 h-11 text-center leading-11"
                  onClick={() => handleQuantityChange("decrease")}
                >
                  <i className="fa-light fa-minus"></i>
                </button>
                <input
                  type="number"
                  name="product-quantity"
                  className="w-6 text-center"
                  min="1"
                  value={quantity}
                  readOnly
                />
                <button
                  className="w-11 h-11 text-center leading-11"
                  onClick={() => handleQuantityChange("increase")}
                >
                  <i className="fa-light fa-plus"></i>
                </button>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="flex items-center justify-center lg:justify-start gap-6 mt-10">
              <button
                className="ar-btn h-14 group"
                onClick={() => addToCart({ ...product, quantity })}
              >
                <span className="relative z-10 transition-all duration-500 group-hover:text-black">
                  Add To Cart
                </span>
                <span className="absolute top-0 left-0 w-0 h-full bg-white transition-all duration-500 group-hover:w-full z-0"></span>
              </button>
              <button
                className="w-14 h-14 flex items-center justify-center border-zPink border text-2xl rounded text-zPink bg-white hover:bg-zPink hover:text-white hover:border-transparent transition"
                onClick={() => addToWishlist(product)}
              >
                <i className="fa-regular fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
        <ProductTabContents
          product={product}
          nutrition={nutrition}
          reviews={reviewsData}
        />
        <RelatedProductSection products={relatedProducts} />
        <ReviewForm productSlug={product.slug} onPosted={refreshReviews} />
      </div>
    </section>
  );
};

export default ProductDetailSection;
