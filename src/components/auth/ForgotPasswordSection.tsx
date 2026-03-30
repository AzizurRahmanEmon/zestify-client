"use client";
import ForgotPasswordForm from "../form/ForgotPasswordForm";

const ForgotPasswordSection = () => {
  return (
    <section className="login-section py-20 lg:py-32 relative overflow-hidden bg-gray-50 min-h-screen flex items-center">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-zPink/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-zPink/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="ar-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content & Image */}
          <div className="hidden lg:block relative">
            <div className="relative z-10">
              <span className="text-zPink font-bold text-lg mb-4 block uppercase tracking-widest">
                Account Recovery
              </span>
              <h1 className="text-5xl xl:text-6xl font-black text-gray-900 mb-8 leading-tight">
                Don't worry, we've got you{" "}
                <span className="text-zPink">covered.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
                Enter your email address and we'll send you a verification code
                to reset your password.
              </p>

              {/* Feature highlights */}
              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-zPink text-xl">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <span className="font-bold text-gray-800 text-lg">
                    Secure Recovery Process
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-zPink text-xl">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <span className="font-bold text-gray-800 text-lg">
                    Fast Verification
                  </span>
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative w-full mt-10">
              {/* Floating element */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-zPink rounded-2xl flex items-center justify-center text-white text-2xl">
                    <i className="fas fa-lock-open"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                      Success Rate
                    </p>
                    <p className="text-2xl font-black text-gray-900">100%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="relative">
            <div className="lg:max-w-md mx-auto relative z-10">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordSection;
