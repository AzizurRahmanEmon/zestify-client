"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

// Constants
const ALERT_DURATION = 4000;
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, ALERT_DURATION);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Email address is required.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format.");
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const res = await fetch(`${API_URL}/customers/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to send OTP");

      toast.success("Verification code sent to your email!");
      setStep(2);
    } catch (error: any) {
      toast.error(error.message || "Failed to process request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Verification code is required.");
      return;
    }
    if (!password) {
      toast.error("New password is required.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const res = await fetch(`${API_URL}/customers/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          password,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to reset password");

      toast.success("Password reset successful! Please login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-600">
            Enter your email to receive a verification code
          </p>
        </div>
        <form onSubmit={handleRequestOtp}>
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 hover:border-gray-400 rounded-xl focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zPink text-white py-4 rounded-xl font-bold hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-pink-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Send Verification Code"
              )}
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-zPink transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600">Verification code sent to {email}</p>
      </div>
      <form onSubmit={handleResetPassword}>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Verification Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-key text-gray-400"></i>
              </div>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 hover:border-gray-400 rounded-xl focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50"
                placeholder="Enter 6-digit code"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400"></i>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 hover:border-gray-400 rounded-xl focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-zPink"
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-check-double text-gray-400"></i>
              </div>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 hover:border-gray-400 rounded-xl focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-200 disabled:opacity-50"
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zPink text-white py-4 rounded-xl font-bold hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-pink-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Reset Password"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-gray-600 hover:text-zPink transition-colors"
            >
              Back to Step 1
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
