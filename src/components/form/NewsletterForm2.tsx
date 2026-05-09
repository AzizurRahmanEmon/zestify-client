"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/api";

// Constants
const ALERT_DURATION = 4000;

const TENANT_ID =
  process.env.NEXT_PUBLIC_TENANT_ID ||
  process.env.NEXT_PUBLIC_TENANT_SLUG ||
  "";

const NewsletterForm2 = () => {
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

  const focusField = useCallback(() => {
    const element = document.getElementById("email-input");
    element?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    // Clear alerts when user starts typing (better UX)
    if (alert?.type === "danger") {
      setAlert(null);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Trim email value
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

      // Call API
      setIsSubmitting(true);
      try {
        const res = await fetch(`${API_URL}/newsletters/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
          },
          body: JSON.stringify({
            email: trimmedEmail,
            source: "website",
          }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success) {
          setAlert({
            type: "danger",
            message: json?.message || "Subscription failed. Please try again.",
          });
          toast.error(json?.message || "Subscription failed.", {
            autoClose: ALERT_DURATION,
          });
          return;
        }
        setAlert({
          type: "success",
          message:
            json?.message || "Successfully subscribed to our newsletter!",
        });
        toast.success(json?.message || "Successfully subscribed!", {
          autoClose: ALERT_DURATION,
        });
        setEmail("");
      } catch (e: any) {
        setAlert({
          type: "danger",
          message: e?.message || "Subscription failed. Please try again.",
        });
        toast.error("Subscription failed.", { autoClose: ALERT_DURATION });
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, validateEmail, focusField],
  );

  return (
    <div className="space-y-4">
      <form
        className="relative group/form"
        aria-label="Email subscription"
        onSubmit={handleSubmit}
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2 flex items-center justify-between shadow-lg group-hover/form:shadow-zPink/20 transition-all duration-300 border border-transparent group-hover/form:border-pink-400/50">
          <label htmlFor="email-input" className="sr-only">
            Email address
          </label>
          <input
            id="email-input"
            type="email"
            name="email"
            placeholder="Enter your email..."
            value={email}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="text-gray-700 text-lg w-full px-3 py-2 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-zPink focus:ring-offset-1 focus:ring-offset-transparent rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            required
            aria-required="true"
            aria-invalid={alert?.type === "danger"}
            aria-describedby="email-description"
            autoComplete="email"
          />
          <div id="email-description" className="sr-only">
            Enter your email address to subscribe to our newsletter
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-12 h-12 ml-2 bg-linear-to-br from-zPink/60 to-zPink rounded-lg flex items-center justify-center text-white text-lg shrink-0 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-zPink/50 disabled:opacity-70 disabled:cursor-not-allowed group/button focus:outline-none focus:ring-1 focus:ring-pink-400/60 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Subscribe to newsletter"
          >
            {isSubmitting ? (
              <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
            ) : (
              <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
            )}
          </button>
        </div>
      </form>

      {/* Alert Message */}
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
    </div>
  );
};

export default NewsletterForm2;
