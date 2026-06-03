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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
      <div className="flex sm:items-center gap-3 flex-col sm:flex-row justify-between mb-6">
        <h2 className="text-xl font-primary font-bold text-stone-900">Saved Addresses</h2>
        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-zPink w-max text-white rounded-lg hover:bg-pink-700 transition-colors duration-300 text-sm font-semibold"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Add New
        </button>
      </div>
      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address._id}
            className="border border-stone-100 rounded-xl p-5 hover:shadow-md hover:border-stone-200 transition-all duration-300 bg-[#f8f5f2]/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zPink/8 border border-zPink/10 rounded-xl flex items-center justify-center text-zPink">
                  <i className="fa-solid fa-location-dot text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{address.label}</h3>
                  {address.isDefault && (
                    <span className="text-[11px] bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">
                      Default
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-stone-500 text-sm">
              {address.address}
              {address.city && `, ${address.city}`}
              {address.zipCode && ` ${address.zipCode}`}
            </p>
            <div className="flex gap-4 mt-4 pt-3 border-t border-stone-100">
              <button
                onClick={() => onEditAddress(address)}
                className="text-sm text-zPink hover:text-pink-700 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <i className="fa-solid fa-pen text-[10px]"></i>
                Edit
              </button>
              <button
                onClick={() => onDeleteAddress(address._id)}
                className="text-sm text-red-400 hover:text-red-600 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <i className="fa-solid fa-trash text-[10px]"></i>
                Delete
              </button>
            </div>
          </div>
        ))}
        {addresses.length === 0 && (
          <div className="text-center py-12 bg-[#f8f5f2] rounded-xl border border-stone-100">
            <i className="fa-solid fa-map-pin text-4xl text-stone-300 mb-3 block"></i>
            <p className="text-stone-500">No addresses saved yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardAddresses;
