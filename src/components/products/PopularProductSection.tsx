"use client";
import Link from "next/link";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import type { ProductDataType } from "@/types";

interface Props {
  products?: ProductDataType[];
  title?: string;
  subtitle?: string;
}

const PopularProductSection = ({
  products,
  title = "Popular Food Items",
  subtitle = "Crispy every bite taste",
}: Props) => {
  const items = (products || []).slice(0, 8);
  return (
    <section
      className="bg-no-repeat xl:bg-cover bg-contain"
      style={{
        backgroundImage: `url(/assets/img/shape-bg.png)`,
      }}
    >
      <div className="ar-container overflow-hidden">
        <div className="py-20 lg:py-30">
          <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 animate-fade-in-up">
                <Image
                  width={14}
                  height={22}
                  src="/assets/img/fire.png"
                  alt=""
                />
                <h6 className="ar-subtitle">{subtitle}</h6>
              </div>
              <div className="animate-fade-in-up animation-delay-200">
                <h2 className="ar-title text-center md:text-start mt-3">
                  {title}
                </h2>
              </div>
            </div>

            <div className="flex gap-2 items-center animate-fade-in-up animation-delay-200">
              <button
                type="button"
                aria-label="Previous popular items"
                className="item-prev flex w-14 h-14 items-center justify-center border border-solid border-zPink text-zPink rounded-lg text-2xl bg-white hover:bg-zPink hover:text-white transition"
              >
                <i className="fa-sharp fa-regular fa-arrow-left"></i>
              </button>
              <button
                type="button"
                aria-label="Next popular items"
                className="item-next flex w-14 h-14 items-center justify-center border border-solid border-zPink text-zPink rounded-lg text-2xl bg-white hover:bg-zPink hover:text-white transition"
              >
                <i className="fa-sharp fa-regular fa-arrow-right"></i>
              </button>
            </div>
          </div>
          <div className="mt-9 lg:mt-12 animate-fade-in-up animation-delay-400">
            <div>
              <Swiper
                className="popular-item-slider"
                slidesPerView={4}
                spaceBetween={30}
                navigation={{
                  nextEl: ".item-next",
                  prevEl: ".item-prev",
                }}
                loop
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    initialSlide: 3,
                  },
                  481: {
                    slidesPerView: 1.4,
                    spaceBetween: 30,
                    initialSlide: 3,
                  },
                  577: {
                    slidesPerView: 1.7,
                    spaceBetween: 40,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                  },
                  1024: {
                    slidesPerView: 2.8,
                  },
                  1280: {
                    slidesPerView: 3,
                  },
                  1400: {
                    slidesPerView: 4,
                  },
                }}
                modules={[Navigation]}
              >
                {items.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="group my-3 relative bg-[#323232] px-9 pt-6 pb-8 rounded-xl overflow-hidden transition-all duration-500 ease-out hover:bg-zPink hover:shadow-2xl hover:shadow-zPink/20 hover:-translate-y-2 hover:scale-[1.02]">
                      <div className="flex items-center justify-center gap-1 text-white">
                        <i className="fa-solid fa-star text-starFilled group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 delay-75"></i>
                        <i className="fa-solid fa-star text-starFilled group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 delay-100"></i>
                        <i className="fa-solid fa-star text-starFilled group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 delay-125"></i>
                        <i className="fa-solid fa-star text-starFilled group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 delay-150"></i>
                        <i className="fa-solid fa-star group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 delay-200"></i>
                      </div>

                      <div className="relative mt-8 z-10">
                        <Image
                          width={224}
                          height={224}
                          src={item.image}
                          alt="product"
                          className="m-auto w-56 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 ease-out filter group-hover:brightness-110 group-hover:drop-shadow-2xl"
                        />
                        <Image
                          width={249}
                          height={23}
                          src="/assets/img/line.png"
                          alt="line"
                          className="absolute -bottom-12.5 left-1/2 -translate-x-1/2 group-hover:scale-110 transition-all duration-500 delay-200"
                        />
                      </div>

                      <Image
                        width={61}
                        height={65}
                        src="/assets/img/beans.png"
                        alt="beans"
                        className="absolute right-0 top-7 z-3 group-hover:translate-x-2 group-hover:-translate-y-1 group-hover:rotate-12 transition-all duration-700 ease-out opacity-60 group-hover:opacity-100"
                      />
                      <Image
                        width={250}
                        height={247}
                        src="/assets/img/round-bg.png"
                        alt="bg-shape"
                        className="absolute top-12.5 left-1/2 -translate-x-1/2 z-2 group-hover:scale-105 group-hover:rotate-6 transition-all duration-1000 ease-out opacity-80 group-hover:opacity-100"
                      />

                      <Link
                        href={`/shop/${item.slug}`}
                        className="block text-2xl md:text-[26px] w-full text-center font-primary text-white leading-snug mt-21.25 font-normal group-hover:text-white group-hover:scale-105 group-hover:tracking-wide transition-all duration-500 ease-out relative overflow-hidden"
                      >
                        <span className="relative z-10">
                          Only{" "}
                          <span className="font-semibold text-zPink group-hover:text-white transition-colors duration-300">
                            ${item.price}
                          </span>
                          <br />
                          <span className="group-hover:drop-shadow-lg transition-all duration-300">
                            {item.name}.
                          </span>
                        </span>
                      </Link>

                      <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                      <div className="absolute inset-0 rounded-xl bg-linear-to-r from-zPink/0 via-zPink/5 to-zPink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularProductSection;
