import Image from "next/image";
import type { ProductDataType } from "@/types";

interface Props {
  coffeeTitle?: string;
  coffeeSubtitle?: string;
  grillTitle?: string;
  grillSubtitle?: string;
  coffeeProducts?: ProductDataType[];
  grillProducts?: ProductDataType[];
  coffeeImage?: string;
  grillImage?: string;
}

const MenuSection2 = ({
  coffeeTitle = "Coffee Menu",
  coffeeSubtitle = "Crafted with precision and passion",
  grillTitle = "Grill Food",
  grillSubtitle = "Flame-grilled to perfection",
  coffeeProducts,
  grillProducts,
  coffeeImage = "/assets/img/coffee-menu-banner.png",
  grillImage = "/assets/img/grill-menu-banner.png",
}: Props) => {
  const formatPrice = (value: number) => value.toFixed(2);
  const coffeeDisplay = (coffeeProducts || []).map((p, i) => ({
    id: p.slug,
    image: p.image,
    name: p.name,
    description: p.description || "",
    price: `$${formatPrice(p.price ?? 0)}`,
    _order: i,
  }));
  const grillDisplay = (grillProducts || []).map((p, i) => ({
    id: p.slug,
    image: p.image,
    name: p.name,
    description: p.description || "",
    price: `$${formatPrice(p.price ?? 0)}`,
    _order: i,
  }));
  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url(/assets/img/hex-shapes.png)`,
          }}
        ></div>
      </div>

      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-20 w-96 h-96 bg-linear-to-r from-pink-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-linear-to-r from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 ar-container py-20 lg:py-30">
        <div className="flex flex-col-reverse lg:justify-between lg:flex-row gap-12 lg:gap-16 overflow-hidden">
          {/* Coffee Menu */}
          <div className="lg:flex-1">
            <div className="text-center lg:text-start">
              <h4 className="ar-title text-4xl xl:text-5xl font-bold text-gray-900 mb-4 relative">
                {coffeeTitle}
                <div className="absolute -bottom-2 left-1/2 lg:left-0 lg:translate-x-0 transform -translate-x-1/2 w-16 h-1 bg-linear-to-r from-zPink/60 to-zPink rounded-full"></div>
              </h4>
              <p className="text-gray-600 text-lg">{coffeeSubtitle}</p>
            </div>

            <div className="space-y-6 pt-8">
              {coffeeDisplay.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border border-gray-200/50 hover:border-pink-300/50"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: "fadeInLeft 0.8s ease-out forwards",
                  }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Image Container */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden relative transition-all duration-500 group-hover:scale-110 shadow-lg group-hover:shadow-xl">
                        <div className="absolute inset-0 bg-linear-to-br from-zPink/60/30 to-purple-400/30 rounded-full scale-0 group-hover:scale-100 transition-all duration-500"></div>
                        <Image
                          width={96}
                          height={96}
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-full transition-all duration-500 group-hover:brightness-110"
                        />
                      </div>

                      {/* Floating Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-zPink/60/50 scale-150 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center flex-col sm:flex-row sm:w-full gap-3 justify-center text-center sm:text-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            {item.description}
                          </p>

                          {/* Star Rating */}
                          <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i
                                key={star}
                                className="fa-solid fa-star text-yellow-400 text-sm transition-all duration-300 hover:scale-125 hover:text-yellow-500"
                                style={{
                                  animationDelay: `${star * 0.1}s`,
                                }}
                              ></i>
                            ))}
                          </div>
                        </div>

                        {/* Price Tag */}
                        <div className="relative">
                          <div className="bg-linear-to-r from-zPink/60 to-zPink text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                            {item.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Shine Effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-3xl"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Coffee Banner */}
          <div className="flex items-center justify-center relative w-4/5 lg:w-2/5 lg:mx-0 mx-auto">
            <div className="relative group w-full">
              <div className="absolute inset-0 bg-linear-to-br from-pink-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                <Image
                  width={646}
                  height={595}
                  src={coffeeImage}
                  alt="Coffee banner"
                  className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12 lg:gap-16 mt-12 lg:mt-16 overflow-hidden">
          {/* Grill Banner */}
          <div className="flex items-center justify-center relative w-4/5 lg:w-2/5 mx-auto lg:mx-0">
            <div className="relative group w-full">
              <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-red-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                <Image
                  width={646}
                  height={595}
                  src={grillImage}
                  alt="Grill banner"
                  className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Grill Menu */}
          <div className="lg:flex-1">
            <div className="text-center lg:text-start">
              <h4 className="ar-title text-4xl xl:text-5xl font-bold text-gray-900 mb-4 relative">
                {grillTitle}
                <div className="absolute -bottom-2 left-1/2 lg:left-0 lg:translate-x-0 transform -translate-x-1/2 w-16 h-1 bg-linear-to-r from-orange-500 to-red-500 rounded-full"></div>
              </h4>
              <p className="text-gray-600 text-lg">{grillSubtitle}</p>
            </div>

            <div className="space-y-6 overflow-hidden pt-8">
              {grillDisplay.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border border-gray-200/50 hover:border-orange-300/50"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: "fadeInRight 0.8s ease-out forwards",
                  }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Image Container */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden relative transition-all duration-500 group-hover:scale-110 shadow-lg group-hover:shadow-xl">
                        <div className="absolute inset-0 bg-linear-to-br from-orange-400/30 to-red-400/30 rounded-full scale-0 group-hover:scale-100 transition-all duration-500"></div>
                        <Image
                          width={96}
                          height={96}
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-full transition-all duration-500 group-hover:brightness-110"
                        />
                      </div>

                      {/* Floating Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-orange-400/50 scale-150 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center flex-col sm:flex-row sm:w-full gap-3 justify-center text-center sm:text-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            {item.description}
                          </p>

                          {/* Star Rating */}
                          <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i
                                key={star}
                                className="fa-solid fa-star text-yellow-400 text-sm transition-all duration-300 hover:scale-125 hover:text-yellow-500"
                                style={{
                                  animationDelay: `${star * 0.1}s`,
                                }}
                              ></i>
                            ))}
                          </div>
                        </div>

                        {/* Price Tag */}
                        <div className="relative">
                          <div className="bg-linear-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                            {item.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Shine Effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-3xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection2;
