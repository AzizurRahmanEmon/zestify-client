"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/api";
import { useCustomContext } from "@/context/context";
import { getCurrentCustomer } from "@/lib/auth";

const ALERT_DURATION = 4000;
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID;

export interface CheckoutFormData {
  name: string;
  email: string;
  country: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  address: string;
  notes: string;
  payment: string;
}

export interface CheckoutAlertState {
  type: "success" | "danger";
  message: string;
}

export interface CheckoutCustomerAddress {
  _id: string;
  label?: string;
  address: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  isDefault?: boolean;
}

export interface CheckoutCustomer {
  _id?: string;
  id?: string;
  token?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface CheckoutLoyaltyConfig {
  loyaltyPointValue: number;
  minimumPointsToRedeem: number;
}

export type CheckoutFocusedField = Record<string, boolean>;

const createInitialFormData = (): CheckoutFormData => ({
  name: "",
  email: "",
  country: "",
  city: "",
  state: "",
  postalCode: "",
  phone: "",
  address: "",
  notes: "",
  payment: "",
});

export const useCheckoutForm = () => {
  const router = useRouter();
  const { cartList, totalCartPrice, clearCart } = useCustomContext();
  const [formData, setFormData] = useState<CheckoutFormData>(
    createInitialFormData(),
  );
  const [focusedField, setFocusedField] = useState<CheckoutFocusedField>({
    name: false,
    email: false,
    postalCode: false,
    phone: false,
    address: false,
    notes: false,
  });
  const [alert, setAlert] = useState<CheckoutAlertState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerAddresses, setCustomerAddresses] = useState<
    CheckoutCustomerAddress[]
  >([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState(0);
  const [availableLoyaltyPoints, setAvailableLoyaltyPoints] = useState(0);
  const [loyaltyConfig, setLoyaltyConfig] = useState<CheckoutLoyaltyConfig>({
    loyaltyPointValue: 1,
    minimumPointsToRedeem: 10,
  });
  const [currentCustomer, setCurrentCustomer] =
    useState<CheckoutCustomer | null>(null);

  const handleAddressSelect = useCallback((addr: CheckoutCustomerAddress) => {
    setFormData((prev) => ({
      ...prev,
      address: addr.address,
      country: addr.country || "",
      state: addr.state || "",
      city: addr.city || "",
      postalCode: addr.zipCode || "",
    }));
    setFocusedField({
      address: true,
      country: true,
      state: true,
      city: true,
      postalCode: true,
    });
  }, []);

  useEffect(() => {
    const customer = getCurrentCustomer() as CheckoutCustomer | null;
    setCurrentCustomer(customer);
    if (!customer?.token) return;

    setFormData((prev) => ({
      ...prev,
      name: customer.name || prev.name,
      email: customer.email || prev.email,
      phone: customer.phone || prev.phone,
    }));

    fetch(`${API_URL}/customers/me`, {
      headers: {
        Authorization: `Bearer ${customer.token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data.savedAddresses) {
          setCustomerAddresses(json.data.savedAddresses);
          setAvailableLoyaltyPoints(Number(json.data.loyaltyPoints || 0));
          const defaultAddr = json.data.savedAddresses.find(
            (addr: CheckoutCustomerAddress) => addr.isDefault,
          );
          if (defaultAddr) {
            setFormData((prev) => ({
              ...prev,
              address: defaultAddr.address,
              country: defaultAddr.country || "",
              state: defaultAddr.state || "",
              city: defaultAddr.city || "",
              postalCode: defaultAddr.zipCode || "",
            }));
            setFocusedField({
              address: true,
              country: true,
              state: true,
              city: true,
              postalCode: true,
            });
          }
        }
      })
      .catch((err) => console.error("Error fetching addresses:", err));

    const savedCoupon = localStorage.getItem("appliedCoupon");
    if (savedCoupon) {
      setCouponCode(savedCoupon);
      fetch(`${API_URL}/coupons/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
        },
        body: JSON.stringify({
          code: savedCoupon,
          subtotal: subtotalRef.current,
        }),
      })
        .then((res) => res.json().catch(() => ({})))
        .then((json) => {
          if (json?.success) {
            setCouponDiscount(Number(json?.data?.discountAmount || 0));
          } else {
            setCouponDiscount(0);
            localStorage.removeItem("appliedCoupon");
          }
        })
        .catch(() => {
          setCouponDiscount(0);
          localStorage.removeItem("appliedCoupon");
        });
    }

    fetch(`${API_URL}/settings`, {
      headers: {
        ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const data = json?.data || {};
        setLoyaltyConfig({
          loyaltyPointValue: Number(data.loyaltyPointValue || 1),
          minimumPointsToRedeem: Number(data.minimumPointsToRedeem || 10),
        });
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(null);
    }, ALERT_DURATION);

    return () => clearTimeout(timer);
  }, [alert]);

  const validateEmail = useCallback((email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, []);

  const validatePhone = useCallback((phone: string): boolean => {
    const regex = /^[\d\s()+-]+$/;
    return regex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  }, []);

  const validatePostalCode = useCallback((postalCode: string): boolean => {
    return postalCode.length >= 4;
  }, []);

  const handleInputChange = useCallback(
    (field: keyof CheckoutFormData, value: string) => {
      if (field === "email" && currentCustomer?.token) return;
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (alert?.type === "danger") {
        setAlert(null);
      }
    },
    [alert?.type, currentCustomer?.token],
  );

  const handleCountryChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({
        ...prev,
        country: value,
        state: "",
        city: "",
      }));

      if (alert?.type === "danger") {
        setAlert(null);
      }
    },
    [alert?.type],
  );

