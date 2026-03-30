"use client";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface Partner {
  icon: string;
  width: number;
  height: number;
}
interface Props {
  style?: string;
  partners?: Partner[];
}

const CompanySlider = ({ style, partners }: Props) => {
  const items = partners && partners.length ? partners : [];
  return (
    <Swiper
      className={`company-slider py-3 ${
        style === "style-2" ? "mt-8 xl:mt-10" : "mt-10 md:mt-13"
      } animate-fade-in-up animation-delay-200`}
      slidesPerView={6}
      spaceBetween={80}
      loop
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      speed={800}
      breakpoints={{
        0: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        480: {
          slidesPerView: 2.5,
          spaceBetween: 30,
        },
        576: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 50,
        },
        992: {
          slidesPerView: 5,
        },
        1400: {
          slidesPerView: 6,
          spaceBetween: 60,
        },
        1560: {
          spaceBetween: 80,
        },
      }}
      modules={[Autoplay]}
    >
      {items.map((item: any, idx: number) => (
        <SwiperSlide key={item.id ?? idx}>
          <div
            className={`relative my-2 flex items-center justify-center border border-black p-6 h-36 w-36 bg-white/50 transition-all duration-300 ease-in-out ${
              style === "style-2"
                ? "hover:border-zOrange"
                : "hover:border-zPink"
            } hover:scale-105 hover:bg-white hover:shadow-lg`}
          >
            <Image
              width={item.width}
              height={item.height}
              src={item.icon}
              alt="img"
              className="h-20 object-cover"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CompanySlider;
