"use client";
import { useCustomContext } from "@/context/context";
import Image from "next/image";
interface Props {
  isPreviewModalOpen: boolean;
  closePreviewModal: () => void;
}
const PreviewModal = ({ isPreviewModalOpen, closePreviewModal }: Props) => {
  const { previewProduct, addToCart, addToWishlist } = useCustomContext();
  const formatPrice = (value: number) => value.toFixed(2);

  if (!previewProduct) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div
        className={`ar-modal-overlay ${isPreviewModalOpen ? "show" : "hide"}`}
        onClick={closePreviewModal}
      />

      {/* Modal Body */}
      <div className={`ar-modal-bod ${isPreviewModalOpen ? "show" : "hide"}`}>
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 hover:border-zPink hover:bg-zPink hover:text-white transition-all duration-200"
          onClick={closePreviewModal}
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
        {/* Product Card */}
        <div className="flex flex-col">
          {/* Product Image */}
          <div className="relative bg-gray-50 p-6">
            <div className="flex justify-center">
              <Image
                src={previewProduct.image}
                alt={previewProduct.name}
                width={300}
                height={300}
                className="w-64 h-64 object-cover rounded-xl shadow-md"
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <button
                onClick={() => addToWishlist(previewProduct)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-4">
            {/* Product Name & Category */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-zPink bg-pink-50 px-2 py-1 rounded-full">
                  {previewProduct.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {previewProduct.name}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-2">
                {previewProduct.description}
              </p>
            </div>

            {/* Rating & Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {previewProduct.rating && (
                  <>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(previewProduct.rating?.stars || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({previewProduct.rating?.reviews || 0} reviews)
                    </span>
                  </>
                )}
              </div>
              <div className="text-2xl font-bold text-zPink">
                ${formatPrice(previewProduct.price ?? 0)}
              </div>
            </div>

            {/* Tags */}
            {previewProduct.tags && previewProduct.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewProduct.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {previewProduct.tags.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{previewProduct.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  addToCart(previewProduct);
                  closePreviewModal();
                }}
                className="flex-1 bg-zPink text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Add to Cart
              </button>
              <a
                href={`/shop/${previewProduct.slug}`}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors duration-200"
                onClick={closePreviewModal}
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewModal;
