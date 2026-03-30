"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getGallery, GalleryItem } from "@/services/gallery";

interface Props {
  variant?: boolean;
}

const GallerySection = ({ variant }: Props) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        const items = await getGallery({ isActive: true });
        setGalleryItems(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load gallery");
        console.error("Gallery fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  if (loading) {
    return (
      <section className="relative">
        <div className="ar-container py-20 lg:py-30">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-zPink border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && galleryItems.length === 0) {
    return (
      <section className="relative">
        <div className="ar-container py-20 lg:py-30">
          <div className="text-center">
            <p className="text-red-500">
              Failed to load gallery. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Fallback to empty array if no items
  const items = galleryItems.length > 0 ? galleryItems : [];

  return (
    <section className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url(/assets/img/hex-shapes.png)`,
          }}
        ></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-linear-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-linear-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="ar-container py-20 lg:py-30">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Image
              width={14}
              height={22}
              src="/assets/img/fire.png"
              alt="fire"
            />
            <h6 className="ar-subtitle">Photos Gallery</h6>
          </div>
          <h2 className="ar-title mt-3">Photos Best Gallery</h2>
        </div>
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 lg:mt-15">
          {items.slice(0, variant ? 3 : items.length).map((item, index) => (
            <div
              key={item._id}
              className={`relative group ${
                item.span ? "row-span-2" : "row-span-1"
              } rounded-2xl overflow-hidden shadow-2xl hover:shadow-pink-500/25 transition-all duration-500 transform hover:-translate-y-2`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.8s ease-out forwards",
              }}
            >
              {/* Image Container */}
              <div className="relative h-full overflow-hidden">
                <Image
                  width={item.width || 670}
                  height={item.height || 443}
                  src={item.img}
                  alt={item.title || "gallery"}
                  className="object-cover h-60 sm:h-72 md:h-80 bg-center lg:h-full w-full transition-all duration-700 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                {/* Glassmorphism Overlay */}
                <div className="absolute inset-0 backdrop-blur-sm bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>

              {/* Hover Content */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                {/* Details Button */}
                <div className="absolute right-4 top-4 transform -translate-y-5 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <div className="bg-zPink text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-pink-500/50 transition-all duration-300 backdrop-blur-sm bg-opacity-90">
                    <span className="font-medium">{item.category}</span>
                    <Image
                      width={20}
                      height={8}
                      src="/assets/img/right-arrow.png"
                      alt="arrow"
                      className="w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>

                {/* Content Card */}
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-5 group-hover:translate-y-0 transition-all duration-500 delay-200">
                  <div className="bg-zPink backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                    <h5 className="text-white text-xl font-bold mb-2 tracking-tight">
                      {item.title}
                    </h5>
                    <p className="text-white/90 text-sm font-medium leading-relaxed">
                      {item.desc}
                    </p>

                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-white/20 to-transparent rounded-bl-2xl"></div>
                  </div>
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            </div>
          ))}
        </div>
        {!variant && items.length > 0 && (
          <div>
            <a href="#" className="ar-btn mt-10 lg:mt-14 mx-auto group">
              <span className="relative z-10 transition-all duration-500 group-hover:text-black">
                Explore All
              </span>
              <Image
                width={33}
                height={24}
                src="/assets/img/arrow.png"
                alt="icon"
                className="group-hover:invert z-10"
              />
              <span className="absolute top-0 left-0 w-0 h-full bg-white transition-all duration-500 group-hover:w-full z-0"></span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
