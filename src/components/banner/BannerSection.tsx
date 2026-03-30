import Image from "next/image";
import Link from "next/link";

interface Props {
  backgroundImage?: string;
  subtitle?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

const BannerSection = ({
  backgroundImage = "/assets/img/modern-banner.webp",
  subtitle = "Limited Time Offer",
  title = "Savor the Moment:\nExquisite Flavors Delivered to Your Door",
  description = "Welcome to our culinary sanctuary, where every dish tells a story, and every bite is an adventure. Discover fresh ingredients and masterfully crafted meals designed to delight your senses.",
  buttonText = "ORDER NOW",
  buttonLink = "/shop",
}: Props) => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="ar-container relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 md:py-30">
          <div className="flex items-center gap-3 mb-2 md:mb-4 animate-fade-in-up">
            <span>
              <Image
                alt="fire icon"
                loading="lazy"
                width="14"
                height="22"
                src="/assets/img/fire.png"
              />
            </span>
            <h6 className="ar-subtitle text-white text-base md:text-lg font-semibold tracking-wider uppercase">
              {subtitle}
            </h6>
          </div>
          <div className="animate-fade-in-up animation-delay-200">
            <h2 className="font-primary text-4xl sm:text-5xl sm:leading-[1.3] md:text-6xl md:leading-tight lg:text-[62px] xl:text-7xl lg:leading-tight leading-tight font-extrabold mt-1 md:mt-4 max-w-4xl">
              {title.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < title.split("\n").length - 1 && <br />}
                </span>
              ))}
            </h2>
          </div>
          <div className="animate-fade-in-up animation-delay-400">
            <p className="max-w-2xl text-sm sm:text-base md:text-xl leading-relaxed mt-5 md:mt-8 text-gray-200">
              {description}
            </p>
          </div>
          <div className="mt-12 animate-fade-in-up animation-delay-600">
            <Link
              className="relative ar-btn inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 rounded-full overflow-hidden bg-zPink text-white font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider transition-all duration-500 ease-in-out group focus:outline-none focus:ring-1 focus:ring-offset-2"
              href={buttonLink}
            >
              <i className="fa-regular fa-moped z-10 relative group-hover:text-gray-900 transition-all duration-300"></i>
              <span className="relative z-10 transition-all duration-500 group-hover:text-gray-900">
                {buttonText}
              </span>
              <span
                className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-in-out group-hover:w-full"
                aria-hidden="true"
              ></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