  const handleStateChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({
        ...prev,
        state: value,
        city: "",
      }));

      if (alert?.type === "danger") {
        setAlert(null);
      }
    },
    [alert?.type],
  );

  const handleFocus = useCallback((field: string) => {
    setFocusedField((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleBlur = useCallback((field: string) => {
    setFocusedField((prev) => ({ ...prev, [field]: false }));
  }, []);

  const isFieldActive = useCallback(
    (field: string, value: string) => {
      return !!focusedField[field] || value !== "";
    },
    [focusedField],
  );

  const focusField = useCallback((field: keyof CheckoutFormData) => {
    const element = document.getElementById(field);
    element?.focus();
  }, []);

  const subtotal = useMemo(() => Number(totalCartPrice || 0), [totalCartPrice]);
  const subtotalRef = useRef(subtotal);
  useEffect(() => {
    subtotalRef.current = subtotal;
  }, [subtotal]);

  const shippingFee = 10;

  const maxRedeemablePoints = useMemo(() => {
    const pointValue = Number(loyaltyConfig.loyaltyPointValue || 1);
    const maxByOrder = Math.floor(
      Math.max(0, subtotal + shippingFee - Math.max(0, couponDiscount)) /
        pointValue,
    );
    return Math.min(availableLoyaltyPoints, maxByOrder);
  }, [
    availableLoyaltyPoints,
    couponDiscount,
    loyaltyConfig.loyaltyPointValue,
    subtotal,
  ]);

  const loyaltyDiscountAmount = useMemo(() => {
    const raw =
      Math.max(0, Math.floor(loyaltyPointsToRedeem)) *
      Number(loyaltyConfig.loyaltyPointValue || 1);
    const maxAllowed = Math.max(
      0,
      subtotal + shippingFee - Math.max(0, couponDiscount),
    );
    return Math.min(raw, maxAllowed);
  }, [
    couponDiscount,
    loyaltyConfig.loyaltyPointValue,
    loyaltyPointsToRedeem,
    subtotal,
  ]);

  const orderTotal = useMemo(() => {
    return Math.max(
      0,
      subtotal +
        shippingFee -
        Math.max(0, couponDiscount) -
        loyaltyDiscountAmount,
    );
  }, [couponDiscount, loyaltyDiscountAmount, subtotal]);

  const handleLoyaltyChange = useCallback(
    (value: number) => {
      const clamped = Math.max(
        0,
        Math.min(Math.floor(value || 0), availableLoyaltyPoints),
      );
      setLoyaltyPointsToRedeem(clamped);
    },
    [availableLoyaltyPoints],
  );

  const applyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      setCouponDiscount(0);
      return;
    }

    const res = await fetch(`${API_URL}/coupons/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
      },
      body: JSON.stringify({
        code: couponCode.trim(),
        subtotal,
      }),
    });

    const json = await res.json().catch(() => ({}));
    if (res.ok && json?.success) {
      setCouponDiscount(Number(json?.data?.discountAmount || 0));
      toast.success("Coupon applied");
    } else {
      setCouponDiscount(0);
      toast.error(json?.message || "Invalid coupon");
    }
  }, [couponCode, subtotal]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
        payment: formData.payment.trim(),
      };

      setAlert(null);

      if (!cartList.length) {
        setAlert({ type: "danger", message: "Your cart is empty." });
        toast.error("Your cart is empty.", { autoClose: ALERT_DURATION });
        return;
      }

      if (!trimmedData.name) {
        setAlert({ type: "danger", message: "Full name is required." });
        toast.error("Please enter your full name.", {
          autoClose: ALERT_DURATION,
        });
        focusField("name");
        return;
      }

      if (trimmedData.name.length < 2) {
        setAlert({
          type: "danger",
          message: "Name must be at least 2 characters long.",
        });
        toast.error("Name is too short.", { autoClose: ALERT_DURATION });
        focusField("name");
        return;
      }

      if (!trimmedData.email) {
        setAlert({ type: "danger", message: "Email address is required." });
        toast.error("Please enter your email address.", {
          autoClose: ALERT_DURATION,
        });
        focusField("email");
        return;
      }

      if (!validateEmail(trimmedData.email)) {
        setAlert({
          type: "danger",
          message: "Please enter a valid email address.",
        });
        toast.error("Invalid email format.", { autoClose: ALERT_DURATION });
        focusField("email");
        return;
      }

      if (!trimmedData.country) {
        setAlert({ type: "danger", message: "Country is required." });
        toast.error("Please select a country.", { autoClose: ALERT_DURATION });
        focusField("country");
        return;
      }

      if (!trimmedData.state) {
        setAlert({ type: "danger", message: "State/Province is required." });
        toast.error("Please select a state/province.", {
          autoClose: ALERT_DURATION,
        });
        focusField("state");
        return;
      }

      if (!trimmedData.city) {
        setAlert({ type: "danger", message: "City is required." });
        toast.error("Please select a city.", { autoClose: ALERT_DURATION });
        focusField("city");
        return;
      }

      if (!trimmedData.postalCode) {
        setAlert({ type: "danger", message: "Postal code is required." });
        toast.error("Please enter your postal code.", {
          autoClose: ALERT_DURATION,
        });
        focusField("postalCode");
        return;
      }

      if (!validatePostalCode(trimmedData.postalCode)) {
        setAlert({
          type: "danger",
          message: "Please enter a valid postal code.",
        });
        toast.error("Invalid postal code.", { autoClose: ALERT_DURATION });
        focusField("postalCode");
        return;
      }

      if (!trimmedData.phone) {
        setAlert({ type: "danger", message: "Phone number is required." });
        toast.error("Please enter your phone number.", {
          autoClose: ALERT_DURATION,
        });
        focusField("phone");
        return;
      }

      if (!validatePhone(trimmedData.phone)) {
        setAlert({
          type: "danger",
          message: "Please enter a valid phone number.",
        });
        toast.error("Invalid phone number.", { autoClose: ALERT_DURATION });
        focusField("phone");
        return;
      }

      if (!trimmedData.address) {
        setAlert({ type: "danger", message: "Street address is required." });
        toast.error("Please enter your street address.", {
          autoClose: ALERT_DURATION,
        });
        focusField("address");
        return;
      }

      if (trimmedData.address.length < 5) {
        setAlert({
          type: "danger",
          message: "Address must be at least 5 characters long.",
        });
        toast.error("Address is too short.", { autoClose: ALERT_DURATION });
        focusField("address");
        return;
      }

      if (!trimmedData.payment) {
        setAlert({ type: "danger", message: "Payment method is required." });
        toast.error("Please select a payment method.", {
          autoClose: ALERT_DURATION,
        });
        return;
      }

      if (!["stripe", "paypal", "cod"].includes(trimmedData.payment)) {
        toast.info("This payment method is not enabled yet.");
        return;
      }

      const digits = trimmedData.phone.replace(/\D/g, "");
      const normalizedPhone = trimmedData.phone.startsWith("+")
        ? `+${digits}`
        : `+${digits}`;

      const loyaltyDiscount = loyaltyDiscountAmount;
      const orderTotalAmount =
        subtotal + shippingFee - Math.max(0, couponDiscount) - loyaltyDiscount;

      try {
        setIsSubmitting(true);

        if (!currentCustomer?.token) {
          toast.error("Please login to proceed with checkout.", {
            autoClose: ALERT_DURATION,
          });
          router.push("/login");
          return;
        }

        // Handle COD orders - create directly without payment gateway
        if (trimmedData.payment === "cod") {
          // Validate customer ID
          const customerId = currentCustomer._id ?? currentCustomer.id;
          if (!customerId || !/^[0-9a-fA-F]{24}$/.test(String(customerId))) {
            toast.error("Invalid customer ID. Please log in again.", {
              autoClose: ALERT_DURATION,
            });
            router.push("/login");
            return;
          }

          // Validate cart items have valid product IDs
          const orderItems = cartList
            .map((item) => ({
              productId: item._id,
              quantity: item.quantity ?? 1,
            }))
            .filter((item) => {
              if (!item.productId) {
                return false;
              }
              // Validate MongoDB ObjectId format (24 hex characters)
              if (!/^[0-9a-fA-F]{24}$/.test(String(item.productId))) {
                return false;
              }
              return true;
            });

          if (orderItems.length === 0) {
            toast.error(
              "Cart items are invalid. Please clear cart and re-add products.",
              {
                autoClose: ALERT_DURATION,
              },
            );
            return;
          }

          if (orderItems.length !== cartList.length) {
            toast.error(
              "Some cart items are invalid. Please clear cart and re-add products.",
              {
                autoClose: ALERT_DURATION,
              },
            );
            return;
          }

          const requestBody: Record<string, unknown> = {
            customerId,
            items: orderItems,
            deliveryType: "delivery",
            deliveryAddress: `${trimmedData.address}, ${trimmedData.city}, ${trimmedData.state}, ${trimmedData.country} ${trimmedData.postalCode}`,
            paymentMethod: "cash",
            loyaltyPointsToRedeem,
            notes: trimmedData.notes,
          };

          // Only include couponCode if it has a value
          if (couponCode && couponCode.trim().length > 0) {
            requestBody.couponCode = couponCode.trim();
          }

          const orderRes = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentCustomer.token}`,
              ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
            },
            body: JSON.stringify(requestBody),
            cache: "no-store",
          });

          const orderJson = await orderRes.json().catch(() => ({}));

          if (!orderRes.ok || orderJson?.success === false) {
            const errorMessage = orderJson?.errors
              ? `Validation failed: ${orderJson.errors.join(", ")}`
              : orderJson?.message || "Failed to place COD order";
            throw new Error(errorMessage);
          }

          toast.success("Order placed successfully!", {
            autoClose: ALERT_DURATION,
          });
          clearCart();
          router.push("/dashboard?tab=orders");
          return;
        }

        // Handle Stripe/PayPal orders
        const paymentPath =
          trimmedData.payment === "paypal"
            ? "paypal/create-order"
            : "stripe/create-checkout-session";
        const gatewayLabel =
          trimmedData.payment === "paypal" ? "PayPal" : "Stripe";

        const res = await fetch(`${API_URL}/payments/${paymentPath}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentCustomer.token}`,
          },
          body: JSON.stringify({
            customer: {
              name: trimmedData.name,
              email: trimmedData.email,
              phone: normalizedPhone,
              address: trimmedData.address,
              city: trimmedData.city,
              state: trimmedData.state,
              postalCode: trimmedData.postalCode,
              country: trimmedData.country,
            },
            notes: trimmedData.notes,
            deliveryType: "delivery",
            deliveryFee: shippingFee,
            couponCode,
            loyaltyPointsToRedeem,
            subtotal,
            totalAmount: orderTotalAmount,
            items: cartList.map((item) => ({
              productId: item._id,
              slug: item.slug,
              quantity: item.quantity ?? 1,
            })),
          }),
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(
            json?.message || `Failed to start ${gatewayLabel} checkout`,
          );
        }
        const url = json?.data?.url as string | undefined;
        if (!url) throw new Error(`${gatewayLabel} checkout URL missing`);

        window.location.href = url;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to start payment checkout";
        setAlert({ type: "danger", message });
        toast.error(message, { autoClose: ALERT_DURATION });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      cartList,
      clearCart,
      couponCode,
      couponDiscount,
      currentCustomer,
      formData,
      focusField,
      loyaltyDiscountAmount,
      loyaltyPointsToRedeem,
      router,
      shippingFee,
      subtotal,
      validateEmail,
      validatePhone,
      validatePostalCode,
    ],
  );

  return {
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
    loyaltyConfig,
    handleLoyaltyChange,
    loyaltyDiscountAmount,
    loyaltyPointsToRedeem,
    maxRedeemablePoints,
    orderTotal,
    setCouponCode,
    setFocusedField,
    setLoyaltyPointsToRedeem,
    shippingFee,
    subtotal,
    customerAddresses,
  };
};
