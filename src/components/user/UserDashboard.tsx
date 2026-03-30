"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getCurrentCustomer,
  setCurrentCustomer,
  clearCurrentCustomer,
} from "@/lib/auth";
import { API_URL } from "@/lib/api";
import { toast } from "react-toastify";
import Image from "next/image";

const locationOptions = [
  {
    code: "us",
    label: "United States",
    states: [
      {
        code: "CA",
        label: "California",
        cities: ["Los Angeles", "San Diego", "San Francisco"],
      },
      { code: "TX", label: "Texas", cities: ["Houston", "Dallas", "Austin"] },
      {
        code: "NY",
        label: "New York",
        cities: ["New York City", "Buffalo", "Rochester"],
      },
      { code: "FL", label: "Florida", cities: ["Miami", "Orlando", "Tampa"] },
    ],
  },
  {
    code: "de",
    label: "Germany",
    states: [
      { code: "BE", label: "Berlin", cities: ["Berlin"] },
      { code: "BY", label: "Bavaria", cities: ["Munich", "Nuremberg"] },
      {
        code: "NW",
        label: "North Rhine-Westphalia",
        cities: ["Cologne", "Düsseldorf"],
      },
      { code: "HH", label: "Hamburg", cities: ["Hamburg"] },
    ],
  },
  {
    code: "uk",
    label: "United Kingdom",
    states: [
      {
        code: "ENG",
        label: "England",
        cities: ["London", "Manchester", "Birmingham"],
      },
      { code: "SCT", label: "Scotland", cities: ["Edinburgh", "Glasgow"] },
      { code: "WLS", label: "Wales", cities: ["Cardiff", "Swansea"] },
      { code: "NIR", label: "Northern Ireland", cities: ["Belfast"] },
    ],
  },
  {
    code: "fr",
    label: "France",
    states: [
      { code: "IDF", label: "Île-de-France", cities: ["Paris"] },
      {
        code: "PAC",
        label: "Provence-Alpes-Côte d’Azur",
        cities: ["Marseille", "Nice"],
      },
      {
        code: "ARA",
        label: "Auvergne-Rhône-Alpes",
        cities: ["Lyon", "Grenoble"],
      },
      { code: "NAQ", label: "Nouvelle-Aquitaine", cities: ["Bordeaux"] },
    ],
  },
] as const;

const UserDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") ?? "overview";
  const [customer, setCustomer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Stats state
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
  });

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    isDefault: false,
  });

  // Favorites state
  const [favorites, setFavorites] = useState<any[]>([]);

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const base = API_URL;

  const fetchDashboardData = async () => {
    const c = getCurrentCustomer();
    if (!c || !c.token) {
      router.push("/login");
      return;
    }

    // Set initial values from localStorage while loading
    setCustomer(c);
    setName(c.name || "");
    setEmail(c.email || "");
    setPhone(c.phone || "");

    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${c.token}`,
        "Content-Type": "application/json",
      };

      // Parallel fetch
      const [profileRes, statsRes, ordersRes] = await Promise.all([
        fetch(`${base}/customers/me`, { headers }),
        fetch(`${base}/customers/me/stats`, { headers }),
        fetch(`${base}/orders/mine`, { headers }),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        const updatedCustomer = { ...c, ...profileData.data };
        setCustomer(updatedCustomer);
        setAddresses(profileData.data.savedAddresses || []);
        setName(profileData.data.name || "");
        setEmail(profileData.data.email || "");
        setPhone(profileData.data.phone || "");
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.data);

        // Calculate favorites (most ordered items)
        const itemCounts: Record<string, any> = {};
        ordersData.data.forEach((order: any) => {
          order.items.forEach((item: any) => {
            const productId = item.product?._id || item.product;
            if (productId) {
              if (!itemCounts[productId]) {
                itemCounts[productId] = {
                  count: 0,
                  product: item.product,
                };
              }
              itemCounts[productId].count += item.quantity;
            }
          });
        });

        const sortedFavorites = Object.values(itemCounts)
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 6)
          .map((f: any) => f.product);

        setFavorites(sortedFavorites);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const loyaltyPoints = customer?.loyaltyPoints ?? 0;
  const displayInitial = (customer?.name || "User").charAt(0);

  const setActiveTab = (tab: string) => {
    router.push(`/dashboard?tab=${tab}`);
  };

  const handleLogout = () => {
    clearCurrentCustomer();
    router.push("/login");
  };

  const handleSaveProfile = async () => {
    const c = getCurrentCustomer();
    if (!c || !c.token) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`${base}/customers/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${c.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Update failed");
      }

      const json = await res.json();
      const updatedCustomer = { ...customer, ...json.data };
      setCurrentCustomer(updatedCustomer);
      setCustomer(updatedCustomer);
      toast.success("Profile updated successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const c = getCurrentCustomer();
    if (!c || !c.token) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${base}/customers/me/password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${c.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to change password");
      }

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      toast.error(e.message || "Failed to change password");
    }
  };

  const handleAddOrUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const c = getCurrentCustomer();
    if (!c || !c.token) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return;
    }
    try {
      const method = editingAddress ? "PUT" : "POST";
      const url = editingAddress
        ? `${base}/customers/me/addresses/${editingAddress._id}`
        : `${base}/customers/me/addresses`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${c.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressForm),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save address");
      }

      const json = await res.json();
      setAddresses(json.data);
      setIsAddressModalOpen(false);
      setEditingAddress(null);
      setAddressForm({
        label: "",
        address: "",
        country: "",
        state: "",
        city: "",
        zipCode: "",
        isDefault: false,
      });
      toast.success(
        `Address ${editingAddress ? "updated" : "added"} successfully`,
      );
    } catch (e: any) {
      toast.error(e.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    const c = getCurrentCustomer();
    if (!c || !c.token) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `${base}/customers/me/addresses/${addressToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${c.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete address");
      }

      const json = await res.json();
      setAddresses(json.data);
      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
      toast.success("Address deleted successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete address");
    }
  };

  const openDeleteModal = (id: string) => {
    setAddressToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const openEditAddressModal = (address: any) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label,
      address: address.address,
      country: address.country || "",
      state: address.state || "",
      city: address.city || "",
      zipCode: address.zipCode || "",
      isDefault: address.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-zPink border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Order Details Modal */}
      {isOrderModalOpen && selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-150 transition-opacity"
            onClick={() => setIsOrderModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-160 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">
                Order Details - {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedOrder.status === "delivered"
                        ? "bg-green-100 text-green-600"
                        : selectedOrder.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-bold">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-4">Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-16 h-16 bg-white rounded-lg shrink-0 relative overflow-hidden">
                        <Image
                          src={item.product?.image || "/assets/img/dish-1.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold text-zPink">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>${selectedOrder.tax.toFixed(2)}</span>
                </div>
                {selectedOrder.deliveryFee > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-zPink">
                    ${selectedOrder.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {selectedOrder.deliveryAddress && (
                <div className="bg-pink-50 p-4 rounded-xl">
                  <h4 className="font-bold text-zPink mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-location-dot"></i>
                    Delivery Address
                  </h4>
                  <p className="text-sm text-gray-700">
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Address Modal */}
      {isAddressModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-150 transition-opacity"
            onClick={() => setIsAddressModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-160 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleAddOrUpdateAddress} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label (e.g., Home, Office)
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.label}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, label: e.target.value })
                    }
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
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        country: e.target.value,
                        state: "",
                        city: "",
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select Country</option>
                    {locationOptions.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
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
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, address: e.target.value })
                  }
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
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        state: e.target.value,
                        city: "",
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">Select State</option>
                    {addressForm.country &&
                      locationOptions
                        .find((c) => c.code === addressForm.country)
                        ?.states.map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.label}
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
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">Select City</option>
                    {addressForm.country &&
                      addressForm.state &&
                      locationOptions
                        .find((c) => c.code === addressForm.country)
                        ?.states.find((s) => s.code === addressForm.state)
                        ?.cities.map((city) => (
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
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      zipCode: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent"
                  placeholder="10001"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: e.target.checked,
                    })
                  }
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
      )}

      {/* Main Dashboard Content */}
      <div className="ar-container py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
              {/* User Profile Card */}
              <div className="bg-linear-to-br from-zPink to-pink-600 p-6 text-white text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl text-zPink font-bold">
                    {displayInitial}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">
                  {customer?.name || "User"}
                </h3>
                <p className="text-sm text-white/90 mb-3">
                  {customer?.email || ""}
                </p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-xs text-white/80">Loyalty Points</p>
                  <p className="text-2xl font-bold">{loyaltyPoints}</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
                    activeTab === "overview"
                      ? "bg-zPink text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className="fa-solid fa-chart-line w-5"></i>
                  <span className="font-medium">Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
                    activeTab === "orders"
                      ? "bg-zPink text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className="fa-solid fa-shopping-bag w-5"></i>
                  <span className="font-medium">My Orders</span>
                </button>

                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
                    activeTab === "favorites"
                      ? "bg-zPink text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className="fa-solid fa-heart w-5"></i>
                  <span className="font-medium">Favorites</span>
                </button>

                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
                    activeTab === "addresses"
                      ? "bg-zPink text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className="fa-solid fa-location-dot w-5"></i>
                  <span className="font-medium">Addresses</span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
                    activeTab === "settings"
                      ? "bg-zPink text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className="fa-solid fa-gear w-5"></i>
                  <span className="font-medium">Settings</span>
                </button>

                <div className="border-t border-gray-200 my-4"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300"
                >
                  <i className="fa-solid fa-right-from-bracket w-5"></i>
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                        <i className="fa-solid fa-shopping-bag"></i>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {stats.totalOrders}
                      </span>
                    </div>
                    <h3 className="text-gray-600 font-medium">Total Orders</h3>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                        <i className="fa-solid fa-dollar-sign"></i>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        ${(stats.totalSpent || 0).toFixed(2)}
                      </span>
                    </div>
                    <h3 className="text-gray-600 font-medium">Total Spent</h3>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-linear-to-br from-zPink to-pink-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {loyaltyPoints}
                      </span>
                    </div>
                    <h3 className="text-gray-600 font-medium">
                      Loyalty Points
                    </h3>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Recent Orders
                    </h2>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-zPink hover:text-pink-600 font-medium text-sm"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                        onClick={() => openOrderDetails(order)}
                      >
                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                          <div className="w-12 h-12 bg-zPink/10 rounded-xl flex items-center justify-center text-zPink">
                            <i className="fa-solid fa-receipt"></i>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()} •{" "}
                              {order.items.length} items
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-600"
                                : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                          <span className="font-bold text-gray-900">
                            ${(order.totalAmount || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="text-center py-8">
                        <i className="fa-solid fa-box-open text-4xl text-gray-300 mb-3 block"></i>
                        <p className="text-gray-500">No orders found yet</p>
                        <Link
                          href="/menu"
                          className="text-zPink font-medium mt-2 inline-block"
                        >
                          Order something delicious!
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-linear-to-br from-zPink to-pink-600 rounded-2xl p-8 text-white shadow-lg">
                  <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                      href="/menu"
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-300 text-center group"
                    >
                      <i className="fa-solid fa-utensils text-3xl mb-2 group-hover:scale-110 transition-transform duration-300"></i>
                      <p className="font-medium">Browse Menu</p>
                    </Link>
                    <Link
                      href="/reservation"
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-300 text-center group"
                    >
                      <i className="fa-solid fa-calendar text-3xl mb-2 group-hover:scale-110 transition-transform duration-300"></i>
                      <p className="font-medium">Make Reservation</p>
                    </Link>
                    <button
                      onClick={() => setActiveTab("favorites")}
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-300 text-center group"
                    >
                      <i className="fa-solid fa-heart text-3xl mb-2 group-hover:scale-110 transition-transform duration-300"></i>
                      <p className="font-medium">My Favorites</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order History
                </h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`mt-2 sm:mt-0 px-4 py-2 rounded-full text-sm font-medium w-max ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-600"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <p className="text-gray-600">
                          {order.items.length} items
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-gray-900">
                            ${order.totalAmount.toFixed(2)}
                          </span>
                          <button
                            onClick={() => openOrderDetails(order)}
                            className="px-4 py-2 bg-zPink text-white rounded-lg hover:bg-pink-600 transition-colors duration-300 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="text-center py-12">
                      <i className="fa-solid fa-receipt text-6xl text-gray-200 mb-4 block"></i>
                      <h3 className="text-xl font-bold text-gray-900">
                        No orders yet
                      </h3>
                      <p className="text-gray-500 mt-2">
                        When you make an order, it will appear here.
                      </p>
                      <Link
                        href="/menu"
                        className="mt-6 inline-block px-6 py-3 bg-zPink text-white rounded-xl font-bold hover:bg-pink-600 transition-all"
                      >
                        Start Ordering
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Most Ordered Items
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((item: any) => (
                    <div
                      key={item._id}
                      className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
                    >
                      <div className="h-64 bg-gray-200 relative overflow-hidden">
                        <Image
                          src={item.image || "/assets/img/dish-1.png"}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <span className="text-xs font-medium text-zPink bg-pink-50 px-3 py-1 rounded-full w-fit">
                          {item.category}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-between mt-auto pt-4">
                          <span className="text-2xl font-black text-zPink">
                            ${item.price ? item.price.toFixed(2) : "0.00"}
                          </span>
                          <Link
                            href={`/shop/${item.slug || item._id}`}
                            className="px-6 py-2.5 bg-zPink text-white rounded-xl hover:bg-pink-600 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-pink-200"
                          >
                            Order Again
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  {favorites.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <i className="fa-solid fa-heart-crack text-6xl text-gray-200 mb-4 block"></i>
                      <h3 className="text-xl font-bold text-gray-900">
                        No favorites yet
                      </h3>
                      <p className="text-gray-500 mt-2">
                        Your most ordered items will appear here automatically.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Saved Addresses
                  </h2>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressForm({
                        label: "",
                        address: "",
                        country: "",
                        state: "",
                        city: "",
                        zipCode: "",
                        isDefault: false,
                      });
                      setIsAddressModalOpen(true);
                    }}
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
                            <h3 className="font-bold text-gray-900">
                              {address.label}
                            </h3>
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
                          onClick={() => openEditAddressModal(address)}
                          className="text-sm text-zPink hover:text-pink-600 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(address._id)}
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
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Account Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address (Cannot be changed)
                      </label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      className="w-full bg-zPink text-white py-3 rounded-lg hover:bg-pink-600 transition-colors duration-300 font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-150 transition-opacity"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-2xl z-160 overflow-hidden p-8 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              <i className="fa-solid fa-trash-can"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Delete Address?
            </h3>
            <p className="text-gray-600 mb-8">
              Are you sure you want to delete this address? This action cannot
              be undone.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAddress}
                className="py-3 px-6 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
