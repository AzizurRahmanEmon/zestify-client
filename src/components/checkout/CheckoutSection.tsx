"use client";
import CheckoutForm from "@/components/form/CheckoutForm";

const CheckoutSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-zPink rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      <div className="ar-container py-20 lg:py-30 relative z-10">
        <CheckoutForm />
      </div>
    </section>
  );
};

export default CheckoutSection;
