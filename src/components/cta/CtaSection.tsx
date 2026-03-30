import Image from "next/image";

interface Props {
  leftText?: string;
  rightText?: string;
  leftBg?: string;
  rightBg?: string;
}

const CtaSection = ({
  leftText = "Fast Foods",
  rightText = "Fast Pizza",
  leftBg = "/assets/img/cta-bg-1.png",
  rightBg = "/assets/img/cta-bg-1.png",
}: Props) => {
  return (
    <div className="animate-fade-in-up animation-delay-800">
      <div className="flex lg:flex-row flex-col absolute -bottom-28 lg:-bottom-14 xl:-bottom-19 w-full">
        <div
          className="lg:w-1/2 w-full xl:px-11 xl:py-10 px-7.5 py-8 flex justify-between items-center bg-[#323232] bg-no-repeat bg-cover cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#404040] hover:scale-105 hover:shadow-2xl group"
          style={{
            backgroundImage: `url(${leftBg})`,
          }}
        >
          <div className="relative">
            <Image
              width={54}
              height={84}
              src="/assets/img/fire-lg.png"
              alt="icon"
              className="w-auto h-16 xl:h-21 absolute left-0 top-[45%] -translate-y-1/2 object-cover"
            />
            <h5 className="pl-8 xl:pl-9.5 whitespace-nowrap z-10 relative text-white text-4xl sm:text-5xl xl:text-7xl leading-tight font-primary">
              {leftText}
            </h5>
          </div>
          <div className="relative">
            <Image
              width={64}
              height={24}
              src="/assets/img/right-arrow.png"
              alt="arrow"
              className="absolute top-1/2 -translate-y-1/2 -left-4 xl:-left-6"
            />
            <span className="block xl:w-16 xl:h-16 w-12 h-12 border border-white rounded-full"></span>
          </div>
        </div>
        <div
          className="lg:w-1/2 w-full xl:px-11 xl:py-10 px-7.5 py-8 flex justify-between items-center bg-zPink bg-no-repeat bg-cover cursor-pointer transition-all duration-300 ease-in-out hover:bg-zPink/90 hover:scale-105 hover:shadow-2xl group"
          style={{
            backgroundImage: `url(${rightBg})`,
          }}
        >
          <div className="relative">
            <Image
              width={54}
              height={84}
              src="/assets/img/fire-lg.png"
              alt="icon"
              className="w-auto h-16 xl:h-21 absolute left-0 top-[45%] -translate-y-1/2 object-cover"
            />
            <h5 className="pl-8 xl:pl-9.5 whitespace-nowrap z-10 relative text-white text-4xl sm:text-5xl xl:text-7xl leading-tight font-primary">
              {rightText}
            </h5>
          </div>
          <div className="relative">
            <Image
              width={64}
              height={24}
              src="/assets/img/right-arrow.png"
              alt="arrow"
              className="absolute top-1/2 -translate-y-1/2 -left-4 xl:-left-6"
            />
            <span className="block xl:w-16 xl:h-16 w-12 h-12 border border-white rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;
