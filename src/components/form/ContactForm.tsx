"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { API_URL } from "@/lib/api";
// Constants
const ALERT_DURATION = 4000;

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    company: "",
    message: "",
  });

  const [focusedField, setFocusedField] = useState({
    name: false,
    email: false,
    phone: false,
    subject: false,
    company: false,
    message: false,
  });

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

  const validatePhone = useCallback((phone: string): boolean => {
    const regex = /^[\d\s\-\+\(\)]+$/;
    return regex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear alerts when user starts typing (better UX)
    if (alert?.type === "danger") {
      setAlert(null);
    }
  };

  const handleFocus = (field: string) => {
    setFocusedField((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setFocusedField((prev) => ({ ...prev, [field]: false }));
  };

  const isFieldActive = (field: string, value: string) => {
    return focusedField[field as keyof typeof focusedField] || value !== "";
  };

  const focusField = useCallback((field: keyof typeof formData) => {
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
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        company: formData.company.trim(),
        message: formData.message.trim(),
      };

      // Clear previous alerts when submitting
      setAlert(null);

      // Validate name input
      if (!trimmedData.name) {
        setAlert({ type: "danger", message: "Name is required." });
        toast.error("Please enter your name.", { autoClose: ALERT_DURATION });
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

      if (trimmedData.phone && !validatePhone(trimmedData.phone)) {
        setAlert({
          type: "danger",
          message: "Please enter a valid phone number.",
        });
        toast.error("Invalid phone number.", { autoClose: ALERT_DURATION });
        focusField("phone");
        return;
      }

      // Validate subject input
      if (!trimmedData.subject) {
        setAlert({ type: "danger", message: "Subject is required." });
        toast.error("Please enter a subject.", { autoClose: ALERT_DURATION });
        focusField("subject");
        return;
      }

      if (trimmedData.subject.length < 3) {
        setAlert({
          type: "danger",
          message: "Subject must be at least 3 characters long.",
        });
        toast.error("Subject is too short.", { autoClose: ALERT_DURATION });
        focusField("subject");
        return;
      }

      // Validate message input
      if (!trimmedData.message) {
        setAlert({ type: "danger", message: "Message is required." });
        toast.error("Please enter your message.", {
          autoClose: ALERT_DURATION,
        });
        focusField("message");
        return;
      }

      if (trimmedData.message.length < 10) {
        setAlert({
          type: "danger",
          message: "Message must be at least 10 characters long.",
        });
        toast.error("Message is too short.", { autoClose: ALERT_DURATION });
        focusField("message");
        return;
      }

      // Company is optional, no validation needed

      setIsSubmitting(true);
      try {
        const res = await fetch(`${API_URL}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedData.name,
            email: trimmedData.email,
            phone: trimmedData.phone || undefined,
            subject: trimmedData.subject,
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
            "Failed to send message";
          throw new Error(msg);
        }

        setAlert({
          type: "success",
          message:
            (json && json.message) || "Your message has been sent successfully!",
        });
        toast.success("Message sent successfully!", {
          autoClose: ALERT_DURATION,
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          company: "",
          message: "",
        });
      } catch (err: any) {
        setAlert({
          type: "danger",
          message: err?.message || "Failed to send message",
        });
        toast.error(err?.message || "Failed to send message", {
          autoClose: ALERT_DURATION,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateEmail, validatePhone, focusField],
  );

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
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

      {/* Name & Email Row */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="relative">
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onFocus={() => handleFocus("name")}
            onBlur={() => handleBlur("name")}
            disabled={isSubmitting}
            aria-label="Your Name"
            aria-required="true"
            aria-invalid={alert?.type === "danger"}
            className="peer w-full h-14 bg-transparent border border-gray-300 rounded-lg px-4 pt-6 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label
            htmlFor="name"
            className={`absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none ${
              isFieldActive("name", formData.name)
                ? "top-2 text-xs text-zPink"
                : "top-1/2 -translate-y-1/2 text-base"
            }`}
          >
            Your Name *
          </label>
        </div>

        <div className="relative">
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onFocus={() => handleFocus("email")}
            onBlur={() => handleBlur("email")}
            disabled={isSubmitting}
            aria-label="Email Address"
            aria-required="true"
            aria-invalid={alert?.type === "danger"}
            className="peer w-full h-14 bg-transparent border border-gray-300 rounded-lg px-4 pt-6 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label
            htmlFor="email"
            className={`absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none ${
              isFieldActive("email", formData.email)
                ? "top-2 text-xs text-zPink"
                : "top-1/2 -translate-y-1/2 text-base"
            }`}
          >
            Email Address *
          </label>
        </div>
      </div>

      {/* Phone & Subject Row */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="relative">
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            onFocus={() => handleFocus("phone")}
            onBlur={() => handleBlur("phone")}
            disabled={isSubmitting}
            aria-label="Phone Number"
            aria-required="true"
            aria-invalid={alert?.type === "danger"}
            className="peer w-full h-14 bg-transparent border border-gray-300 rounded-lg px-4 pt-6 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label
            htmlFor="phone"
            className={`absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none ${
              isFieldActive("phone", formData.phone)
                ? "top-2 text-xs text-zPink"
                : "top-1/2 -translate-y-1/2 text-base"
            }`}
          >
            Phone Number *
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            onFocus={() => handleFocus("subject")}
            onBlur={() => handleBlur("subject")}
            disabled={isSubmitting}
            aria-label="Subject"
            aria-required="true"
            aria-invalid={alert?.type === "danger"}
            className="peer w-full h-14 bg-transparent border border-gray-300 rounded-lg px-4 pt-6 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label
            htmlFor="subject"
            className={`absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none ${
              isFieldActive("subject", formData.subject)
                ? "top-2 text-xs text-zPink"
                : "top-1/2 -translate-y-1/2 text-base"
            }`}
          >
            Subject *
          </label>
        </div>
      </div>

      {/* Company Name */}
      <div className="relative">
        <input
          type="text"
          id="company"
          value={formData.company}
          onChange={(e) => handleInputChange("company", e.target.value)}
          onFocus={() => handleFocus("company")}
          onBlur={() => handleBlur("company")}
          disabled={isSubmitting}
          aria-label="Your Company Name"
          className="peer w-full h-14 bg-transparent border border-gray-300 rounded-lg px-4 pt-6 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label
          htmlFor="company"
          className={`absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none ${
            isFieldActive("company", formData.company)
              ? "top-2 text-xs text-zPink"
              : "top-1/2 -translate-y-1/2 text-base"
          }`}
        >
          Your Company Name (Optional)
        </label>
      </div>

      {/* Message */}
      <div className="relative">
        <textarea
          id="message"
          rows={5}
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          onFocus={() => handleFocus("message")}
          onBlur={() => handleBlur("message")}
          disabled={isSubmitting}
          aria-label="Your Message"
          aria-required="true"
          aria-invalid={alert?.type === "danger"}
          className="peer w-full bg-transparent border border-gray-300 rounded-lg px-4 pt-6 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label
          htmlFor="message"
          className={`absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none ${
            isFieldActive("message", formData.message)
              ? "top-2 text-xs text-zPink"
              : "top-6 text-base"
          }`}
        >
          Write your question here *
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="Submit form"
          className="ar-btn group gap-3 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="relative z-10 transition-all duration-500">
                Submitting
              </span>
              <svg
                className="relative z-10 animate-spin h-6 w-6"
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
            <>
              <span className="relative z-10 transition-all duration-500 group-hover:text-black">
                Submit Now
              </span>
              <Image
                width={33}
                height={24}
                src="/assets/img/arrow.png"
                alt="icon"
                className="group-hover:invert z-10"
              />
              <span className="absolute top-0 left-0 w-0 h-full bg-white transition-all duration-500 group-hover:w-full z-0"></span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
