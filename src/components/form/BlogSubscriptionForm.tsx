"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/api";

// Constants
const ALERT_DURATION = 4000;

const BlogSubscriptionForm = () => {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (value: string) => {
    setEmail(value);

    // Clear alerts when user starts typing (better UX)
    if (alert?.type === "danger") {
      setAlert(null);
    }
  };

  const focusField = useCallback(() => {
    const element = document.getElementById("subscription-email");
    element?.focus();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Trim the email value
      const trimmedEmail = email.trim();

      // Clear previous alerts when submitting
      setAlert(null);

      // Validate email input
      if (!trimmedEmail) {
        setAlert({ type: "danger", message: "Email address is required." });
        toast.error("Please enter your email address.", {
          autoClose: ALERT_DURATION,
        });
        focusField();
        return;
      }

      if (!validateEmail(trimmedEmail)) {
        setAlert({
          type: "danger",
          message: "Please enter a valid email address.",
        });
        toast.error("Invalid email format.", { autoClose: ALERT_DURATION });
        focusField();
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await fetch(`${API_URL}/newsletters/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail, source: "blog" }),
          cache: "no-store",
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Subscription failed");
        }

        setAlert({
          type: "success",
          message: json?.message || "Successfully subscribed to our newsletter!",
        });
        toast.success("Subscription successful!", { autoClose: ALERT_DURATION });
        setEmail("");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Subscription failed";
        setAlert({ type: "danger", message });
        toast.error(message, { autoClose: ALERT_DURATION });
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, validateEmail, focusField],
  );

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <input
        type="email"
        id="subscription-email"
        value={email}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Enter your email"
        disabled={isSubmitting}
        aria-label="Email Address"
        aria-required="true"
        aria-invalid={alert?.type === "danger"}
        className="w-full px-4 py-3 bg-white/20 border-0 rounded-xl text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {/* Alert Message */}
      {alert && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
            alert.type === "success"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-red-500/20 text-white border border-red-300/30"
          }`}
          role="alert"
          aria-live="assertive"
        >
          {alert.type === "success" && (
            <svg
              className="w-4 h-4 shrink-0"
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
              className="w-4 h-4 shrink-0"
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

      <button
        type="submit"
        disabled={isSubmitting}
        aria-label="Subscribe to newsletter"
        className="w-full bg-white text-zPink font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span>Subscribing</span>
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
          </>
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  );
};

export default BlogSubscriptionForm;
