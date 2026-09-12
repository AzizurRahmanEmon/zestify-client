"use client";

import ZestyChatLayout from "@/components/chat/ZestyChatLayout";
import { isZestyChatConfigured } from "@/services/zestyChat";

const ZestyChatSection = () => {
  const isConfigured = isZestyChatConfigured();

  return (
    <section className="py-16 lg:py-24">
      <div className="ar-container max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-zPink">
            Ask Zesty
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 lg:text-4xl">
            Your menu &amp; reservation assistant
          </h1>
          <p className="mt-3 text-gray-600">
            Discover dishes, check availability, and book a table — all in one
            conversation.
          </p>
        </div>

        {!isConfigured && (
          <div
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            role="alert"
          >
            Chat is unavailable: set{" "}
            <code className="rounded bg-red-100 px-1 py-0.5">
              NEXT_PUBLIC_TENANT_ID
            </code>{" "}
            in your client app environment so Zesty knows which restaurant to
            assist.
          </div>
        )}

        <ZestyChatLayout />
      </div>
    </section>
  );
};

export default ZestyChatSection;
