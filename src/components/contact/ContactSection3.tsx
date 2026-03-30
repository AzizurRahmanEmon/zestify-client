import HomeReservationForm from "@/components/form/HomeReservationForm";

interface Props {
  variantTwo?: boolean;
}

const ContactSection3 = ({ variantTwo }: Props) => {
  return (
    <section
      className="bg-no-repeat bg-cover bg-center relative"
      style={{
        backgroundImage: variantTwo
          ? `url(/assets/img/service-contact-bg.png)`
          : `url(/assets/img/contact-bg.png)`,
      }}
    >
      <div className="ar-container py-20 xl:py-30 relative z-10">
        <div className="flex flex-col lg:flex-row justify-center gap-10 overflow-hidden">
          <div className="lg:max-w-105 xl:max-w-142.5">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2">
                <span
                  className={`block w-15.25 h-0.75 ${
                    variantTwo ? "bg-zPink" : "bg-zOrange"
                  }`}
                ></span>
                <h6 className="ar-subtitle text-white">Contact With Us</h6>
              </div>
              <h3 className="ar-title text-white mt-3">
                Say Hi For Nutritious
              </h3>
            </div>
            <p className="text-white leading-6 mt-4 md:mt-7 w-11/12 animate-fade-in-up animation-delay-200">
              We're here to help you on your wellness journey. Reach out to us
              for personalized nutrition advice, consultations, or any questions
              you might have about our services.
            </p>
            <ul className="flex flex-col gap-5 md:gap-8 mt-10">
              <li className="flex items-center gap-4 group animate-fade-in-up animation-delay-400">
                <div
                  className={`w-12 h-12 md:w-15 md:h-15 ${
                    variantTwo
                      ? "bg-zPink group-hover:text-zPink"
                      : "bg-zOrange group-hover:text-zOrange"
                  } text-white text-2xl md:text-3xl inline-flex items-center justify-center transition-colors group-hover:bg-white rounded-lg`}
                >
                  <i className="fa-regular fa-envelope-open-text"></i>
                </div>
                <div className="text-white md:text-lg font-medium">
                  <h6 className="mb-1">Email Us:</h6>
                  <a
                    href="mailto:Contactyourmail@gmail.com"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    Contactyourmail@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4 group animate-fade-in-up animation-delay-600">
                <div
                  className={`w-12 h-12 md:w-15 md:h-15 ${
                    variantTwo
                      ? "bg-zPink group-hover:text-zPink"
                      : "bg-zOrange group-hover:text-zOrange"
                  } text-white text-2xl md:text-3xl inline-flex items-center justify-center transition-colors group-hover:bg-white rounded-lg`}
                >
                  <i className="fa-regular fa-phone"></i>
                </div>
                <div className="text-white md:text-lg font-medium">
                  <h6 className="mb-1">Call Us:</h6>
                  <h6>+88012 2910 1781, +88019 6128 1689</h6>
                </div>
              </li>
              <li className="flex items-center gap-4 group animate-fade-in-up animation-delay-800">
                <div
                  className={`w-12 h-12 md:w-15 md:h-15 ${
                    variantTwo
                      ? "bg-zPink group-hover:text-zPink"
                      : "bg-zOrange group-hover:text-zOrange"
                  } text-white text-2xl md:text-3xl inline-flex items-center justify-center transition-colors group-hover:bg-white rounded-lg`}
                >
                  <i className="fa-regular fa-building"></i>
                </div>
                <div className="text-white md:text-lg font-medium">
                  <h6 className="mb-1">Office:</h6>
                  <h6>Mountain Green Road 2389, NY, USA</h6>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex-1 max-w-185.25">
            <h3 className="ar-title text-white animate-fade-in-up mb-6">
              {variantTwo ? "Reserve a Table" : "Contact Form"}
            </h3>
            <HomeReservationForm />
          </div>
        </div>
      </div>
      <div className="z-0 bg-[#101115] opacity-45 absolute left-0 top-0 h-full w-full"></div>
    </section>
  );
};

export default ContactSection3;
