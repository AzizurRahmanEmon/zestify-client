"use client";
import Image from "next/image";
import { useCustomContext } from "@/context/context";
import Link from "next/link";
import type { ProductDataType } from "@/types";

interface Props {
  title?: string;
  subtitle?: string;
  products?: ProductDataType[];
}

const BestSellingProductSection = ({
  title = "Best Selling Dishes",
  subtitle = "Crispy every bite taste",
  products,
}: Props) => {
  const { addToCart } = useCustomContext();
  const items = (products || []).slice(0, 4);
  const formatPrice = (value: number) => value.toFixed(2);
  return (
    <section
      className="overflow-hidden"
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container">
        <div className="xl:pt-49 lg:pt-44 lg:pb-30 pb-20 pt-48">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 animate-fade-in-up">
              <Image
                width={14}
                height={22}
                src="/assets/img/fire.png"
                alt="fire"
              />
              <h6 className="ar-subtitle">{subtitle}</h6>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <h2 className="ar-title mt-3">{title}</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mt-12 lg:mt-15 animate-fade-in-up animation-delay-400 w-full sm:w-[70%] md:w-full sm:mx-auto">
            {items.slice(0, 4).map((dish, index) => (
              <div key={index}>
                <div
                  className={`px-10 py-8.75 transition-all duration-500 rounded-lg border border-zPink bg-white group hover:bg-zPink`}
                >
                  <div className="h-52.5 relative">
                    <Image
                      width={224}
                      height={210}
                      src={dish.image}
                      alt="img"
                      className="m-auto h-full w-56 transition-transform duration-500 group-hover:rotate-6"
                    />
                  </div>
                  <div className="relative mt-10">
                    <div className="h-px w-full bg-zPink opacity-30 group-hover:bg-white transition-colors duration-500"></div>
                    <div className="absolute h-px bg-zPink w-2/3 left-1/2 transform -translate-x-1/2 bottom-0 group-hover:bg-white transition-colors duration-500"></div>
                  </div>

                  <div className="flex items-center justify-center text-zPink mt-7 text-xl gap-1 group-hover:text-white transition-colors duration-500">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <Link
                    href={`/shop/${dish.slug}`}
                    className="md:text-3xl text-2xl block font-primary text-textColor text-center mt-5 group-hover:text-white transition-colors duration-500"
                  >
                    {dish.name}
                  </Link>
                  <p className="text-pTextColor text-lg text-center mt-3 group-hover:text-white transition-colors duration-500">
                    <span className="line-through pr-1">
                      {formatPrice((dish.price ?? 0) + 10)}
                      {"$ "}
                    </span>
                    {formatPrice(dish.price ?? 0)}$
                  </p>
                  <button
                    type="button"
                    aria-label={`Add ${dish.name} to cart`}
                    className="ar-btn mx-auto mt-8"
                    onClick={() => addToCart(dish as any)}
                  >
                    <Image
                      width={25}
                      height={17}
                      src="/assets/img/scooter.png"
                      alt="icon"
                      className="group-hover:invert z-10 transition-filter duration-500"
                    />
                    <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                      Add To Cart
                    </span>
                    <span className="absolute top-0 left-0 w-0 h-full bg-white transition-all duration-500 group-hover:w-full z-0"></span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellingProductSection;
