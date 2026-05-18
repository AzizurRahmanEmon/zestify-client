"use client";

import { DashboardAddress } from "@/types";

interface UserDashboardAddressesProps {
  addresses: DashboardAddress[];
  onAddNew: () => void;
  onEditAddress: (address: DashboardAddress) => void;
  onDeleteAddress: (addressId: string) => void;
}

const UserDashboardAddresses = ({
  addresses,
  onAddNew,
  onEditAddress,
  onDeleteAddress,
}: UserDashboardAddressesProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-zPink text-white rounded-lg hover:bg-pink-600 transition-colors duration-300 text-sm font-medium"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Add New
        </button>
      </div>
      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address._id}
            className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zPink/10 rounded-lg flex items-center justify-center text-zPink">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{address.label}</h3>
                  {address.isDefault && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                      Default
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              {address.address}
              {address.city && `, ${address.city}`}
              {address.zipCode && ` ${address.zipCode}`}
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => onEditAddress(address)}
                className="text-sm text-zPink hover:text-pink-600 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteAddress(address._id)}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {addresses.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <i className="fa-solid fa-map-pin text-4xl text-gray-300 mb-3 block"></i>
            <p className="text-gray-500">No addresses saved yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardAddresses;
