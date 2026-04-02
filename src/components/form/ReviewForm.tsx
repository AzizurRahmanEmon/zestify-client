"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { canReviewProduct, postProductReview } from "@/lib/api";
import { getCurrentCustomer } from "@/lib/auth";
import Link from "next/link";

type Props = {
  productSlug: string;
  onPosted?: () => void;
};

const ReviewForm = ({ productSlug, onPosted }: Props) => {
  const existingCustomer = useMemo(() => getCurrentCustomer(), []);
  const [name, setName] = useState(existingCustomer?.name || "");
  const [email, setEmail] = useState(existingCustomer?.email || "");
  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState<boolean | null>(null);

  useEffect(() => {
    const cleanEmail = String(email || "")
      .toLowerCase()
      .trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setCanReview(null);
      return;
    }
    let cancelled = false;
    canReviewProduct(productSlug, cleanEmail)
      .then((ok) => {
        if (!cancelled) setCanReview(ok);
      })
      .catch(() => {
        if (!cancelled) setCanReview(null);
      });
    return () => {
      cancelled = true;
    };
  }, [email, productSlug]);

  const submitDisabled =
    submitting ||
    !consent ||
    !name.trim() ||
    !email.trim() ||
    review.trim().length < 10 ||
    canReview === false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanReview = review.trim();

    if (!cleanName || cleanName.length < 2) {
      toast.error("Please enter your name");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!consent) {
      toast.error("Please accept the privacy policy");
      return;
    }
    if (cleanReview.length < 10) {
      toast.error("Review must be at least 10 characters long");
      return;
    }
    if (canReview === false) {
      toast.error("Only purchasers can review this product");
      return;
    }

    try {
      setSubmitting(true);
      await postProductReview(productSlug, {
        name: cleanName,
        email: cleanEmail,
        rating,
        review: cleanReview,
      });
      toast.success("Review posted successfully");
      setReview("");
      setConsent(false);
      setCanReview(false);
      onPosted?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to post review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lg:mt-12 mt-10">
      <h4 className="text-2xl font-semibold pb-2 border-b-2 border-zPink w-max">
        Add Review
      </h4>
      <form
        className="flex flex-col gap-8 mt-10 xl:w-[90%]"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative group">
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              className="peer w-full h-16 px-6 pt-6 pb-2 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-transparent focus:outline-none focus:border-zPink focus:ring-0 transition-all duration-300 hover:border-gray-400 disabled:opacity-50"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
            <label
              htmlFor="fullName"
              className="absolute left-6 top-4 text-gray-500 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-zPink peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-zPink"
            >
              Full Name *
            </label>
          </div>

          <div className="relative group">
            <input
              type="email"
              id="email"
              name="email"
              required
              className="peer w-full h-16 px-6 pt-6 pb-2 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-transparent focus:outline-none focus:border-zPink focus:ring-0 transition-all duration-300 hover:border-gray-400 disabled:opacity-50"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
            <label
              htmlFor="email"
              className="absolute left-6 top-4 text-gray-500 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-zPink peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-zPink"
            >
              Email Address *
            </label>
          </div>
        </div>

        {canReview === false && (
          <div className="text-sm text-red-600">
            Only customers who purchased this product can review it (using the
            same email).
          </div>
        )}

        <div className="relative">
          <fieldset className="border-2 border-gray-300 rounded-xl px-6 py-4 hover:border-gray-400 transition-all duration-300 focus-within:border-zPink">
            <legend className="px-2 text-sm text-gray-500 bg-white">
              Rating *
            </legend>
            <div className="flex gap-4 mt-2" role="radiogroup">
              <div className="flex items-start flex-col gap-5 md:flex-row md:gap-8">
                {[5, 4, 3, 2, 1].map((v) => (
                  <label
                    key={v}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={String(v)}
                      checked={rating === v}
                      onChange={() => setRating(v)}
                      className="w-4 h-4 text-zPink border-2 border-gray-300 focus:ring-2 focus:ring-zPink focus:ring-offset-2"
                      disabled={submitting}
                    />
                    <span className="flex gap-1">
                      <span className="text-yellow-400 text-xl">
                        {"★".repeat(v)}
                        {"☆".repeat(5 - v)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>
        </div>

        <div className="relative group">
          <textarea
            id="review"
            name="review"
            required
            rows={5}
            className="peer w-full px-6 pt-8 pb-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-transparent focus:outline-none focus:border-zPink focus:ring-0 transition-all duration-300 hover:border-gray-400 resize-none disabled:opacity-50"
            placeholder="Your detailed review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            disabled={submitting}
          ></textarea>
          <label
            htmlFor="review"
            className="absolute left-6 top-4 text-gray-500 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-zPink peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-zPink"
          >
            Your Review *
          </label>
          <div id="reviewHelp" className="mt-2 text-sm text-gray-500">
            Share your thoughts and experience (minimum 10 characters)
          </div>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="w-5 h-5 mt-0.5 text-zPink border-2 border-gray-300 rounded focus:ring-2 focus:ring-zPink focus:ring-offset-2 disabled:opacity-50"
            disabled={submitting}
          />
          <label
            htmlFor="consent"
            className="text-sm text-gray-600 cursor-pointer flex-1"
          >
            I agree to the
            <Link href="/privacy" className="text-zPink hover:underline">
              {" "}
              privacy policy{" "}
            </Link>
            and consent to my review being published publicly.
          </label>
        </div>

        <button
          type="submit"
          disabled={submitDisabled}
          className="relative overflow-hidden bg-linear-to-r from-zPink to-pink-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-zPink focus:ring-opacity-50 group max-w-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <span className="relative z-10 flex justify-center items-center gap-3">
            <span>{submitting ? "Posting..." : "Post Review"}</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              ></path>
            </svg>
          </span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
