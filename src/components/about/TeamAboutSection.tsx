import Image from "next/image";

const TeamAboutSection = () => {
  return (
    <section className="lg:py-30 py-20 bg-linear-to-b from-white to-gray-50 overflow-hidden">
      <div className="ar-container">
        <div
          className="flex flex-col lg:flex-row gap-10 xl:gap-16
         items-center"
        >
          <div className="animate-fade-in-up lg:flex-1">
            <div className="flex items-center lg:justify-start justify-center gap-2">
              <Image
                width={14}
                height={22}
                src="/assets/img/fire.png"
                alt="fire"
              />
              <h6 className="ar-subtitle">Why Choose Our Team</h6>
            </div>
            <h2 className="ar-title mt-4 text-center lg:text-start">
              Experience the Magic of Culinary Excellence
            </h2>
            <p className="text-gray-600 lg:text-lg text-center lg:text-start leading-relaxed mt-3 lg:mt-6">
              Our passionate team of culinary experts brings years of experience
              and creativity to every dish. From traditional recipes to
              innovative fusion cuisine, we're dedicated to delivering
              exceptional flavors that will tantalize your taste buds.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 w-max mx-auto lg:mx-0 gap-5 lg:gap-10 mt-8 lg:mt-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zPink rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg lg:text-xl">
                    15+
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Years Experience
                  </h4>
                  <p className="text-gray-600 text-sm">In culinary arts</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zPink rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg lg:text-xl">
                    50+
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Signature Dishes
                  </h4>
                  <p className="text-gray-600 text-sm">Crafted with love</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-11/12 lg:w-2/5 animate-fade-in-up animation-delay-200">
            <div className="relative z-10">
              <Image
                width={600}
                height={500}
                src="/assets/img/about-img.jpg"
                alt="Our Kitchen"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="absolute top-8 right-8 w-32 h-32 bg-zPink rounded-full opacity-20 -z-10"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 bg-yellow-400 rounded-full opacity-20 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamAboutSection;
