import Image from "next/image";
import Link from "next/link";
import type { ProductDataType } from "@/types";

interface Props {
  title?: string;
  subtitle?: string;
  products?: ProductDataType[];
}

type MenuItem = {
  id: string;
  imgSrc: string;
  altText: string;
  title: string;
  description: string;
  rating: number;
  price: string;
};

const MenuSection = ({
  title = "Choose Your Best Menu",
  subtitle = "Mesmerizing taste",
  products,
}: Props) => {
  const formatPrice = (value: number) => value.toFixed(2);
  const items: MenuItem[] = (products || []).slice(0, 3).map((p) => ({
    id: p.slug,
    imgSrc: p.image,
    altText: p.name,
    title: p.name,
    description: p.description || "",
    rating: Math.max(4, Math.min(5, Math.round(p.rating?.stars || 5))),
    price: `$${formatPrice(p.price ?? 0)}`,
  }));

  return (
    <section
      className="bg-[#111111] bg-repeat text-white py-20 lg:py-30"
      style={{
        backgroundImage: `url(/assets/img/shape-bg-2.png)`,
      }}
    >
      <div className="ar-container">
        <div className="flex flex-col xl:flex-row items-center gap-15 lg:gap-20 overflow-hidden">
          <div className="lg:flex-1 w-full sm:w-4/5">
            <div className="flex flex-col overflow-hidden">
              <div className="flex items-center justify-center lg:justify-start gap-2 animate-fade-in-up">
                <Image
                  width={14}
                  height={22}
                  src="/assets/img/fire.png"
                  alt=""
                />
                <h6 className="ar-subtitle text-white">{subtitle}</h6>
              </div>
              <div className="ar-title text-center lg:text-start mt-3 text-white animate-fade-in-up animation-delay-200">
                <h2>{title}</h2>
              </div>
            </div>

            <ul className="lg:mt-15 mt-12 animate-fade-in-up animation-delay-400">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className={`${
                    index === 0
                      ? "pb-8 border-b border-white"
                      : index === 1
                        ? "py-8 border-b border-white"
                        : "pt-8"
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-6 items-center justify-between group transition-all duration-500 hover:transform hover:translate-x-2 hover:bg-white/5 hover:rounded-lg p-4 hover:shadow-lg">
                    <div className="w-20.5 h-20.5 lg:w-27.5 lg:h-27.5 border border-dashed border-white rounded-full shrink-0 transition-all duration-500 group-hover:border-zPink group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
                      <Image
                        width={108}
                        height={108}
                        src={item.imgSrc}
                        alt={item.altText}
                        className="lg:h-full lg:w-full w-20 h-20 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                      />
                    </div>
                    <div className="flex-1 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 min-w-0">
                      <div className="flex-1 min-w-0 text-center md:text-start">
                        <div className="flex items-center gap-8 mb-3">
                          <h4 className="text-2xl lg:text-3xl font-primary whitespace-nowrap text-white transition-all duration-300 group-hover:text-zPink group-hover:scale-105">
                            {item.title}
                          </h4>
                          <div className="flex-1 hidden items-center justify-center transition-all duration-500">
                            <div className="flex-1 h-px bg-linear-to-r from-transparent via-white to-transparent group-hover:via-pink-300 transition-all duration-500"></div>
                          </div>
                        </div>
                        <p className="text-lg font-light text-white transition-all duration-300 group-hover:text-gray-200">
                          {item.description}
                        </p>
                        <div className="flex text-white justify-center md:justify-start items-center gap-1 mt-4 transition-all duration-300">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <i
                              key={i}
                              className="fa-solid fa-star transition-all duration-300 group-hover:text-yellow-400 group-hover:scale-110"
                              style={{
                                transitionDelay: `${i * 50}ms`,
                              }}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0 transition-all duration-300 group-hover:scale-105">
                        <h6 className="text-lg bg-zPink text-white py-2 px-5 whitespace-nowrap transition-all duration-300 group-hover:bg-zPink group-hover:shadow-lg group-hover:transform group-hover:-translate-y-1">
                          {item.price}
                        </h6>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:max-w-196 w-full md:w-4/5 animate-fade-in-up animation-delay-200">
            <div>
              <Image
                width={748}
                height={654}
                src="/assets/img/menu-banner.png"
                alt="banner"
                className="h-full aspect-[1.2] object-cover float-animation"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="animate-fade-in-up animation-delay-600">
            <Link href="/menu" className="ar-btn group mt-14 mx-auto">
              <span className="relative z-10 transition-all duration-500 group-hover:text-black">
                Explore All
              </span>
              <Image
                width={33}
                height={24}
                src="/assets/img/arrow.png"
                alt=""
                className="group-hover:invert z-10"
              />
              <span className="absolute top-0 left-0 w-0 h-full bg-white transition-all duration-500 group-hover:w-full z-0"></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
