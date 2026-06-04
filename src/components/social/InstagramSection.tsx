"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { request } from "@/lib/api";

interface Props {
  images?: string[];
  link?: string;
}

interface HomePageInsta {
  variant?: string;
  images?: string[];
  link?: string;
}

interface ApiResponse {
  insta?: HomePageInsta;
  data?: {
    insta?: HomePageInsta;
  };
}

const FALLBACK_IMAGES = [
  "/assets/img/insta-1.png",
  "/assets/img/insta-2.png",
  "/assets/img/insta-3.png",
  "/assets/img/insta-4.png",
  "/assets/img/insta-5.png",
  "/assets/img/insta-6.png",
];

const InstagramSection = ({
  images: propsImages,
  link: propsLink,
}: Props) => {
  const [images, setImages] = useState<string[] | undefined>(propsImages);
  const [link, setLink] = useState<string>(propsLink || "#");
  const [_isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If images are already provided via props and they have content, use them
    if (propsImages && propsImages.length > 0) {
      setImages(propsImages);
      if (propsLink) setLink(propsLink);
      setIsLoading(false);
      return;
    }

    // Fetch Instagram data from API
    const fetchInstagramData = async () => {
      try {
        const data = await request<ApiResponse>(
          `/pages/home`
        ).then((response: ApiResponse) => {
          // Handle both direct response and nested data structure
          return response?.insta || response?.data?.insta || null;
        });

        if (data?.images && data.images.length > 0) {
          setImages(data.images);
          if (data.link) setLink(data.link);
        } else {
          // Use fallback images if no images from API
          setImages(FALLBACK_IMAGES);
        }

        if (data?.link) {
          setLink(data.link);
        }
      } catch (error) {
        // Use fallback images on error
        console.warn("Failed to fetch Instagram data:", error);
        setImages(FALLBACK_IMAGES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstagramData();
  }, [propsImages, propsLink]);

  const imgs = (images || FALLBACK_IMAGES).slice(0, 6);

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 w-full relative">
      {imgs.map((img, idx) => (
        <div key={idx}>
          <Image
            src={img}
            alt={`Instagram post ${idx + 1}`}
            className="h-auto aspect-square w-full object-cover object-center"
            width={318}
            height={318}
            loading="lazy"
          />
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <div>
          <a
            href={link}
            aria-label="Visit our Instagram page"
            className="w-24 h-24 flex items-center justify-center bg-zPink/90 text-white rounded-full text-5xl transition hover:bg-zPink hover:scale-110 hover:shadow-lg hover:shadow-[#E2491A]/50"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default InstagramSection;
