"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { API_URL } from "@/lib/api";
import DatePicker from "./DatePicker";

// Constants
const ALERT_DURATION = 4000;
const SUBMISSION_DELAY = 2000;

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    message: "",
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

  const focusField = useCallback((field: string) => {
    const element = document.getElementById(field);
    element?.focus();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

  const handleSubmit = useCallback(async () => {
    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      date: formData.date.trim(),
      time: formData.time.trim(),
      guests: formData.guests.trim(),
      message: formData.message.trim(),
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
      setAlert({ type: "danger", message: "Date is required." });
      focusField("date");
      return;
    }

    if (!trimmedData.time) {
      setAlert({ type: "danger", message: "Preferred time is required." });
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
      setAlert({ type: "danger", message: "Please select party size." });
      focusField("guests");
      return;
    }

    setIsSubmitting(true);

    try {
      const guestCount = parseInt(trimmedData.guests.replace("+", "")) || 1;
      const res = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          name: trimmedData.name,
          email: trimmedData.email,
          phone: trimmedData.phone,
          date: trimmedData.date,
          time: trimmedData.time,
          numberOfGuests: guestCount,
          specialRequests: trimmedData.message,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        setAlert({
          type: "danger",
          message:
            json?.message || "Reservation submission failed. Please try again.",
        });
        return;
      }

      await new Promise((r) => setTimeout(r, SUBMISSION_DELAY));

      setAlert({
        type: "success",
        message: json?.message || "Reservation submitted successfully!",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "",
        message: "",
      });
      setAvailableSlots([]);
    } catch (e: any) {
      setAlert({
        type: "danger",
        message:
          e?.message || "Reservation submission failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [availableTimes, focusField, formData, validateEmail, validatePhone]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-6">
      {/* Name Field */}
      <div className="relative group">
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 peer disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Full Name"
        />
        <label
          htmlFor="name"
          className="absolute left-6 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-pink-600 peer-focus:bg-white"
        >
          Full Name *
        </label>
        <div className="absolute right-4 top-4 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>

      {/* Email Field */}
      <div className="relative group">
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 peer disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Email Address"
        />
        <label
          htmlFor="email"
          className="absolute left-6 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-pink-600 peer-focus:bg-white"
        >
          Email Address *
        </label>
        <div className="absolute right-4 top-4 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Phone Field */}
      <div className="relative group">
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 peer disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Phone Number"
        />
        <label
          htmlFor="phone"
          className="absolute left-6 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-pink-600 peer-focus:bg-white"
        >
          Phone Number *
        </label>
        <div className="absolute right-4 top-4 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>
      </div>

      {/* Party Size and Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Field */}
        <div className="relative group">
          <DatePicker
            id="date"
            name="date"
            value={formData.date}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, date: value }))
            }
            disabled={isSubmitting}
            min={today}
            placeholder="Select Date"
            className="w-full text-start px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label
            htmlFor="date"
            className="absolute left-6 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600"
          >
            Date *
          </label>
          <div className="absolute right-4 top-4 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z" />
            </svg>
          </div>
        </div>

        {/* Time Field */}
        <div className="relative group">
          {availableTimes.length > 0 ? (
            <select
              name="time"
              id="time"
              value={formData.time}
              onChange={handleInputChange}
              disabled={isSubmitting || isLoadingSlots}
              className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {isLoadingSlots ? "Loading..." : "Select Time"}
              </option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="time"
              name="time"
              id="time"
              value={formData.time}
              onChange={handleInputChange}
              disabled={isSubmitting || isLoadingSlots}
              min="09:00"
              max="22:00"
              className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          )}
          <label
            htmlFor="time"
            className="absolute left-6 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600"
          >
            Preferred Time *
          </label>
          <div className="absolute right-4 top-4 text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 8V6a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L13 10z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Party Size Selection */}
      <div className="relative group">
        <select
          name="guests"
          id="guests"
          value={formData.guests}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select Party Size</option>
          <option value="1">1 Person</option>
          <option value="2">2 People</option>
          <option value="3">3 People</option>
          <option value="4">4 People</option>
          <option value="5+">5+ People</option>
        </select>
        <label
          htmlFor="guests"
          className="absolute left-6 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600"
        >
          Party Size *
        </label>
        <div className="absolute right-4 top-4 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Message Field */}
      <div className="relative group">
        <textarea
          name="message"
          id="message"
          rows={4}
          value={formData.message}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 peer resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Special Requests"
        />
        <label
          htmlFor="message"
          className="absolute left-6 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-pink-600 peer-focus:bg-white"
        >
          Special Requests (Optional)
        </label>
        <div className="absolute right-4 top-4 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>

      {/* Alert Message */}
      {alert && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg ${
            alert.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
          role="alert"
        >
          {alert.type === "success" && (
            <svg
              className="w-5 h-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
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

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-zPink text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                className="opacity-75"
              />
            </svg>
            Submitting...
          </>
        ) : (
          <>
            Book Reservation
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default ReservationForm;
