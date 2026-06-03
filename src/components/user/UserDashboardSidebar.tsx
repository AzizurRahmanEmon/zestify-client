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
    <div className="bg-linear-to-br from-gray-900 via-gray-900 to-black rounded-2xl shadow-2xl overflow-hidden sticky top-24 border border-white/5">
      <div className="relative p-6 text-white text-center">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-20 h-20 bg-zPink rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-zOrange rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full border-[3px] border-zPink/60 shadow-lg overflow-hidden bg-white">
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-3xl text-zPink font-bold">
              {displayInitial}
            </div>
          </div>
          <h3 className="text-xl font-primary font-bold mb-0.5">{customerName || "User"}</h3>
          <p className="text-sm text-gray-400 mb-4">{customerEmail || ""}</p>
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">Loyalty Points</p>
            <p className="text-2xl font-bold text-zOrange mt-0.5">{loyaltyPoints}</p>
          </div>
        </div>
      </div>

      <nav className="p-4 pt-2">
        {navigationItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => onTabChange(item.tab)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-1.5 ${
              activeTab === item.tab
                ? "bg-zPink text-white shadow-lg shadow-zPink/20"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <i className={`${item.icon} w-5 text-sm`}></i>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}

        <div className="border-t border-white/10 my-3"></div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
        >
          <i className="fa-solid fa-right-from-bracket w-5 text-sm"></i>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default UserDashboardSidebar;
