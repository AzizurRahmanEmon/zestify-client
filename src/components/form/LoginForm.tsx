"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { setCurrentCustomer } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

// Constants
const ALERT_DURATION = 4000;

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const socialLogins = [
  { id: 1, icon: "facebook-f", label: "Facebook", color: "#1877F2" },
  { id: 2, icon: "google", label: "Google", color: "#EA4335" },
  { id: 3, icon: "twitter", label: "Twitter", color: "#1DA1F2" },
  { id: 4, icon: "linkedin-in", label: "LinkedIn", color: "#0A66C2" },
];

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        email: formData.email.trim(),
        password: formData.password.trim(),
        rememberMe: formData.rememberMe,
      };

      // Clear previous alerts when submitting
      setAlert(null);

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

      // Validate password input
      if (!trimmedData.password) {
        setAlert({ type: "danger", message: "Password is required." });
        toast.error("Please enter your password.", {
          autoClose: ALERT_DURATION,
        });
        focusField("password");
        return;
      }

      if (trimmedData.password.length < 6) {
        setAlert({
          type: "danger",
          message: "Password must be at least 6 characters long.",
        });
        toast.error("Password is too short.", { autoClose: ALERT_DURATION });
        focusField("password");
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch(`${API_URL}/customers/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: trimmedData.email,
            password: trimmedData.password,
          }),
          cache: "no-store",
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(
            `Login failed (${res.status}) ${res.statusText} ${txt}`.trim(),
          );
        }
        const json = await res.json();
        const customer = json?.data ?? json;
        setCurrentCustomer(customer);
        setAlert({
          type: "success",
          message: "Login successful! Welcome back.",
        });
        toast.success("Login successful! Welcome back.", {
          autoClose: ALERT_DURATION,
        });
        router.push("/dashboard");
      } catch (error: any) {
        setAlert({
          type: "danger",
          message: error?.message || "Invalid credentials. Please try again.",
        });
        toast.error("Invalid credentials. Please try again.", {
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

          {/* Password Field */}
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
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="true"
                aria-label="Password"
                aria-required="true"
                aria-invalid={alert?.type === "danger"}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 hover:border-gray-400 rounded-xl focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                    formData.rememberMe
                      ? "bg-zPink border-zPink"
                      : "border-gray-300 group-hover:border-zPink"
                  }`}
                >
                  {formData.rememberMe && (
                    <i className="fas fa-check text-white text-xs"></i>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                Remember me
              </span>
            </label>

            <Link
              href="/forgot-password"
              className="text-sm text-zPink hover:text-zPink/80 font-medium transition-colors"
            >
              Forgot password?
            </Link>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zPink text-white py-3 px-4 rounded-xl font-medium hover:bg-zPink/90 focus:ring-2 focus:ring-zPink focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-sm text-gray-500 bg-white">
          Or continue with
        </span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {socialLogins.map((social) => (
          <button
            key={social.id}
            type="button"
            className="flex items-center justify-center w-full py-3 border border-gray-200 rounded-xl hover:border-zPink hover:bg-zPink/5 transition-all duration-200 group"
          >
            <i
              className={`fab fa-${social.icon} text-xl text-gray-600 group-hover:text-zPink transition-colors`}
            ></i>
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-zPink hover:text-zPink/80 font-medium transition-colors"
        >
          Create one now
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
