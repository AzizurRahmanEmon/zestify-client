import LoginForm from "@/components/form/LoginForm";

const LoginSection = () => {
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
              Welcome back
            </h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
