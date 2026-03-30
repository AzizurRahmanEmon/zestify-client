"use client";
import { useMemo, useState } from "react";
import type { ProductDataType } from "@/types";
import type { NutritionInfo, ProductReviewsResponse } from "@/lib/api";

type Props = {
  product: ProductDataType;
  nutrition: NutritionInfo | null;
  reviews: ProductReviewsResponse;
};

const ProductTabContents = ({ product, nutrition, reviews }: Props) => {
  const [isActiveTab, setIsActiveTab] = useState<string>("tab-1");
  const toggleTab = (tab: string) => {
    setIsActiveTab(tab);
  };

  const reviewItems = useMemo(() => {
    return Array.isArray(reviews?.items) ? reviews.items : [];
  }, [reviews]);

  const initials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="xl:mt-20 mt-12">
      <ul className="flex flex-col md:justify-between lg:justify-start md:flex-row md:h-15 md:border-b border-[#dddddd]">
        <li className="relative flex items-center">
          <button
            className={`md:pr-10 font-semibold pb-5 border-b border-gray-300 w-full md:w-max md:border-0 md:pb-0 block text-textColor text-xl lg:text-2xl transition-all ${
              isActiveTab === "tab-1" ? "border-zPink" : ""
            }`}
            id="tabPaneBtn1"
            onClick={() => toggleTab("tab-1")}
          >
            Descriptions
          </button>
          <div
            className={`tabpane-btn-border hidden md:block ${
              isActiveTab === "tab-1" ? "active" : ""
            }`}
            id="tabPaneBtnBorder1"
          ></div>
        </li>
        <li className="relative flex items-center">
          <button
            className={`md:px-10 font-semibold py-5 md:py-0 border-b border-gray-300 w-full md:w-max md:border-0 block text-textColor text-xl lg:text-2xl transition-all ${
              isActiveTab === "tab-2" ? "border-zPink" : ""
            }`}
            id="tabPaneBtn2"
            onClick={() => toggleTab("tab-2")}
          >
            Additional Information's
          </button>
          <div
            className={`tabpane-btn-border hidden md:block ${
              isActiveTab === "tab-2" ? "active" : ""
            }`}
            id="tabPaneBtnBorder2"
          ></div>
        </li>
        <li className="relative flex items-center">
          <button
            className={`md:px-10 font-semibold py-5 md:py-0 border-b border-gray-300 w-full md:w-max md:border-0 block text-textColor text-xl lg:text-2xl transition-all ${
              isActiveTab === "tab-3" ? "border-zPink" : ""
            }`}
            id="tabPaneBtn3"
            onClick={() => toggleTab("tab-3")}
          >
            Reviews({Number(reviews?.reviewsCount || 0)})
          </button>
          <div
            className={`tabpane-btn-border hidden md:block ${
              isActiveTab === "tab-3" ? "active" : ""
            }`}
            id="tabPaneBtnBorder3"
          ></div>
        </li>
      </ul>
      <div className="md:mt-10 mt-8">
        <div
          className={`ar-tab-pane ${isActiveTab === "tab-1" ? "show" : ""}`}
          id="tabPane1"
        >
          <p className="ar-subtitle text-center md:text-start whitespace-pre-line">
            {product.description}
          </p>
        </div>
        <div
          className={`ar-tab-pane ${isActiveTab === "tab-2" ? "show" : ""}`}
          id="tabPane2"
        >
          <h2 className="text-2xl font-bold text-center md:text-start mb-4">
            Additional Information
          </h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-semibold">Serving Size</td>
                <td className="py-2">{nutrition?.servingSize || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Calories</td>
                <td className="py-2">
                  {typeof nutrition?.calories === "number"
                    ? `${nutrition.calories} kcal`
                    : "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Protein</td>
                <td className="py-2">
                  {typeof nutrition?.protein === "number"
                    ? `${nutrition.protein} g`
                    : "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Total Fat</td>
                <td className="py-2">
                  {typeof nutrition?.fat === "number"
                    ? `${nutrition.fat} g`
                    : "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Carbohydrates</td>
                <td className="py-2">
                  {typeof nutrition?.carbs === "number"
                    ? `${nutrition.carbs} g`
                    : "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Allergens</td>
                <td className="py-2">
                  {Array.isArray(product.allergens) && product.allergens.length
                    ? product.allergens.join(", ")
                    : "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Preparation Time</td>
                <td className="py-2">
                  {product.preparationTime
                    ? `${product.preparationTime} minutes`
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          className={`ar-tab-pane ${isActiveTab === "tab-3" ? "show" : ""}`}
          id="tabPane3"
        >
          <h2 className="text-2xl font-bold text-center md:text-start mb-4">
            Customer Reviews
          </h2>
          <div className="mt-10">
            {reviewItems.map((review, index) => (
              <div
                key={review._id}
                className={`flex flex-col sm:flex-row items-center gap-5 lg:gap-8 ${
                  index === 0
                    ? "pb-5 border-b"
                    : index === reviewItems.length - 1
                      ? "pt-5"
                      : "py-5 border-b"
                }`}
              >
                <div className="rounded-full h-20 w-20 bg-zPink/10 text-zPink flex items-center justify-center text-xl font-bold">
                  {initials(review.name)}
                </div>
                <div className="grow">
                  <div className="flex items-center flex-col sm:flex-row sm:justify-between justify-center gap-3 lg:justify-between mb-2">
                    <span className="font-semibold text-xl lg:text-2xl">
                      {review.name}
                    </span>
                    <div className="flex items-center gap-3 text-lg">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          key={i}
                          className={`fa-solid fa-star ${
                            i < review.rating
                              ? "text-starFilled"
                              : "text-gray-300"
                          }`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-center sm:text-start">
                    {formatDate(review.createdAt)}
                  </div>
                  <p className="lg:text-lg text-pTextColor mt-4 text-center sm:text-start">
                    {review.review}
                  </p>
                </div>
              </div>
            ))}
            {!reviewItems.length && (
              <div className="text-center text-gray-600">No reviews yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTabContents;
