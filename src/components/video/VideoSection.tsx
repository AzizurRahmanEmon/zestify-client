"use client";
import { useCustomContext } from "@/context/context";
interface Props {
  bgImg: string;
  videoUrl?: string;
}

const VideoSection = ({ bgImg, videoUrl }: Props) => {
  const { openVideoModal } = useCustomContext();
  return (
    <div
      className="relative min-h-170.75 bg-center bg-cover bg-no-repeat bg-fixed flex justify-center items-center overflow-hidden group"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Modern Overlay with Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/40 to-black/60 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/70 transition-all duration-700"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-zPink/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-zPink/5 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Play Button Container */}
      <div className="relative z-20 group/button">
        {/* Outer Ring - Pulsing Effect */}
        <div className="absolute inset-0 bg-white/20 rounded-full scale-100 animate-ping group-hover:animate-none"></div>
        <div className="absolute inset-0 bg-zPink/20 rounded-full scale-110 animate-pulse group-hover:scale-125 transition-transform duration-500"></div>

        {/* Middle Ring - Hover Effect */}
        <div className="absolute inset-0 bg-white/10 rounded-full scale-125 opacity-0 group-hover/button:opacity-100 group-hover/button:scale-150 transition-all duration-700"></div>

        {/* Main Button */}
        <button
          className="
            relative h-24 w-24 bg-white/95 backdrop-blur-sm rounded-full
            flex items-center justify-center
            transition-all duration-500 ease-out
            hover:bg-zPink hover:scale-110 hover:shadow-2xl
            hover:shadow-zPink/30
            group-hover/button:rotate-3
            border-2 border-white/20 hover:border-zPink/50
          "
          onClick={() => openVideoModal(videoUrl)}
          aria-label="Play video"
        >
          {/* Play Icon */}
          <div className="relative">
            <i className="fa-sharp fa-solid fa-play text-3xl text-zPink group-hover/button:text-white transition-colors duration-300 ml-1"></i>

            {/* Icon Shadow/Glow Effect */}
            <div className="absolute inset-0 text-3xl text-zPink opacity-0 group-hover/button:opacity-50 blur-sm transition-opacity duration-300">
              <i className="fa-sharp fa-solid fa-play ml-1"></i>
            </div>
          </div>
        </button>

        {/* Floating Particles */}
        <div className="absolute -top-2 -left-2 w-2 h-2 bg-white/60 rounded-full opacity-0 group-hover/button:opacity-100 group-hover/button:animate-bounce transition-opacity duration-300 delay-100"></div>
        <div className="absolute -bottom-2 -right-2 w-1.5 h-1.5 bg-zPink/60 rounded-full opacity-0 group-hover/button:opacity-100 group-hover/button:animate-bounce transition-opacity duration-300 delay-200"></div>
        <div className="absolute -top-3 right-0 w-1 h-1 bg-white/80 rounded-full opacity-0 group-hover/button:opacity-100 group-hover/button:animate-bounce transition-opacity duration-300 delay-300"></div>
      </div>

      {/* Modern Text Overlay (Optional) */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
        <p className="text-white/80 text-sm font-medium tracking-wide uppercase">
          Watch Our Story
        </p>
        <div className="w-12 h-0.5 bg-zPink mx-auto mt-2 scale-0 group-hover:scale-100 transition-transform duration-500 delay-300"></div>
      </div>

      {/* Corner Decorative Elements */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

export default VideoSection;
