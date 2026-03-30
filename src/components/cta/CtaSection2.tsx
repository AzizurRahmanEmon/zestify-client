import Image from "next/image";
const CtaSection2 = () => {
  return (
    <section
      className="bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url(/assets/img/beans-shape.png)`,
      }}
    >
      <div className="flex items-center justify-between flex-col lg:flex-row overflow-hidden">
        <div className="max-w-187.5 lg:w-1/2 sm:w-10/12 px-4 py-16 lg:pl-12 xl:py-22.5 2xl:pl-32">
          <div>
            <div className="flex items-center justify-center lg:justify-start gap-2 animate-fade-in-up">
              <span className="block w-15.25 h-0.75 coffee-gradient rounded-full"></span>
              <h6 className="text-orange-600 font-primary font-semibold text-sm uppercase tracking-wide">
                Order And Pay
              </h6>
            </div>
            <h3 className="ar-title text-center lg:text-start mt-3 xl:mt-5 animate-fade-in-up animation-delay-200">
              Looking For The App
            </h3>
          </div>

          <div>
            <p className="mt-5 leading-7 xl:mt-8 2xl:text-lg 2xl:leading-normal max-w-150 text-center lg:text-start text-gray-600 animate-fade-in-up animation-delay-400">
              These computer icon designs are brilliant for commercial use,
              applying to your graphics, handbook, and PowerPoint projects. This
              will no doubt save you time
            </p>
            <div className="flex gap-8 mt-8 xl:mt-12 flex-col sm:flex-row sm:justify-center lg:justify-start items-center animate-fade-in-up animation-delay-600">
              <a
                href="#"
                className="py-3 text-white flex gap-2 items-center bg-[#171312] hover:bg-black px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Image
                  width={47}
                  height={48}
                  src="/assets/img/playstore.png"
                  alt="icon"
                  className="scale-75"
                />
                <span className="text-xs">
                  Download on the <br />
                  <span className="text-lg">Google play</span>
                </span>
              </a>
              <a
                href="#"
                className="py-3 text-white flex gap-2 items-center bg-[#171312] hover:bg-black px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Image
                  width={38}
                  height={44}
                  src="/assets/img/apple.png"
                  alt="icon"
                  className="scale-75"
                />
                <span className="text-xs">
                  Download on the <br />
                  <span className="text-lg">App Store</span>
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 px-4 py-16 lg:pr-12 lg:py-24 xl:py-20 2xl:pr-32 lg:h-full bg-linear-to-br from-orange-400 to-red-500 coffee-about-clippath-2 flex justify-end items-center overflow-hidden">
          <Image
            width={611}
            height={522}
            src="/assets/img/delivery_1.png"
            alt="delivery"
            className="w-11/12 sm:w-4/5 md:w-4/6 lg:w-4/5 xl:w-4/6 mx-auto lg:ml-auto lg:mr-0 hover:scale-105 transition-transform duration-300 scooter-popup"
          />
        </div>
      </div>
    </section>
  );
};

export default CtaSection2;
