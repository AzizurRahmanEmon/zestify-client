"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/api";
import { useCustomContext } from "@/context/context";
import { getCurrentCustomer } from "@/lib/auth";

// Constants
const ALERT_DURATION = 4000;

interface FormData {
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

const paymentOptions = [
  { id: 1, value: "stripe", label: "💳 Stripe" },
  { id: 2, value: "paypal", label: "💳 PayPal" },
  { id: 3, value: "cod", label: "💵 Cash on Delivery" },
];

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

const CheckoutForm = () => {
  const { cartList, totalCartPrice } = useCustomContext();
  const [formData, setFormData] = useState<FormData>({
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

  const [focusedField, setFocusedField] = useState<Record<string, boolean>>({
    name: false,
    email: false,
    postalCode: false,
    phone: false,
    address: false,
    notes: false,
  });

  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerAddresses, setCustomerAddresses] = useState<any[]>([]);

  // Effect to fetch customer addresses if logged in
  useEffect(() => {
    const customer = getCurrentCustomer();
    if (customer && customer.token) {
      // Set initial profile info
      setFormData((prev) => ({
        ...prev,
        name: customer.name || prev.name,
        email: customer.email || prev.email,
        phone: customer.phone || prev.phone,
      }));

      // Fetch full customer data for addresses
      fetch(`${API_URL}/customers/me`, {
        headers: {
          Authorization: `Bearer ${customer.token}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data.savedAddresses) {
            setCustomerAddresses(json.data.savedAddresses);
            // Auto-select default address
            const defaultAddr = json.data.savedAddresses.find(
              (a: any) => a.isDefault,
            );
            if (defaultAddr) {
              handleAddressSelect(defaultAddr);
            }
          }
        })
        .catch((err) => console.error("Error fetching addresses:", err));
    }
  }, []);

  const handleAddressSelect = (addr: any) => {
    setFormData((prev) => ({
      ...prev,
      address: addr.address,
      country: addr.country || "",
      state: addr.state || "",
      city: addr.city || "",
      postalCode: addr.zipCode || "",
    }));
    // Set focused fields to trigger animation
    setFocusedField({
      address: true,
      country: true,
      state: true,
      city: true,
      postalCode: true,
    });
  };

  // Effect hook to manage auto-dismissal of the alert
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, ALERT_DURATION);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const validateEmail = useCallback((email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, []);

  const validatePhone = useCallback((phone: string): boolean => {
    const regex = /^[\d\s\-\+\(\)]+$/;
    return regex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  }, []);

  const validatePostalCode = useCallback((postalCode: string): boolean => {
    return postalCode.length >= 4;
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear alerts when user starts typing (better UX)
    if (alert?.type === "danger") {
      setAlert(null);
    }
  };

  const selectedCountry = useMemo(() => {
    return locationOptions.find((c) => c.code === formData.country);
  }, [formData.country]);

  const availableStates = useMemo(() => {
    return selectedCountry?.states ?? [];
  }, [selectedCountry]);

  const selectedState = useMemo(() => {
    return availableStates.find((s) => s.code === formData.state);
  }, [availableStates, formData.state]);

  const availableCities = useMemo(() => {
    return selectedState?.cities ?? [];
  }, [selectedState]);

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      country: value,
      state: "",
      city: "",
    }));
    if (alert?.type === "danger") setAlert(null);
  };

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      state: value,
      city: "",
    }));
    if (alert?.type === "danger") setAlert(null);
  };

  const handleFocus = (field: string) => {
    setFocusedField((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setFocusedField((prev) => ({ ...prev, [field]: false }));
  };

  const isFieldActive = (field: string, value: string) => {
    return focusedField[field] || value !== "";
  };

  const focusField = useCallback((field: keyof FormData) => {
    const element = document.getElementById(field);
    element?.focus();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Trim all values
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

      // Clear previous alerts when submitting
      setAlert(null);

      if (!cartList.length) {
        setAlert({ type: "danger", message: "Your cart is empty." });
        toast.error("Your cart is empty.", { autoClose: ALERT_DURATION });
        return;
      }

      // Validate name input
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

      // Validate email input
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

      // Validate country
      if (!trimmedData.country) {
        setAlert({ type: "danger", message: "Country is required." });
        toast.error("Please select a country.", { autoClose: ALERT_DURATION });
        focusField("country");
        return;
      }

      // Validate state
      if (!trimmedData.state) {
        setAlert({ type: "danger", message: "State/Province is required." });
        toast.error("Please select a state/province.", {
          autoClose: ALERT_DURATION,
        });
        focusField("state");
        return;
      }

      // Validate city
      if (!trimmedData.city) {
        setAlert({ type: "danger", message: "City is required." });
        toast.error("Please select a city.", { autoClose: ALERT_DURATION });
        focusField("city");
        return;
      }

      // Validate postal code
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

      // Validate phone
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

      // Validate address
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

      // Validate payment method
      if (!trimmedData.payment) {
        setAlert({ type: "danger", message: "Payment method is required." });
        toast.error("Please select a payment method.", {
          autoClose: ALERT_DURATION,
        });
        return;
      }

      if (!["stripe", "paypal"].includes(trimmedData.payment)) {
        toast.info("This payment method is not enabled yet.");
        return;
      }

      const digits = trimmedData.phone.replace(/\D/g, "");
      const normalizedPhone = trimmedData.phone.startsWith("+")
        ? `+${digits}`
        : `+${digits}`;

      const shippingFee = 10;
      const subtotal = Number(totalCartPrice) || 0;
      const orderTotal = subtotal + shippingFee;

      try {
        setIsSubmitting(true);
        const paymentPath =
          trimmedData.payment === "paypal"
            ? "paypal/create-order"
            : "stripe/create-checkout-session";
        const gatewayLabel =
          trimmedData.payment === "paypal" ? "PayPal" : "Stripe";

        const res = await fetch(`${API_URL}/payments/${paymentPath}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
            subtotal,
            totalAmount: orderTotal,
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
      formData,
      validateEmail,
      validatePhone,
      validatePostalCode,
      focusField,
      cartList,
      totalCartPrice,
    ],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-3 gap-12 xl:gap-16">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Billing Details
              </h2>
              <p className="text-gray-600">
                Please fill in your information to complete your order
              </p>
            </div>

            {/* Alert Message */}
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

            {/* Saved Addresses Section */}
            {customerAddresses.length > 0 && (
              <div className="mb-8 p-6 bg-pink-50 rounded-2xl border border-pink-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-zPink"></i>
                  Ship to a Saved Address
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {customerAddresses.map((addr) => (
                    <button
                      key={addr._id}
                      type="button"
                      onClick={() => handleAddressSelect(addr)}
                      className={`text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.address === addr.address
                          ? "border-zPink bg-white shadow-md"
                          : "border-gray-100 bg-white/50 hover:border-pink-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-gray-900">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-zPink text-white px-2 py-0.5 rounded-full uppercase font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {addr.address}
                      </p>
                      {addr.city && (
                        <p className="text-[10px] text-gray-400 mt-1">
                          {addr.city} {addr.zipCode}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative group">
                  <input
                    id="name"
                    name="name"
                    className="peer w-full h-14 px-4 pt-6 pb-2 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:border-zPink focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onFocus={() => handleFocus("name")}
                    onBlur={() => handleBlur("name")}
                    disabled={isSubmitting}
                    aria-label="Full Name"
                    aria-required="true"
                    aria-invalid={alert?.type === "danger"}
                  />
                  <label
                    htmlFor="name"
                    className={`absolute left-4 text-gray-500 text-sm transition-all duration-300 pointer-events-none ${
                      isFieldActive("name", formData.name)
                        ? "top-2 text-xs text-zPink"
                        : "top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink"
                    }`}
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="relative group">
                  <input
                    id="email"
                    name="email"
                    className="peer w-full h-14 px-4 pt-6 pb-2 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:border-zPink focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onFocus={() => handleFocus("email")}
                    onBlur={() => handleBlur("email")}
                    disabled={isSubmitting}
                    aria-label="Email Address"
                    aria-required="true"
                    aria-invalid={alert?.type === "danger"}
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-4 text-gray-500 text-sm transition-all duration-300 pointer-events-none ${
                      isFieldActive("email", formData.email)
                        ? "top-2 text-xs text-zPink"
                        : "top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink"
                    }`}
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>

              <div className="relative group">
                <select
                  name="country"
                  id="country"
                  className="peer w-full h-14 px-4 pt-6 pb-2 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-zPink focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  value={formData.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  disabled={isSubmitting}
                  aria-label="Country"
                  aria-required="true"
                  aria-invalid={alert?.type === "danger"}
                >
                  <option value=""></option>
                  {locationOptions.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor="country"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    formData.country
                      ? "text-xs top-2 text-zPink"
                      : "top-4 text-base text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink"
                  }`}
                >
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative group">
                  <input
                    id="city"
                    name="city"
                    className="peer w-full h-14 px-4 pt-6 pb-2 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:border-zPink focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="City"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    onFocus={() => handleFocus("city")}
                    onBlur={() => handleBlur("city")}
                    disabled={isSubmitting}
                    aria-label="City"
                    aria-required="true"
                    aria-invalid={alert?.type === "danger"}
                  />
                  <label
                    htmlFor="city"
                    className={`absolute left-4 text-gray-500 text-sm transition-all duration-300 pointer-events-none ${
                      isFieldActive("city", formData.city)
                        ? "top-2 text-xs text-zPink"
                        : "top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink"
                    }`}
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="relative group">
                  <input
                    id="state"
                    name="state"
                    className="peer w-full h-14 px-4 pt-6 pb-2 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:border-zPink focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="State / Province"
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    onFocus={() => handleFocus("state")}
                    onBlur={() => handleBlur("state")}
                    disabled={isSubmitting}
                    aria-label="State / Province"
                    aria-required="true"
                    aria-invalid={alert?.type === "danger"}
                  />
                  <label
                    htmlFor="state"
                    className={`absolute left-4 text-gray-500 text-sm transition-all duration-300 pointer-events-none ${
                      isFieldActive("state", formData.state)
                        ? "top-2 text-xs text-zPink"
                        : "top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink"
                    }`}
                  >
                    State / Province <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative group">
                  <input
                    id="postalCode"
                    name="postalCode"
                    className="peer w-full h-14 px-4 pt-6 pb-2 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:border-zPink focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Postal Code"
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    onFocus={() => handleFocus("postalCode")}
                    onBlur={() => handleBlur("postalCode")}
                    disabled={isSubmitting}
                    aria-label="Postal Code"
                    aria-required="true"
                    aria-invalid={alert?.type === "danger"}
                  />
                  <label
                    htmlFor="postalCode"
                    className={`absolute left-4 text-gray-500 text-sm transition-all duration-300 pointer-events-none ${
                      isFieldActive("postalCode", formData.postalCode)
                        ? "top-2 text-xs text-zPink"
                        : "top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink"
                    }`}
                  >
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="relative group">
                  <input
                    id="phone"
                    name="phone"
                    className="peer w-full h-14 px-4 pt-6 pb-2 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:border-zPink focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onFocus={() => handleFocus("phone")}
                    onBlur={() => handleBlur("phone")}
                    disabled={isSubmitting}
                    aria-label="Phone Number"
                    aria-required="true"
                    aria-invalid={alert?.type === "danger"}
                  />
                  <label
                    htmlFor="phone"
                    className={`absolute left-4 text-gray-500 text-sm transition-all duration-300 pointer-events-none ${
                      isFieldActive("phone", formData.phone)
                        ? "top-2 text-xs text-zPink"
                        : "top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink"
                    }`}
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>

              <div className="relative group">
                <input
                  id="address"
                  name="address"
                  className="peer w-full h-14 px-4 pt-6 pb-2 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:border-zPink focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Street Address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  onFocus={() => handleFocus("address")}
                  onBlur={() => handleBlur("address")}
                  disabled={isSubmitting}
                  aria-label="Street Address"
                  aria-required="true"
                  aria-invalid={alert?.type === "danger"}
                />
                <label
                  htmlFor="address"
                  className={`absolute left-4 text-gray-500 text-sm transition-all duration-300 pointer-events-none ${
                    isFieldActive("address", formData.address)
                      ? "top-2 text-xs text-zPink"
                      : "top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink"
                  }`}
                >
                  Street Address <span className="text-red-500">*</span>
                </label>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200 mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Additional Information
              </h3>
              <div className="relative">
                <textarea
                  name="notes"
                  id="notes"
                  rows={4}
                  className="peer w-full px-4 pt-6 pb-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:border-zPink focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Order notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  onFocus={() => handleFocus("notes")}
                  onBlur={() => handleBlur("notes")}
                  disabled={isSubmitting}
                  aria-label="Order Notes"
                />
                <label
                  htmlFor="notes"
                  className={`absolute left-4 text-gray-500 text-sm transition-all duration-300 pointer-events-none ${
                    isFieldActive("notes", formData.notes)
                      ? "top-2 text-xs text-zPink"
                      : "top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink"
                  }`}
                >
                  Order Notes (Optional)
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-zPink p-8 lg:p-10 sticky top-8">
            <div className="mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Cart <span className="text-zPink">Totals</span>
              </h3>
              <div className="w-16 h-1 bg-zPink rounded-full mt-2"></div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <span className="text-lg font-medium text-gray-700">
                  Cart Subtotal
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ${Number(totalCartPrice || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <span className="text-lg font-medium text-gray-700">
                  Shipping Fee
                </span>
                <span className="text-lg font-bold text-gray-900">$10.00</span>
              </div>
              <div className="flex items-center justify-between py-4 text-xl">
                <span className="font-bold text-gray-900">Order Total</span>
                <span className="font-bold text-zPink">
                  ${(Number(totalCartPrice || 0) + 10).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-xl font-bold text-gray-900 mb-6">
                <span className="text-zPink">Payment</span> Method
              </div>
              <div className="space-y-3">
                {paymentOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-zPink hover:bg-pink-50 group"
                  >
                    <input
                      className="hidden"
                      type="radio"
                      value={option.value}
                      name="payment"
                      checked={formData.payment === option.value}
                      onChange={(e) =>
                        handleInputChange("payment", e.target.value)
                      }
                      disabled={isSubmitting}
                      aria-label={option.label}
                    />
                    <span
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-300 relative flex items-center justify-center ${
                        formData.payment === option.value
                          ? "border-zPink"
                          : "border-gray-300 group-hover:border-zPink"
                      }`}
                    >
                      {formData.payment === option.value && (
                        <span className="w-3 h-3 rounded-full bg-zPink"></span>
                      )}
                    </span>
                    <span className="ml-4 text-lg font-medium text-gray-700 group-hover:text-gray-900">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-label="Place Order"
              className="w-full bg-zPink text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-opacity-90 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>Processing Order</span>
                  <svg
                    className="animate-spin h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </span>
              ) : (
                <>
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <span>Place Order</span>
                    <svg
                      className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                </>
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Secure SSL encrypted payment</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
