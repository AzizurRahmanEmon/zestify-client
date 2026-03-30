"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

// Constants
const ALERT_DURATION = 4000;
const SUBMISSION_DELAY = 2000;

const NewsletterForm = () => {
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
    const element = document.getElementById("newsletter-email");
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
    (e: React.FormEvent) => {
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

      // Simulate API request with a delay
      setIsSubmitting(true);
      setTimeout(() => {
        // Log the submitted data as JSON
        console.log(
          "Submitted Newsletter Form Data:",
          JSON.stringify({ email: trimmedEmail }, null, 2),
        );

        setIsSubmitting(false);
        setAlert({
          type: "success",
          message: "Successfully subscribed to our newsletter!",
        });
        toast.success("Successfully subscribed to our newsletter!", {
          autoClose: ALERT_DURATION,
        });

        // Clear email field
        setEmail("");
      }, SUBMISSION_DELAY);
    },
    [email, validateEmail, focusField],
  );

  return (
    <form
      className="max-w-md mx-auto xl:mx-0"
      aria-labelledby="newsletter-form"
      id="newsletter-form"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address for newsletter subscription
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base font-medium text-start placeholder:text-center focus:ring-2 focus:ring-orange-500/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Email address for newsletter subscription"
            aria-required="true"
            aria-invalid={alert?.type === "danger"}
            aria-describedby="newsletter-email"
            autoComplete="email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-linear-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-md hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 min-w-30 justify-center"
          aria-label="Subscribe to newsletter"
        >
          {isSubmitting ? (
            <>
              <span>Subscribing</span>
              <i className="fa-solid fa-spinner fa-spin"></i>
            </>
          ) : (
            <>
              <span>Subscribe</span>
              <i className="fa-solid fa-paper-plane"></i>
            </>
          )}
        </button>
      </div>

      {/* Alert Message */}
      {alert && (
        <div
          className={`mt-4 flex items-center gap-2 p-4 rounded-lg ${
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
    </form>
  );
};

export default NewsletterForm;
