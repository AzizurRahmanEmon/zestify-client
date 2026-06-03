"use client";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import CheckoutBillingSection from "./CheckoutBillingSection";
import CheckoutOrderSummary from "./CheckoutOrderSummary";

const CheckoutForm = () => {
  const {
    alert,
    applyCoupon,
    availableLoyaltyPoints,
    couponCode,
    couponDiscount,
    currentCustomer,
    formData,
    focusedField,
    handleAddressSelect,
    handleBlur,
    handleCountryChange,
    handleFocus,
    handleInputChange,
    handleStateChange,
    handleSubmit,
    isFieldActive,
    isSubmitting,
    handleLoyaltyChange,
    loyaltyConfig,
    loyaltyPointsToRedeem,
    maxRedeemablePoints,
    orderTotal,
    setCouponCode,
    shippingFee,
    subtotal,
    customerAddresses,
  } = useCheckoutForm();

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid xl:grid-cols-3 gap-12 xl:gap-16">
        <div className="xl:col-span-2">
          <CheckoutBillingSection
            alert={alert}
            customerAddresses={customerAddresses}
            currentCustomer={currentCustomer}
            formData={formData}
            focusedField={focusedField}
            isSubmitting={isSubmitting}
            onAddressSelect={handleAddressSelect}
            onCountryChange={handleCountryChange}
            onInputChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isFieldActive={isFieldActive}
            onStateChange={handleStateChange}
          />
        </div>

        <div className="xl:col-span-1">
          <CheckoutOrderSummary
            couponCode={couponCode}
            couponDiscount={couponDiscount}
            availableLoyaltyPoints={availableLoyaltyPoints}
            loyaltyPointsToRedeem={loyaltyPointsToRedeem}
            loyaltyConfig={loyaltyConfig}
            maxRedeemablePoints={maxRedeemablePoints}
            isSubmitting={isSubmitting}
            subtotal={subtotal}
            shippingFee={shippingFee}
            orderTotal={orderTotal}
            payment={formData.payment}
            onCouponCodeChange={setCouponCode}
            onApplyCoupon={applyCoupon}
            onLoyaltyChange={handleLoyaltyChange}
            onPaymentChange={handleInputChange}
          />
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
