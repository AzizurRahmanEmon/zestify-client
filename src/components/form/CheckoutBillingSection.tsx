"use client";
import type {
  CheckoutAlertState,
  CheckoutCustomer,
  CheckoutCustomerAddress,
  CheckoutFormData,
  CheckoutFocusedField,
} from "@/hooks/useCheckoutForm";
import { locationOptions } from "@/data";
import CheckoutFormField from "./CheckoutFormField";
import CheckoutSavedAddresses from "./CheckoutSavedAddresses";

interface CheckoutBillingSectionProps {
  alert: CheckoutAlertState | null;
  customerAddresses: CheckoutCustomerAddress[];
  currentCustomer: CheckoutCustomer | null;
  formData: CheckoutFormData;
  focusedField: CheckoutFocusedField;
  isSubmitting: boolean;
  onAddressSelect: (addr: CheckoutCustomerAddress) => void;
  onCountryChange: (value: string) => void;
  onInputChange: (field: keyof CheckoutFormData, value: string) => void;
  onFocus: (field: string) => void;
  onBlur: (field: string) => void;
  isFieldActive: (field: string, value: string) => boolean;
  onStateChange: (value: string) => void;
}

const CheckoutBillingSection = ({
  alert,
  customerAddresses,
  currentCustomer,
  formData,
  focusedField,
  isSubmitting,
  onAddressSelect,
  onCountryChange,
  onInputChange,
  onFocus,
  onBlur,
  isFieldActive,
  onStateChange,
}: CheckoutBillingSectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Billing Details
        </h2>
        <p className="text-gray-600">
          Please fill in your information to complete your order
        </p>
      </div>

      {alert && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg mb-6 ${
            alert.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
          role="alert"
          aria-live="assertive"
        >
          {alert.type === "success" && (
            <svg
              className="w-5 h-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {alert.type === "danger" && (
            <svg
              className="w-5 h-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>{alert.message}</span>
        </div>
      )}

      <CheckoutSavedAddresses
        addresses={customerAddresses}
        selectedAddress={formData.address}
        onSelect={onAddressSelect}
      />

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <CheckoutFormField
            id="name"
            label="Full Name"
            value={formData.name}
            onChange={(value) => onInputChange("name", value)}
            onFocus={() => onFocus("name")}
            onBlur={() => onBlur("name")}
            disabled={isSubmitting}
            active={isFieldActive("name", formData.name)}
            error={alert?.type === "danger"}
            required
            labelSuffix={<span className="text-red-500">*</span>}
          />

          <CheckoutFormField
            id="email"
            label="Email Address"
            value={formData.email}
            onChange={(value) => onInputChange("email", value)}
            onFocus={() => onFocus("email")}
            onBlur={() => onBlur("email")}
            disabled={isSubmitting}
            readOnly={!!currentCustomer?.token}
            active={isFieldActive("email", formData.email)}
            error={alert?.type === "danger"}
            type="email"
            required
            inputClassName={
              currentCustomer?.token
                ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                : "bg-white"
            }
            labelSuffix={<span className="text-red-500">*</span>}
          />
        </div>

        <CheckoutFormField
          id="country"
          label="Country"
          value={formData.country}
          onChange={onCountryChange}
          disabled={isSubmitting}
          active={!!formData.country || focusedField.country}
          error={alert?.type === "danger"}
          as="select"
          required
          labelSuffix={<span className="text-red-500">*</span>}
          inputClassName="appearance-none cursor-pointer pr-12"
        >
          {locationOptions.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </CheckoutFormField>

        <div className="grid md:grid-cols-2 gap-6">
          <CheckoutFormField
            id="city"
            label="City"
            value={formData.city}
            onChange={(value) => onInputChange("city", value)}
            onFocus={() => onFocus("city")}
            onBlur={() => onBlur("city")}
            disabled={isSubmitting}
            active={isFieldActive("city", formData.city)}
            error={alert?.type === "danger"}
            required
            labelSuffix={<span className="text-red-500">*</span>}
          />

          <CheckoutFormField
            id="state"
            label="State / Province"
            value={formData.state}
            onChange={onStateChange}
            onFocus={() => onFocus("state")}
            onBlur={() => onBlur("state")}
            disabled={isSubmitting}
            active={isFieldActive("state", formData.state)}
            error={alert?.type === "danger"}
            required
            labelSuffix={<span className="text-red-500">*</span>}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <CheckoutFormField
            id="postalCode"
            label="Postal Code"
            value={formData.postalCode}
            onChange={(value) => onInputChange("postalCode", value)}
            onFocus={() => onFocus("postalCode")}
            onBlur={() => onBlur("postalCode")}
            disabled={isSubmitting}
            active={isFieldActive("postalCode", formData.postalCode)}
            error={alert?.type === "danger"}
            required
            labelSuffix={<span className="text-red-500">*</span>}
          />

          <CheckoutFormField
            id="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={(value) => onInputChange("phone", value)}
            onFocus={() => onFocus("phone")}
            onBlur={() => onBlur("phone")}
            disabled={isSubmitting}
            active={isFieldActive("phone", formData.phone)}
            error={alert?.type === "danger"}
            type="tel"
            required
            labelSuffix={<span className="text-red-500">*</span>}
          />
        </div>

        <CheckoutFormField
          id="address"
          label="Street Address"
          value={formData.address}
          onChange={(value) => onInputChange("address", value)}
          onFocus={() => onFocus("address")}
          onBlur={() => onBlur("address")}
          disabled={isSubmitting}
          active={isFieldActive("address", formData.address)}
          error={alert?.type === "danger"}
          required
          labelSuffix={<span className="text-red-500">*</span>}
        />
      </div>

      <div className="pt-8 border-t border-gray-200 mt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Additional Information
        </h3>
        <CheckoutFormField
          id="notes"
          label="Order Notes (Optional)"
          value={formData.notes}
          onChange={(value) => onInputChange("notes", value)}
          onFocus={() => onFocus("notes")}
          onBlur={() => onBlur("notes")}
          disabled={isSubmitting}
          active={isFieldActive("notes", formData.notes)}
          as="textarea"
          rows={4}
          wrapperClassName="relative"
          inputClassName="resize-none"
        />
      </div>
    </div>
  );
};

export default CheckoutBillingSection;
