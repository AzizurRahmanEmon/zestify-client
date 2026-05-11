"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { setCurrentCustomer } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

// Constants
const ALERT_DURATION = 4000;

const TENANT_ID =
  process.env.NEXT_PUBLIC_TENANT_ID ||
  process.env.NEXT_PUBLIC_TENANT_SLUG ||
  "";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  phone: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    phone: "",
  });

  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const focusField = useCallback((field: keyof FormData) => {
    const element = document.getElementById(field);
    element?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear alerts when user starts typing (better UX)
    if (alert?.type === "danger") {
      setAlert(null);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Trim all values
      const trimmedData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        confirmPassword: formData.confirmPassword.trim(),
        agreeToTerms: formData.agreeToTerms,
      };

      // Clear previous alerts when submitting
      setAlert(null);

      // Validate username input
      if (!trimmedData.username) {
        setAlert({ type: "danger", message: "Username is required." });
        toast.error("Please enter a username.", { autoClose: ALERT_DURATION });
        focusField("username");
        return;
      }

      if (trimmedData.username.length < 3) {
        setAlert({
          type: "danger",
          message: "Username must be at least 3 characters long.",
        });
        toast.error("Username is too short.", { autoClose: ALERT_DURATION });
        focusField("username");
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(trimmedData.username)) {
        setAlert({
          type: "danger",
          message:
            "Username can only contain letters, numbers, and underscores.",
        });
        toast.error("Invalid username format.", { autoClose: ALERT_DURATION });
        focusField("username");
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

      // Validate phone
      if (!formData.phone.trim()) {
        setAlert({ type: "danger", message: "Phone number is required." });
        toast.error("Please enter a valid phone number.", {
          autoClose: ALERT_DURATION,
        });
        return;
      }

      // Validate password input
      if (!trimmedData.password) {
        setAlert({ type: "danger", message: "Password is required." });
        toast.error("Please enter a password.", { autoClose: ALERT_DURATION });
        focusField("password");
        return;
      }

      if (trimmedData.password.length < 8) {
        setAlert({
          type: "danger",
          message: "Password must be at least 8 characters long.",
        });
        toast.error("Password is too short.", { autoClose: ALERT_DURATION });
        focusField("password");
        return;
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(trimmedData.password)) {
        setAlert({
          type: "danger",
          message: "Password must contain uppercase, lowercase, and number.",
        });
        toast.error("Password doesn't meet requirements.", {
          autoClose: ALERT_DURATION,
        });
        focusField("password");
        return;
      }

      // Validate confirm password input
      if (!trimmedData.confirmPassword) {
        setAlert({
          type: "danger",
          message: "Please confirm your password.",
        });
        toast.error("Please confirm your password.", {
          autoClose: ALERT_DURATION,
        });
        focusField("confirmPassword");
        return;
      }

      if (trimmedData.password !== trimmedData.confirmPassword) {
        setAlert({
          type: "danger",
          message: "Passwords do not match.",
        });
        toast.error("Passwords do not match.", { autoClose: ALERT_DURATION });
        focusField("confirmPassword");
        return;
      }

      // Validate terms agreement
      if (!trimmedData.agreeToTerms) {
        setAlert({
          type: "danger",
          message: "You must agree to the terms and conditions.",
        });
        toast.error("Please agree to the terms and conditions.", {
          autoClose: ALERT_DURATION,
        });
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch(`${API_URL}/customers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
          },
          body: JSON.stringify({
            name: trimmedData.username,
            email: trimmedData.email,
            phone: formData.phone.trim(),
            password: trimmedData.password,
          }),
          cache: "no-store",
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(
            `Registration failed (${res.status}) ${res.statusText} ${txt}`.trim(),
          );
        }
        const json = await res.json();
        const customer = json?.data ?? json;
        setCurrentCustomer(customer);
        setAlert({
          type: "success",
          message: "Registration successful! Welcome to our platform.",
        });
        toast.success("Registration successful! Welcome to our platform.", {
          autoClose: ALERT_DURATION,
        });
        router.push("/dashboard");
      } catch (error: any) {
        setAlert({
          type: "danger",
          message: error?.message || "Registration failed. Please try again.",
        });
        toast.error("Something went wrong. Please try again.", {
          autoClose: ALERT_DURATION,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateEmail, focusField],
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-user text-gray-400"></i>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-label="Username"
                aria-required="true"
                aria-invalid={alert?.type === "danger"}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 hover:border-gray-400 rounded-xl focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-phone text-gray-400"></i>
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-label="Phone Number"
                aria-required="true"
                aria-invalid={alert?.type === "danger"}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 hover:border-gray-400 rounded-xl focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-envelope text-gray-400"></i>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-label="Email Address"
                aria-required="true"
                aria-invalid={alert?.type === "danger"}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 hover:border-gray-400 rounded-xl focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400"></i>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-label="Password"
                aria-required="true"
                aria-invalid={alert?.type === "danger"}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 hover:border-gray-400 rounded-xl focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-zPink transition-colors disabled:opacity-50"
              >
                <i
                  className={`fas ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  } text-gray-500 hover:text-zPink`}
                ></i>
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400"></i>
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-label="Confirm Password"
                aria-required="true"
                aria-invalid={alert?.type === "danger"}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 hover:border-gray-400 rounded-xl focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Repeat your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-zPink transition-colors disabled:opacity-50"
              >
                <i
                  className={`fas ${
                    showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                  } text-gray-500 hover:text-zPink`}
                ></i>
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                    formData.agreeToTerms
                      ? "bg-zPink border-zPink"
                      : "border-gray-300 group-hover:border-zPink"
                  }`}
                >
                  {formData.agreeToTerms && (
                    <i className="fas fa-check text-white text-xs"></i>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors leading-relaxed">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-zPink hover:text-zPink/80 font-medium"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-zPink hover:text-zPink/80 font-medium"
                >
                  Privacy Policy
                </Link>
              </span>
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
            disabled={isLoading}
            className="w-full bg-zPink text-white py-3 px-4 rounded-xl font-medium hover:bg-zPink/90 focus:ring-2 focus:ring-zPink focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </>
            )}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-zPink hover:text-zPink/80 font-medium transition-colors"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
