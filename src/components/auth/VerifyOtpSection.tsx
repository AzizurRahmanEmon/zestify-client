import { Suspense } from "react";
import VerifyOtpForm from "@/components/form/VerifyOtpForm";

const VerifyOtpSection = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-30">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-zPink rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-zPink rounded-full blur-3xl"></div>
      </div>

      <div className="ar-container relative z-10">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              We sent a verification code to your email
            </p>
          </div>

          <Suspense
            fallback={
              <div className="text-center text-gray-500">Loading...</div>
            }
          >
            <VerifyOtpForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default VerifyOtpSection;
