"use client";

import { DashboardTab } from "@/types";

interface UserDashboardSidebarProps {
  activeTab: DashboardTab;
  customerName?: string;
  customerEmail?: string;
  displayInitial: string;
  loyaltyPoints: number;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
}

const navigationItems = [
  { tab: "overview", label: "Overview", icon: "fa-solid fa-chart-line" },
  { tab: "orders", label: "My Orders", icon: "fa-solid fa-shopping-bag" },
  { tab: "favorites", label: "Favorites", icon: "fa-solid fa-heart" },
  {
    tab: "addresses",
    label: "Addresses",
    icon: "fa-solid fa-location-dot",
  },
  { tab: "settings", label: "Settings", icon: "fa-solid fa-gear" },
] as const;

const UserDashboardSidebar = ({
  activeTab,
  customerName,
  customerEmail,
  displayInitial,
  loyaltyPoints,
  onTabChange,
  onLogout,
}: UserDashboardSidebarProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
      <div className="bg-linear-to-br from-zPink to-pink-600 p-6 text-white text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl text-zPink font-bold">
            {displayInitial}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-1">{customerName || "User"}</h3>
        <p className="text-sm text-white/90 mb-3">{customerEmail || ""}</p>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
          <p className="text-xs text-white/80">Loyalty Points</p>
          <p className="text-2xl font-bold">{loyaltyPoints}</p>
        </div>
      </div>

      <nav className="p-4">
        {navigationItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => onTabChange(item.tab)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
              activeTab === item.tab
                ? "bg-zPink text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <i className={`${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        <div className="border-t border-gray-200 my-4"></div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300"
        >
          <i className="fa-solid fa-right-from-bracket w-5"></i>
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default UserDashboardSidebar;
