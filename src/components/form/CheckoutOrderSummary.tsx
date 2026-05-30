"use client";
import { paymentOptions } from "@/data";
import type {
  CheckoutFormData,
  CheckoutLoyaltyConfig,
} from "@/hooks/useCheckoutForm";

interface CheckoutOrderSummaryProps {
  couponCode: string;
  couponDiscount: number;
  availableLoyaltyPoints: number;
  loyaltyPointsToRedeem: number;
  loyaltyConfig: CheckoutLoyaltyConfig;
  maxRedeemablePoints: number;
  isSubmitting: boolean;
  subtotal: number;
  shippingFee: number;
  orderTotal: number;
  payment: string;
  onCouponCodeChange: (value: string) => void;
  onApplyCoupon: () => void | Promise<void>;
  onLoyaltyChange: (value: number) => void;
  onPaymentChange: (field: keyof CheckoutFormData, value: string) => void;
}

const CheckoutOrderSummary = ({
  couponCode,
  couponDiscount,
  availableLoyaltyPoints,
  loyaltyPointsToRedeem,
  loyaltyConfig,
  maxRedeemablePoints,
  isSubmitting,
  subtotal,
  shippingFee,
  orderTotal,
  payment,
  onCouponCodeChange,
  onApplyCoupon,
  onLoyaltyChange,
  onPaymentChange,
}: CheckoutOrderSummaryProps) => {
  const pointValue = Number(loyaltyConfig.loyaltyPointValue || 1);
  const minPoints = Number(loyaltyConfig.minimumPointsToRedeem || 10);
  const isBelowMinimum =
    loyaltyPointsToRedeem > 0 && loyaltyPointsToRedeem < minPoints;
  const loyaltyDiscountPreview = loyaltyPointsToRedeem * pointValue;
  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-zPink p-8 lg:p-10 sticky top-8">
      <div className="mb-8">
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Cart <span className="text-zPink">Totals</span>
        </h3>
        <div className="w-16 h-1 bg-zPink rounded-full mt-2"></div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <span className="text-lg font-medium text-gray-700">
            Cart Subtotal
          </span>
          <span className="text-lg font-bold text-gray-900">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <span className="text-lg font-medium text-gray-700">
            Shipping Fee
          </span>
          <span className="text-lg font-bold text-gray-900">
            ${shippingFee.toFixed(2)}
          </span>
        </div>
        <div className="py-4 border-b border-gray-100">
          <div className="flex items-center flex-col gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => onCouponCodeChange(e.target.value.toUpperCase())}
              placeholder="Coupon code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
            />
            <button
              type="button"
              className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm w-full"
              onClick={onApplyCoupon}
            >
              Apply
            </button>
          </div>
          {couponDiscount > 0 && (
            <div className="text-sm text-green-700 mt-2">
              Coupon discount: -${couponDiscount.toFixed(2)}
            </div>
          )}
        </div>
        {availableLoyaltyPoints > 0 ? (
          <div className="py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Loyalty Points
              </label>
              <span className="text-xs font-semibold bg-zPink/10 text-zPink px-2 py-0.5 rounded-full">
                {availableLoyaltyPoints} pts available
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              1 pt = ${pointValue.toFixed(2)} &nbsp;·&nbsp; Min: {minPoints} pts
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                max={maxRedeemablePoints}
                value={loyaltyPointsToRedeem || ""}
                placeholder={`0–${maxRedeemablePoints}`}
                onChange={(e) => onLoyaltyChange(Number(e.target.value || 0))}
                className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                  isBelowMinimum
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => onLoyaltyChange(maxRedeemablePoints)}
                className="px-3 py-2 text-xs font-semibold border border-zPink text-zPink rounded-lg hover:bg-zPink hover:text-white transition-colors whitespace-nowrap"
              >
                Use max
              </button>
              {loyaltyPointsToRedeem > 0 && (
                <button
                  type="button"
                  onClick={() => onLoyaltyChange(0)}
                  className="px-3 py-2 text-xs font-semibold border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            {isBelowMinimum && (
              <p className="text-xs text-amber-600 mt-1.5">
                Enter at least {minPoints} pts to redeem
              </p>
            )}
            {loyaltyPointsToRedeem >= minPoints &&
              loyaltyPointsToRedeem > 0 && (
                <p className="text-xs text-green-600 mt-1.5">
                  Saves ${loyaltyDiscountPreview.toFixed(2)} on this order
                </p>
              )}
          </div>
        ) : null}
        {couponDiscount > 0 && (
          <div className="flex items-center justify-between py-2 text-green-700">
            <span className="font-medium">Coupon Discount</span>
            <span className="font-bold">-${couponDiscount.toFixed(2)}</span>
          </div>
        )}
        {loyaltyPointsToRedeem > 0 && (
          <div className="flex items-center justify-between py-2 text-green-700">
            <span className="font-medium">Loyalty Discount</span>
            <span className="font-bold">
              -
              {(
                loyaltyPointsToRedeem *
                Number(loyaltyConfig.loyaltyPointValue || 1)
              ).toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between py-4 text-xl">
          <span className="font-bold text-gray-900">Order Total</span>
          <span className="font-bold text-zPink">${orderTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-xl font-bold text-gray-900 mb-6">
          <span className="text-zPink">Payment</span> Method
        </div>
        <div className="space-y-3">
          {paymentOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-zPink hover:bg-pink-50 group"
            >
              <input
                className="hidden"
                type="radio"
                value={option.value}
                name="payment"
                checked={payment === option.value}
                onChange={(e) => onPaymentChange("payment", e.target.value)}
                disabled={isSubmitting}
                aria-label={option.label}
              />
              <span
                className={`w-5 h-5 rounded-full border-2 transition-all duration-300 relative flex items-center justify-center ${
                  payment === option.value
                    ? "border-zPink"
                    : "border-gray-300 group-hover:border-zPink"
                }`}
              >
                {payment === option.value && (
                  <span className="w-3 h-3 rounded-full bg-zPink"></span>
                )}
              </span>
              <span className="ml-4 text-lg font-medium text-gray-700 group-hover:text-gray-900">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-label="Place Order"
        className="w-full bg-zPink text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-opacity-90 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span>Processing Order</span>
            <svg
              className="animate-spin h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        ) : (
          <>
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span>Place Order</span>
              <svg
                className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          </>
        )}
      </button>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
        <svg
          className="w-5 h-5 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <span>Secure SSL encrypted payment</span>
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;
