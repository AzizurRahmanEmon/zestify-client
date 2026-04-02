"use client";
import CtaSection from "@/components/cta/CtaSection";
import { useCustomContext } from "@/context/context";
import Image from "next/image";
interface Props {
  variant?: boolean;
  subtitle?: string;
  title?: string;
  list?: string[];
  image1?: string;
  image2?: string;
  videoPoster?: string;
  videoUrl?: string;
  ctaLeftText?: string;
  ctaRightText?: string;
  ctaLeftBg?: string;
  ctaRightBg?: string;
}
const AboutSection = ({
  variant,
  subtitle = "About Our Food",
  title = "The best delicious food \n made from us...",
  list = ["SUPER QUALITY FOOD", "QUICK FAST DELIVERY", "WELL REPUTATION"],
  image1 = "/assets/img/about-1.png",
  image2 = "/assets/img/about-2.png",
  videoPoster = "/assets/img/about-video.jpeg",
  videoUrl,
  ctaLeftText,
  ctaRightText,
  ctaLeftBg,
  ctaRightBg,
}: Props) => {
  const { openVideoModal } = useCustomContext();
  const titleLines = title.split("\n");
  return (
    <section className={variant ? "" : "bg-[#F2F2F2]"}>
      <div className="ar-container relative">
        <div
          className={`flex flex-col lg:flex-row relative gap-32.5 lg:gap-10 items-center pt-20 lg:pt-30 ${
            variant ? "" : "pb-48 lg:pb-44 xl:pb-49"
          }`}
        >
          <div className="lg:w-1/2 xl:w-2/5 w-full sm:w-3/4 xl:mb-22.5 relative text-end animate-fade-in-up">
            <div>
              <Image
                width={549}
                height={678}
                src={image1}
                alt="Freshly prepared featured dish"
                className="w-4/5 mx-auto lg:mx-0 aspect-[0.81]"
              />
            </div>
            <div>
              <Image
                width={480}
                height={554}
                src={image2}
                alt="Chef plating a signature meal"
                className="z-10 absolute left-1/4 -bottom-22.5 w-[70%] aspect-[0.866] float-animation"
              />
            </div>
          </div>

          <div className="lg:flex-1 w-full overflow-hidden">
            <div className="flex flex-col overflow-hidden">
              <div className="flex items-center justify-center lg:justify-start gap-2 animate-fade-in-up animation-delay-200">
                <Image
                  width={14}
                  height={22}
                  src="/assets/img/fire.png"
                  alt=""
                />
                <h6 className="ar-subtitle">{subtitle}</h6>
              </div>
              <div className="ar-title text-center lg:text-start pb-5 mt-3 animate-fade-in-up animation-delay-400">
                <h3>
                  {titleLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < titleLines.length - 1 && <br />}
                    </span>
                  ))}
                </h3>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row border border-x-0 border-zPink justify-between items-center lg:items-start xl:items-center w-max xl:w-full mt-8 xl:mt-20 animate-fade-in-up animation-delay-600 py-5 mx-auto lg:mx-0">
              <ul className="flex flex-1 flex-col pb-5 xl:py-0 gap-6 mx-auto lg:mx-0 xl:pr-15 text-base xl:text-lg px-8">
                {list.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-center">
                    <i className="fa-solid fa-check text-zPink"></i>
                    <h6>{item}</h6>
                  </li>
                ))}
              </ul>
              <div className="xl:border-l xl:border-t-0 border-t border-zPink pt-5 xl:py-0 xl:pl-15 w-full xl:w-max px-8">
                <div className="relative">
                  <Image
                    width={224}
                    height={176}
                    src={videoPoster}
                    alt="Preview of Zestify story video"
                    className="h-44 w-56 xl:mx-0 mx-auto object-cover"
                  />
                  <button
                    type="button"
                    className="border border-white rounded-full text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center"
                    id="openAboutVideoModalButton"
                    onClick={() => openVideoModal(videoUrl)}
                    aria-label="Play about video"
                  >
                    <i className="fa-solid fa-play"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {!variant && (
          <CtaSection
            leftText={ctaLeftText}
            rightText={ctaRightText}
            leftBg={ctaLeftBg}
            rightBg={ctaRightBg}
          />
        )}
      </div>
    </section>
  );
};

export default AboutSection;
