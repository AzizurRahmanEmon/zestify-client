"use client";
import type { CheckoutCustomerAddress } from "@/hooks/useCheckoutForm";

interface CheckoutSavedAddressesProps {
  addresses: CheckoutCustomerAddress[];
  selectedAddress?: string;
  onSelect: (address: CheckoutCustomerAddress) => void;
}

const CheckoutSavedAddresses = ({
  addresses,
  selectedAddress,
  onSelect,
}: CheckoutSavedAddressesProps) => {
  if (!addresses.length) return null;

  return (
    <div className="mb-8 p-6 bg-pink-50 rounded-2xl border border-pink-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i className="fa-solid fa-location-dot text-zPink"></i>
        Ship to a Saved Address
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <button
            key={addr._id}
            type="button"
            onClick={() => onSelect(addr)}
            className={`text-left p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedAddress === addr.address
                ? "border-zPink bg-white shadow-md"
                : "border-gray-100 bg-white/50 hover:border-pink-200"
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-gray-900">
                {addr.label || "Address"}
              </span>
              {addr.isDefault && (
                <span className="text-[10px] bg-zPink text-white px-2 py-0.5 rounded-full uppercase font-bold">
                  Default
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{addr.address}</p>
            {addr.city && (
              <p className="text-[10px] text-gray-400 mt-1">
                {addr.city} {addr.zipCode}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSavedAddresses;
