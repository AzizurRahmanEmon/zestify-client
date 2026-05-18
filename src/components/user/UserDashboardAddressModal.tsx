"use client";

import { locationOptions } from "@/data";
import { DashboardAddress, DashboardAddressForm } from "@/types";

interface UserDashboardAddressModalProps {
  open: boolean;
  editingAddress: DashboardAddress | null;
  addressForm: DashboardAddressForm;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onLabelChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onZipCodeChange: (value: string) => void;
  onDefaultChange: (value: boolean) => void;
}

const UserDashboardAddressModal = ({
  open,
  editingAddress,
  addressForm,
  onClose,
  onSubmit,
  onLabelChange,
  onAddressChange,
  onCountryChange,
  onStateChange,
  onCityChange,
  onZipCodeChange,
  onDefaultChange,
}: UserDashboardAddressModalProps) => {
  if (!open) {
    return null;
  }

  const selectedCountry = locationOptions.find(
    (country) => country.code === addressForm.country,
  );

  const selectedState = selectedCountry?.states.find(
    (state) => state.code === addressForm.state,
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-150 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-160 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-900">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label (e.g., Home, Office)
              </label>
              <input
                type="text"
                required
                value={addressForm.label}
                onChange={(e) => onLabelChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent"
                placeholder="Home"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                required
                value={addressForm.country}
                onChange={(e) => onCountryChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent appearance-none bg-white"
              >
                <option value="">Select Country</option>
                {locationOptions.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Address
            </label>
            <textarea
              required
              value={addressForm.address}
              onChange={(e) => onAddressChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent h-24"
              placeholder="123 Street Name, Apartment..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State / Province
              </label>
              <select
                required
                disabled={!addressForm.country}
                value={addressForm.state}
                onChange={(e) => onStateChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Select State</option>
                {selectedCountry?.states.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                required
                disabled={!addressForm.state}
                value={addressForm.city}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Select City</option>
                {selectedState?.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zip Code
            </label>
            <input
              type="text"
              required
              value={addressForm.zipCode}
              onChange={(e) => onZipCodeChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent"
              placeholder="10001"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) => onDefaultChange(e.target.checked)}
              className="w-5 h-5 text-zPink rounded focus:ring-zPink"
            />
            <span className="text-gray-700">Set as default address</span>
          </label>
          <button
            type="submit"
            className="w-full bg-zPink text-white py-4 rounded-lg hover:bg-pink-600 transition-colors duration-300 font-bold text-lg"
          >
            {editingAddress ? "Update Address" : "Save Address"}
          </button>
        </form>
      </div>
    </>
  );
};

export default UserDashboardAddressModal;
