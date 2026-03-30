"use client";
import HomeReservationForm from "@/components/form/HomeReservationForm";
import Image from "next/image";

interface Props {
  title?: string;
  subtitle?: string;
  bgImg?: string;
  contactInfo?: Array<{
    id: number;
    icon: string;
    iconWidth: number;
    iconHeight: number;
    title: string;
    content: string;
    isLink?: boolean;
    href?: string;
  }>;
  businessHours?: Array<{
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
}

const ReservationSection = ({
  title = "Reservation Table & \n Enjoy Dining Table",
  subtitle = "Get in Touch",
  bgImg = "/assets/img/reservation-bg.png",
  contactInfo,
  businessHours,
}: Props) => {
  const dayIndex = new Date().getDay();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayName = dayNames[dayIndex];
  const normalize = (s: string) => s.trim().toLowerCase();

  const todayHours =
    Array.isArray(businessHours) && businessHours.length
      ? businessHours.find(
          (d) =>
            normalize(d.day).startsWith(normalize(todayName)) ||
            normalize(todayName).startsWith(normalize(d.day)),
        )
      : undefined;

  const todayHoursText = todayHours
    ? todayHours.isClosed
      ? "Closed Today"
      : `${todayHours.open} - ${todayHours.close}`
    : "Closed Today";

  const defaults = [
    {
      id: 1,
      icon: "/assets/img/mobile.png",
      iconWidth: 19,
      iconHeight: 31,
      title: "Phone Number",
      content: "+88 (9800) 6802",
      isLink: true,
      href: "tel:+88(9800)6802",
    },
    {
      id: 2,
      icon: "/assets/img/envelope.png",
      iconWidth: 26,
      iconHeight: 18,
      title: "Email Address",
      content: "info@exale.com",
      isLink: true,
      href: "mailto:info@exale.com",
    },
    {
      id: 3,
      icon: "/assets/img/location.png",
      iconWidth: 18,
      iconHeight: 28,
      title: "Location",
      content: "Dhaka Bangladesh",
      isLink: false,
    },
    {
      id: 5,
      icon: "/assets/img/mobile.png",
      iconWidth: 19,
      iconHeight: 31,
      title: "Work Hours",
      content: todayHoursText, // ← already resolved to today's string
      isLink: false,
    },
  ];

  // If contactInfo is passed, override Work Hours entry with today's resolved value
  const info = (() => {
    if (!contactInfo || !contactInfo.length) return defaults;

    return contactInfo.map((item) => {
      if (item.title === "Work Hours") {
        return { ...item, content: todayHoursText };
      }
      return item;
    });
  })();

  return (
    <section
      className="bg-no-repeat bg-cover relative"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="ar-container overflow-hidden">
        <div className="flex flex-col xl:flex-row py-20 lg:py-30 gap-10 justify-between">
          <div className="w-full xl:w-1/2 xl:max-w-148.5">
            <div className="flex flex-col overflow-hidden">
              <div className="flex items-center justify-center xl:justify-start gap-2 animate-fade-in-up">
                <Image
                  width={14}
                  height={22}
                  src="/assets/img/fire.png"
                  alt="fire"
                />
                <h6 className="ar-subtitle text-white">{subtitle}</h6>
              </div>
              <div className="animate-fade-in-up animation-delay-200">
                <h2 className="ar-title mt-3 text-white text-center xl:text-start">
                  {title.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < title.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:gap-10 mt-12 xl:mt-15 animate-fade-in-up animation-delay-400 mx-auto lg:w-4/5 xl:w-full">
              {info.map((item) => (
                <div
                  key={item.id}
                  className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 group px-2"
                >
                  <div
                    className="flex gap-5 bg-cover bg-no-repeat items-center py-3 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#87081F]/20"
                    style={{
                      backgroundImage: `url(/assets/img/contact-shape.png)`,
                    }}
                  >
                    <div className="border-2 rounded-full border-zPink bg-white w-14 h-14 inline-flex items-center justify-center relative transition-all duration-300 group-hover:border-zPink group-hover:scale-110">
                      <Image
                        width={item.iconWidth}
                        height={item.iconHeight}
                        src={item.icon}
                        alt="icon"
                      />
                    </div>
                    <div className="text-white text-base">
                      <p className="transition-colors duration-300">
                        {item.title}
                      </p>
                      {item.isLink ? (
                        <a
                          href={item.href}
                          className="text-white font-semibold mt-2 transition-all duration-300 hover:underline"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-white max-w-34.5 text-ellipsis overflow-hidden whitespace-nowrap font-semibold mt-2 transition-colors duration-300">
                          {item.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full xl:w-1/2 max-w-167.5 mx-auto animate-fade-in-up animation-delay-400">
            <HomeReservationForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
