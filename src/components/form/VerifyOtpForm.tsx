"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/api";
import { setCurrentCustomer } from "@/lib/auth";

const TENANT_ID =
  process.env.NEXT_PUBLIC_TENANT_ID ||
  process.env.NEXT_PUBLIC_TENANT_SLUG ||
  "";

const ALERT_DURATION = 4000;

const VerifyOtpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      toast.error("No email provided. Please start from login.", {
        autoClose: ALERT_DURATION,
      });
      router.push("/login");
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const digit = value.slice(-1);
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (!pasted) return;
      const newOtp = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
      setOtp(newOtp);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    },
    [],
  );

  const handleVerify = useCallback(async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit code.", { autoClose: ALERT_DURATION });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/customers/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
        },
        body: JSON.stringify({ email, otp: code }),
        cache: "no-store",
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Invalid or expired code.");
      }

      const customer = json?.data ?? json;
      setCurrentCustomer(customer);
      toast.success("Login successful! Welcome back.", {
        autoClose: ALERT_DURATION,
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Verification failed. Please try again.", {
        autoClose: ALERT_DURATION,
      });
    } finally {
      setIsLoading(false);
    }
  }, [otp, email, router]);

  const handleResend = useCallback(async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      const res = await fetch(`${API_URL}/customers/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
        },
        body: JSON.stringify({ email }),
        cache: "no-store",
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to resend code.");
      }

      toast.success("A new code has been sent to your email.", {
        autoClose: ALERT_DURATION,
      });
      setCountdown(60);
    } catch (error: any) {
      toast.error(error?.message || "Failed to resend code.", {
        autoClose: ALERT_DURATION,
      });
    } finally {
      setIsResending(false);
    }
  }, [email, countdown]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isLoading}
            className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-zPink focus:outline-none focus:ring-2 focus:ring-zPink/20 transition-all duration-200 disabled:opacity-50"
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={isLoading || otp.join("").length !== 6}
        className="w-full bg-zPink text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Verifying..." : "Verify & Login"}
      </button>

      <div className="text-center">
        <button
          onClick={handleResend}
          disabled={countdown > 0 || isResending}
          className="text-zPink font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
        >
          {isResending
            ? "Sending..."
            : countdown > 0
              ? `Resend code in ${countdown}s`
              : "Resend code"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
