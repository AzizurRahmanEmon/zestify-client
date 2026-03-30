"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { API_URL } from "@/lib/api";

// Constants
const ALERT_DURATION = 4000;

type Props = {
  blogId: string;
  parentComment?: string | null;
  onSubmitted?: () => void;
};

const BlogCommentForm = ({ blogId, parentComment = null, onSubmitted }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });

  const [focusedField, setFocusedField] = useState({
    name: false,
    email: false,
    comment: false,
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
      const { name, email, comment } = formData;

      // Trim all values
      const trimmedData = {
        name: name.trim(),
        email: email.trim(),
        comment: comment.trim(),
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

      // Validate comment input
      if (!trimmedData.comment) {
        setAlert({ type: "danger", message: "Comment is required." });
        toast.error("Please enter your comment.", {
          autoClose: ALERT_DURATION,
        });
        focusField("comment");
        return;
      }

      if (trimmedData.comment.length < 10) {
        setAlert({
          type: "danger",
          message: "Comment must be at least 10 characters long.",
        });
        toast.error("Comment is too short.", { autoClose: ALERT_DURATION });
        focusField("comment");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await fetch(
          `${API_URL}/blogs/${encodeURIComponent(blogId)}/comments`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...trimmedData,
              parentComment,
            }),
            cache: "no-store",
          },
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Failed to submit comment");
        }

        setAlert({
          type: "success",
          message: json?.message || "Your comment has been submitted successfully!",
        });
        toast.success("Comment submitted successfully!", {
          autoClose: ALERT_DURATION,
        });

        setFormData({
          name: "",
          email: "",
          comment: "",
        });
        onSubmitted?.();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to submit comment";
        setAlert({ type: "danger", message });
        toast.error(message, { autoClose: ALERT_DURATION });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateEmail, focusField, blogId, parentComment, onSubmitted],
  );

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="relative">
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onFocus={() => handleFocus("name")}
            onBlur={() => handleBlur("name")}
            disabled={isSubmitting}
            aria-label="Full Name"
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
            Name *
          </label>
        </div>

        {/* Email Field */}
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
            Email *
          </label>
        </div>
      </div>

      {/* Comment Field */}
      <div className="relative">
        <textarea
          id="comment"
          rows={5}
          value={formData.comment}
          onChange={(e) => handleInputChange("comment", e.target.value)}
          onFocus={() => handleFocus("comment")}
          onBlur={() => handleBlur("comment")}
          disabled={isSubmitting}
          aria-label="Your Comment"
          aria-required="true"
          aria-invalid={alert?.type === "danger"}
          className="peer w-full bg-transparent border border-gray-300 rounded-lg px-4 pt-6 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label
          htmlFor="comment"
          className={`absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none ${
            isFieldActive("comment", formData.comment)
              ? "top-2 text-xs text-zPink"
              : "top-6 text-base"
          }`}
        >
          Your Comments *
        </label>
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

      <button
        type="submit"
        disabled={isSubmitting}
        aria-label="Submit comment"
        className="ar-btn group gap-3 inline-flex items-center px-8 py-4 bg-zPink text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <>
            <span className="relative z-10 font-semibold">Submitting</span>
            <svg
              className="relative z-10 animate-spin h-5 w-5"
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
            <span className="relative z-10 font-semibold">Submit Comment</span>
            <Image
              width={20}
              height={20}
              src="/assets/img/arrow.png"
              alt="Arrow"
              className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-linear-to-r from-zPink to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        )}
      </button>
    </form>
  );
};

export default BlogCommentForm;
