"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { API_URL } from "@/lib/api";
import DatePicker from "./DatePicker";

// Constants
const ALERT_DURATION = 4000;

const HomeReservationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    message: "",
    terms: false,
    marketing: false,
  });

  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [availableSlots, setAvailableSlots] = useState<
    { time: string; available: boolean }[]
  >([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (alert?.type === "danger") {
      setAlert(null);
    }
  };

  const availableTimes = useMemo(() => {
    return availableSlots.filter((s) => s.available).map((s) => s.time);
  }, [availableSlots]);

  useEffect(() => {
    const dateStr = formData.date.trim();
    if (!dateStr) {
      setAvailableSlots([]);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setIsLoadingSlots(true);
      try {
        const res = await fetch(
          `${API_URL}/reservations/check/available-slots?date=${encodeURIComponent(
            dateStr,
          )}`,
          {
            cache: "no-store",
          },
        );

        const json = await res.json().catch(() => null);
        if (cancelled) return;

        if (!res.ok || !json?.success) {
          setAvailableSlots([]);
          return;
        }

        const slots = Array.isArray(json?.data?.slots) ? json.data.slots : [];
        setAvailableSlots(slots);

        if (
          formData.time &&
          slots.length > 0 &&
          !slots.some((s: any) => s?.available && s?.time === formData.time)
        ) {
          setFormData((prev) => ({ ...prev, time: "" }));
        }
      } catch {
        if (!cancelled) setAvailableSlots([]);
      } finally {
        if (!cancelled) setIsLoadingSlots(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [formData.date, formData.time]);

  const focusField = useCallback((field: string) => {
    const element = document.getElementById(field);
    element?.focus();
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      date: formData.date.trim(),
      time: formData.time.trim(),
      guests: formData.guests.trim(),
      message: formData.message.trim(),
      terms: formData.terms,
      marketing: formData.marketing,
    };

    setAlert(null);

    if (!trimmedData.name) {
      setAlert({ type: "danger", message: "Name is required." });
      focusField("name");
      return;
    }

    if (trimmedData.name.length < 2) {
      setAlert({
        type: "danger",
        message: "Name must be at least 2 characters long.",
      });
      focusField("name");
      return;
    }

    if (!trimmedData.email) {
      setAlert({ type: "danger", message: "Email address is required." });
      focusField("email");
      return;
    }

    if (!validateEmail(trimmedData.email)) {
      setAlert({
        type: "danger",
        message: "Please enter a valid email address.",
      });
      focusField("email");
      return;
    }

    if (!trimmedData.phone) {
      setAlert({ type: "danger", message: "Phone number is required." });
      focusField("phone");
      return;
    }

    if (!validatePhone(trimmedData.phone)) {
      setAlert({
        type: "danger",
        message: "Please enter a valid phone number.",
      });
      focusField("phone");
      return;
    }

    if (!trimmedData.date) {
      setAlert({ type: "danger", message: "Reservation date is required." });
      focusField("date");
      return;
    }

    if (!trimmedData.time) {
      setAlert({ type: "danger", message: "Time is required." });
      focusField("time");
      return;
    }

    if (
      availableTimes.length > 0 &&
      !availableTimes.includes(trimmedData.time)
    ) {
      setAlert({
        type: "danger",
        message: "This time slot is not available. Please choose another time.",
      });
      focusField("time");
      return;
    }

    if (!trimmedData.guests) {
      setAlert({ type: "danger", message: "Number of guests is required." });
      focusField("guests");
      return;
    }

    if (!trimmedData.terms) {
      setAlert({
        type: "danger",
        message: "You must agree to the Terms of Service and Privacy Policy.",
      });
      return;
    }

    let parsedGuests = 1;
    if (trimmedData.guests.includes("+")) {
      parsedGuests = parseInt(trimmedData.guests.replace("+", ""), 10) || 5;
    } else {
      parsedGuests = parseInt(trimmedData.guests, 10) || 1;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedData.name,
          email: trimmedData.email,
          phone: trimmedData.phone,
          date: trimmedData.date,
          time: trimmedData.time,
          numberOfGuests: parsedGuests,
          message: trimmedData.message,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (
        !res.ok ||
        (json && typeof json === "object" && json.success === false)
      ) {
        const msg =
          (json &&
            (json.message ||
              (Array.isArray(json.errors) ? json.errors.join(", ") : ""))) ||
          "Failed to submit reservation";
        throw new Error(msg);
      }

      setAlert({
        type: "success",
        message:
          (json && json.message) ||
          "Your reservation has been submitted successfully!",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "",
        message: "",
        terms: false,
        marketing: false,
      });
    } catch (e: any) {
      setAlert({
        type: "danger",
        message: e?.message || "Failed to submit reservation",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [availableTimes, focusField, formData, validateEmail, validatePhone]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-8">
      {alert && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg ${
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            disabled={isSubmitting}
            className="peer w-full h-16 px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 placeholder-transparent transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Full Name"
            required
          />
          <label
            htmlFor="name"
            className="absolute left-4 top-4 text-gray-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zPink"
          >
            Full Name *
          </label>
        </div>

        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={isSubmitting}
            className="peer w-full h-16 px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 placeholder-transparent transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Email Address"
            required
          />
          <label
            htmlFor="email"
            className="absolute left-4 top-4 text-gray-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zPink"
          >
            Email Address *
          </label>
        </div>
      </div>

      <div className="relative">
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          disabled={isSubmitting}
          className="peer w-full h-16 px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 placeholder-transparent transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Phone Number"
          required
        />
        <label
          htmlFor="phone"
          className="absolute left-4 top-4 text-gray-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zPink"
        >
          Phone Number *
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative">
          <DatePicker
            id="date"
            name="date"
            value={formData.date}
            onChange={(value) => handleInputChange("date", value)}
            disabled={isSubmitting}
            min={today}
            placeholder="Select Date"
            className="text-start w-full h-16 px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            transparentBg
          />
          <label
            htmlFor="date"
            className="absolute left-4 top-2 text-xs text-zPink transition-all duration-300 pointer-events-none"
          >
            Reservation Date *
          </label>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-6 h-6 text-gray-100"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z" />
            </svg>
          </div>
        </div>

        <div className="relative">
          {availableTimes.length > 0 ? (
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              disabled={isSubmitting || isLoadingSlots}
              className="peer w-full h-16 px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="" disabled className="bg-gray-800 text-gray-300">
                {isLoadingSlots ? "Loading..." : "Select Time"}
              </option>
              {availableTimes.map((t) => (
                <option key={t} value={t} className="bg-gray-800 text-white">
                  {t}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="time"
              id="time"
              name="time"
              min="09:00"
              max="22:00"
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              disabled={isSubmitting || isLoadingSlots}
              className="peer w-full h-16 px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          )}
          <label
            htmlFor="time"
            className="absolute left-4 top-2 text-xs text-zPink transition-all duration-300 pointer-events-none"
          >
            Time *
          </label>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-6 h-6 text-gray-100"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative">
        <select
          id="guests"
          name="guests"
          value={formData.guests}
          onChange={(e) => handleInputChange("guests", e.target.value)}
          disabled={isSubmitting}
          className="peer w-full h-16 px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          required
        >
          <option value="" disabled className="bg-gray-800 text-gray-300">
            Select number of guests
          </option>
          <option value="1" className="bg-gray-800 text-white">
            1 Person
          </option>
          <option value="2" className="bg-gray-800 text-white">
            2 People
          </option>
          <option value="3" className="bg-gray-800 text-white">
            3 People
          </option>
          <option value="4" className="bg-gray-800 text-white">
            4 People
          </option>
          <option value="5+" className="bg-gray-800 text-white">
            5+ People
          </option>
        </select>
        <label
          htmlFor="guests"
          className="absolute left-4 top-2 text-xs text-zPink transition-all duration-300 pointer-events-none"
        >
          Number of Guests *
        </label>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-100 transform transition-transform duration-200"
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

      <div className="relative">
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          disabled={isSubmitting}
          className="peer w-full px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 placeholder-transparent transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Special Requests"
        ></textarea>
        <label
          htmlFor="message"
          className="absolute left-4 top-4 text-gray-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zPink"
        >
          Special Requests (Optional)
        </label>
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={(e) => handleInputChange("terms", e.target.checked)}
              disabled={isSubmitting}
              className="peer sr-only"
              required
            />
            {/* Custom checkbox container */}
            <div
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center overflow-hidden transition-all duration-300 ${
                formData.terms
                  ? "bg-zPink border-zPink"
                  : "bg-transparent border-gray-500"
              } peer-hover:border-zPink/70 peer-focus:ring-2 peer-focus:ring-zPink/50 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed`}
            >
              {/* Checkmark icon - white tick on pink background */}
              <svg
                className={`w-5 h-5 text-white transition-all duration-200 ${
                  formData.terms
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-lg bg-zPink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
          </div>
          <span className="text-gray-100 text-sm leading-6">
            I agree to the{" "}
            <a
              href="#"
              className="text-zPink hover:text-zPink/80 underline transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-zPink hover:text-zPink/80 underline transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-zPink">*</span>
          </span>
        </label>

        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="marketing"
              name="marketing"
              checked={formData.marketing}
              onChange={(e) => handleInputChange("marketing", e.target.checked)}
              disabled={isSubmitting}
              className="peer sr-only"
            />
            {/* Custom checkbox container */}
            <div
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center overflow-hidden transition-all duration-300 ${
                formData.marketing
                  ? "bg-zPink border-zPink"
                  : "bg-transparent border-gray-500"
              } peer-hover:border-zPink/70 peer-focus:ring-2 peer-focus:ring-zPink/50 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed`}
            >
              {/* Checkmark icon - white tick on pink background */}
              <svg
                className={`w-5 h-5 text-white transition-all duration-200 ${
                  formData.marketing
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-lg bg-zPink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
          </div>
          <span className="text-gray-100 text-sm leading-6">
            Send me special offers and updates via email
          </span>
        </label>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="group relative w-full h-16 bg-zPink hover:bg-zPink/90 text-white font-semibold rounded-xl transition-all duration-300 overflow-hidden focus:outline-none focus:ring-1 focus:ring-zPink/60 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="relative z-10 flex items-center justify-center space-x-3">
              <span>Submitting</span>
              <svg
                className="animate-spin h-5 w-5"
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
              <span className="relative z-10 flex items-center justify-center space-x-3">
                <span>Reserve Your Table</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
      </div>
    </div>
  );
};

export default HomeReservationForm;
