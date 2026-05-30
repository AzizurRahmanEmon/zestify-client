"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import {
  clearCustomerSession,
  getCurrentCustomer,
  setCurrentCustomer,
} from "@/lib/auth";
import { API_URL } from "@/lib/api";
import {
  DashboardAddress,
  DashboardAddressForm,
  DashboardCustomer,
  DashboardFavoriteItem,
  DashboardOrder,
  DashboardStats,
  DashboardTab,
} from "@/types";

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "";

const DEFAULT_ADDRESS_FORM: DashboardAddressForm = {
  label: "",
  address: "",
  country: "",
  state: "",
  city: "",
  zipCode: "",
  isDefault: false,
};

const toFavoriteItem = (
  productId: string,
  name: string,
  product: DashboardOrder["items"][number]["product"],
): DashboardFavoriteItem => {
  if (typeof product === "object" && product) {
    return {
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      category: product.category,
      slug: product.slug,
    };
  }

  return {
    _id: productId,
    name,
  };
};

const useUserDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams?.get("tab") ?? "overview") as DashboardTab;

  const [customer, setCustomer] = useState<DashboardCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
  });
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DashboardOrder | null>(
    null,
  );
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<DashboardAddress[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<DashboardAddress | null>(
    null,
  );
  const [addressForm, setAddressForm] =
    useState<DashboardAddressForm>(DEFAULT_ADDRESS_FORM);
  const [favorites, setFavorites] = useState<DashboardFavoriteItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const base = API_URL;

  const resetAddressForm = useCallback(() => {
    setAddressForm(DEFAULT_ADDRESS_FORM);
  }, []);

  const openAddAddressModal = useCallback(() => {
    setEditingAddress(null);
    resetAddressForm();
    setIsAddressModalOpen(true);
  }, [resetAddressForm]);

  const openEditAddressModal = useCallback((address: DashboardAddress) => {
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
  }, []);

  const openOrderDetails = useCallback((order: DashboardOrder) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  }, []);

  const setActiveTab = useCallback(
    (tab: DashboardTab) => {
      router.push(`/dashboard?tab=${tab}`);
    },
    [router],
  );

  const handleViewAllOrders = useCallback(() => {
    router.push("/dashboard?tab=orders");
  }, [router]);

  const handleViewFavorites = useCallback(() => {
    router.push("/dashboard?tab=favorites");
  }, [router]);

  const handleLogout = useCallback(() => {
    clearCustomerSession();
    router.push("/login");
  }, [router]);

  const fetchDashboardData = useCallback(async () => {
    // Wait for client-side hydration before checking auth
    if (!isMounted.current) return;
    const currentCustomer = getCurrentCustomer() as DashboardCustomer | null;
    if (!currentCustomer || !currentCustomer.token) {
      router.push("/login");
      return;
    }

    setCustomer(currentCustomer);
    setName(currentCustomer.name || "");
    setEmail(currentCustomer.email || "");
    setPhone(currentCustomer.phone || "");

    try {
      setLoading(true);
      const headers: Record<string, string> = {
        Authorization: `Bearer ${currentCustomer.token}`,
        "Content-Type": "application/json",
        ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
      };

      const [profileRes, statsRes, ordersRes] = await Promise.all([
        fetch(`${base}/customers/me`, { headers, cache: "no-store" }),
        fetch(`${base}/customers/me/stats`, { headers, cache: "no-store" }),
        fetch(`${base}/orders/mine`, { headers, cache: "no-store" }),
      ]);

      if (profileRes.ok) {
        const profileJson = (await profileRes.json()) as {
          data: Partial<DashboardCustomer> & {
            savedAddresses?: DashboardAddress[];
          };
        };
        const updatedCustomer = { ...currentCustomer, ...profileJson.data };
        setCustomer(updatedCustomer);
        setAddresses(profileJson.data.savedAddresses || []);
        setName(profileJson.data.name || "");
        setEmail(profileJson.data.email || "");
        setPhone(profileJson.data.phone || "");
      }

      if (statsRes.ok) {
        const statsJson = (await statsRes.json()) as { data: DashboardStats };
        setStats(statsJson.data);
      }

      if (ordersRes.ok) {
        const ordersJson = (await ordersRes.json()) as {
          data: DashboardOrder[];
        };
        setOrders(ordersJson.data);

        const itemCounts: Record<
          string,
          { count: number; product: DashboardFavoriteItem }
        > = {};

        ordersJson.data.forEach((order) => {
          order.items.forEach((item) => {
            const productId =
              typeof item.product === "object" && item.product
                ? item.product._id
                : item.product;

            if (!productId) {
              return;
            }

            if (!itemCounts[productId]) {
              itemCounts[productId] = {
                count: 0,
                product: toFavoriteItem(productId, item.name, item.product),
              };
            }

            itemCounts[productId].count += item.quantity;
          });
        });

        const sortedFavorites = Object.values(itemCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 6)
          .map((entry) => entry.product);

        setFavorites(sortedFavorites);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [base, router]);

  useEffect(() => {
    isMounted.current = true;
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSaveProfile = useCallback(async () => {
    const currentCustomer = getCurrentCustomer() as DashboardCustomer | null;
    if (!currentCustomer || !currentCustomer.token) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${base}/customers/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${currentCustomer.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });

      if (!res.ok) {
        const error = (await res.json()) as { message?: string };
        throw new Error(error.message || "Update failed");
      }

      const json = (await res.json()) as {
        data: Partial<DashboardCustomer>;
      };
      const updatedCustomer: DashboardCustomer & {
        name: string;
        email: string;
      } = {
        ...(customer ?? currentCustomer),
        ...json.data,
        name: json.data.name ?? customer?.name ?? currentCustomer.name ?? "",
        email:
          json.data.email ?? customer?.email ?? currentCustomer.email ?? "",
      };
      setCurrentCustomer(updatedCustomer);
      setCustomer(updatedCustomer);
      toast.success("Profile updated successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    }
  }, [base, customer, name, phone, router]);

  const handleAddOrUpdateAddress = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const currentCustomer = getCurrentCustomer() as DashboardCustomer | null;
      if (!currentCustomer || !currentCustomer.token) {
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
            Authorization: `Bearer ${currentCustomer.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressForm),
        });

        if (!res.ok) {
          const error = (await res.json()) as { message?: string };
          throw new Error(error.message || "Failed to save address");
        }

        const json = (await res.json()) as { data: DashboardAddress[] };
        setAddresses(json.data);
        setIsAddressModalOpen(false);
        setEditingAddress(null);
        resetAddressForm();
        toast.success(
          `Address ${editingAddress ? "updated" : "added"} successfully`,
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to save address";
        toast.error(message);
      }
    },
    [addressForm, base, editingAddress, resetAddressForm, router],
  );

  const handleDeleteAddress = useCallback(async () => {
    if (!addressToDelete) return;

    const currentCustomer = getCurrentCustomer() as DashboardCustomer | null;
    if (!currentCustomer || !currentCustomer.token) {
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
            Authorization: `Bearer ${currentCustomer.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        const error = (await res.json()) as { message?: string };
        throw new Error(error.message || "Failed to delete address");
      }

      const json = (await res.json()) as { data: DashboardAddress[] };
      setAddresses(json.data);
      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
      toast.success("Address deleted successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete address";
      toast.error(message);
    }
  }, [addressToDelete, base, router]);

  const openDeleteModal = useCallback((id: string) => {
    setAddressToDelete(id);
    setIsDeleteModalOpen(true);
  }, []);

  const handleAddressLabelChange = useCallback((value: string) => {
    setAddressForm((prev) => ({ ...prev, label: value }));
  }, []);

  const handleAddressAddressChange = useCallback((value: string) => {
    setAddressForm((prev) => ({ ...prev, address: value }));
  }, []);

  const handleAddressCountryChange = useCallback((value: string) => {
    setAddressForm((prev) => ({
      ...prev,
      country: value,
      state: "",
      city: "",
    }));
  }, []);

  const handleAddressStateChange = useCallback((value: string) => {
    setAddressForm((prev) => ({ ...prev, state: value, city: "" }));
  }, []);

  const handleAddressCityChange = useCallback((value: string) => {
    setAddressForm((prev) => ({ ...prev, city: value }));
  }, []);

  const handleAddressZipCodeChange = useCallback((value: string) => {
    setAddressForm((prev) => ({ ...prev, zipCode: value }));
  }, []);

  const handleAddressDefaultChange = useCallback((value: boolean) => {
    setAddressForm((prev) => ({ ...prev, isDefault: value }));
  }, []);

  return {
    activeTab,
    loading,
    customer,
    stats,
    orders,
    selectedOrder,
    isOrderModalOpen,
    addresses,
    isAddressModalOpen,
    isDeleteModalOpen,
    editingAddress,
    addressForm,
    favorites,
    name,
    email,
    phone,
    loyaltyPoints: customer?.loyaltyPoints ?? 0,
    displayInitial: (customer?.name || "User").charAt(0),
    setActiveTab,
    handleLogout,
    handleViewAllOrders,
    handleViewFavorites,
    openOrderDetails,
    openAddAddressModal,
    openEditAddressModal,
    openDeleteModal,
    handleSaveProfile,
    handleAddOrUpdateAddress,
    handleDeleteAddress,
    setIsOrderModalOpen,
    setIsAddressModalOpen,
    setIsDeleteModalOpen,
    handleAddressLabelChange,
    handleAddressAddressChange,
    handleAddressCountryChange,
    handleAddressStateChange,
    handleAddressCityChange,
    handleAddressZipCodeChange,
    handleAddressDefaultChange,
    setName,
    setPhone,
  };
};

export default useUserDashboard;
