"use client";
import Link from "next/link";

interface HomeReservationActionsProps {
  formData: {
    terms: boolean;
    marketing: boolean;
  };
  isSubmitting: boolean;
  onSubmit: () => void;
  onInputChange: (field: "terms" | "marketing", value: boolean) => void;
}

const HomeReservationActions = ({
  formData,
  isSubmitting,
  onSubmit,
  onInputChange,
}: HomeReservationActionsProps) => {
  return (
    <>
      <div className="space-y-4">
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={(e) => onInputChange("terms", e.target.checked)}
              disabled={isSubmitting}
              className="peer sr-only"
              required
            />
            <div
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center overflow-hidden transition-all duration-300 ${
                formData.terms
                  ? "bg-zPink border-zPink"
                  : "bg-transparent border-gray-500"
              } peer-hover:border-zPink/70 peer-focus:ring-2 peer-focus:ring-zPink/50 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed`}
            >
              <svg
                className={`w-5 h-5 text-white transition-all duration-200 ${
                  formData.terms
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-lg bg-zPink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
          </div>
          <span className="text-gray-100 text-sm leading-6">
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-zPink hover:text-zPink/80 underline transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-zPink hover:text-zPink/80 underline transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-zPink">*</span>
          </span>
        </label>

        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="marketing"
              name="marketing"
              checked={formData.marketing}
              onChange={(e) => onInputChange("marketing", e.target.checked)}
              disabled={isSubmitting}
              className="peer sr-only"
            />
            <div
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center overflow-hidden transition-all duration-300 ${
                formData.marketing
                  ? "bg-zPink border-zPink"
                  : "bg-transparent border-gray-500"
              } peer-hover:border-zPink/70 peer-focus:ring-2 peer-focus:ring-zPink/50 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed`}
            >
              <svg
                className={`w-5 h-5 text-white transition-all duration-200 ${
                  formData.marketing
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-lg bg-zPink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
          </div>
          <span className="text-gray-100 text-sm leading-6">
            Send me special offers and updates via email
          </span>
        </label>
      </div>

      <div className="pt-4">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="group relative w-full h-16 bg-zPink hover:bg-zPink/90 text-white font-semibold rounded-xl transition-all duration-300 overflow-hidden focus:outline-none focus:ring-1 focus:ring-zPink/60 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="relative z-10 flex items-center justify-center space-x-3">
              <span>Submitting</span>
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
            </span>
          ) : (
            <>
              <span className="relative z-10 flex items-center justify-center space-x-3">
                <span>Reserve Your Table</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default HomeReservationActions;
