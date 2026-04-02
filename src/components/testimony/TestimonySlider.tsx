"use client";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";

interface Testimonial {
  testimony: string;
  img: string;
  name: string;
  position: string;
  rating?: number;
}

const TestimonySlider = ({ items }: { items?: Testimonial[] }) => {
  const slides = items && items.length ? items : [];
  return (
    <Swiper
      className="testimony-slider h-157.5"
      direction="vertical"
      slidesPerView={1.5}
      spaceBetween={20}
      loop
      speed={25000}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
    >
      {slides.map((item: any, idx: number) => (
        <SwiperSlide key={item.id ?? idx}>
          <div className="bg-[#F2F2F2] px-8 py-9 max-w-70.5">
            <div className="flex items-center gap-1 text-[#F5C536]">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <p className="mt-5 text-[#1E2330] text-[15px] leading-6 font-light">
              "{item.testimony}
            </p>
            <div className="flex items-center gap-5 mt-7">
              <div className="w-13 h-13 rounded-full relative">
                <Image
                  width={52}
                  height={52}
                  src={item.img}
                  alt={item.name}
                  className="h-full w-full rounded-full object-cover object-top"
                />
              </div>
              <div className="font-normal text-[#1E2330]">
                <h5 className="text-lg">{item.name}</h5>
                <p className="text-base">{item.position}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default TestimonySlider;
