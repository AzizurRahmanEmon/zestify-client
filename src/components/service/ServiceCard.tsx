import Image from "next/image";

interface Props {
  img: string;
  title: string;
  description: string;
}

const ServiceCard = ({ img, title, description }: Props) => {
  return (
    <div className="group relative bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl px-8 py-10 flex flex-col justify-center items-center text-center rounded-3xl border border-gray-100/50 hover:border-zPink/30 transition-all duration-500 hover:-translate-y-3 overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-zPink/5 via-white to-zPink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Floating Background Elements */}
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-linear-to-br from-zPink/15 to-zPink/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-linear-to-br from-zPink/20 to-zPink/15 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>

      {/* Main Image Container */}
      <div className="relative mb-6">
        {/* Main Image */}
        <div className="relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
          <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-zPink/10 to-zPink/5 p-4 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:shadow-zPink/20">
            <Image
              width={108}
              height={94}
              src={img}
              alt={title}
              className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-500"
            />
          </div>

          {/* Floating Ring Effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-zPink/30 scale-0 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h5 className="text-2xl xl:text-[22px] 2xl:text-2xl font-bold text-gray-800 group-hover:text-zPink transition-colors duration-300 mb-4">
          {title}
        </h5>
        <p className="text-gray-600 leading-relaxed font-medium group-hover:text-gray-700 transition-colors duration-300 max-w-xs">
          {description}
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-6 right-6">
        <div className="w-3 h-3 bg-zPink rounded-full opacity-30 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
      </div>
      <div className="absolute bottom-6 left-6">
        <div className="w-2 h-2 bg-zPink rounded-full opacity-30 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-3xl"></div>
    </div>
  );
};

export default ServiceCard;
