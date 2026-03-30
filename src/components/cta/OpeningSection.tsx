"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: Date): CountdownTime => {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds };
};

const OpeningSection: React.FC = () => {
  const targetDate = new Date("2025-12-31T23:59:59");
  const [timeLeft, setTimeLeft] = useState<CountdownTime | null>(null);
  const [prevTimeLeft, setPrevTimeLeft] = useState<CountdownTime | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    const initialTime = calculateTimeLeft(targetDate);
    setTimeLeft(initialTime);
    setPrevTimeLeft(initialTime);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = calculateTimeLeft(targetDate);
        setPrevTimeLeft(prevTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isMounted || !timeLeft) {
    return null;
  }

  const CountdownItem = ({
    value,
    label,
    prevValue,
    showSeparator = true,
  }: {
    value: number;
    label: string;
    prevValue?: number;
    showSeparator?: boolean;
  }) => {
    const hasChanged = prevValue !== undefined && prevValue !== value;

    return (
      <li className="relative group">
        <div className="relative">
          <div className="absolute -inset-4 bg-linear-to-br from-orange-500/20 via-red-500/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

          <div className="relative bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-500 group-hover:bg-black/40 group-hover:border-white/20 group-hover:shadow-2xl group-hover:scale-105">
            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-orange-500/50 via-red-500/50 to-orange-500/50 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm -z-10"></div>

            <div className="relative overflow-hidden">
              <div
                className={`font-primary text-6xl text-white font-bold transition-all duration-500 ${
                  hasChanged ? "animate-pulse" : ""
                }`}
              >
                <span className="relative inline-block">
                  {String(value).padStart(2, "0")}
                  {hasChanged && (
                    <div className="absolute inset-0 bg-linear-to-t from-orange-500/30 to-transparent animate-ping"></div>
                  )}
                </span>
              </div>
            </div>

            <div className="mt-2 text-white/80 text-sm font-medium uppercase tracking-wider">
              {label}
            </div>

            <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full opacity-50 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-red-500 rounded-full opacity-30 group-hover:opacity-70 transition-all duration-500"></div>
          </div>
        </div>

        {showSeparator && (
          <div className="absolute -right-10  top-1/2 -translate-y-1/2 hidden md:block md:-right-6">
            <div className="flex flex-col gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>
        )}
      </li>
    );
  };
  return (
    <section
      className="bg-no-repeat bg-cover relative overflow-hidden"
      style={{
        backgroundImage: `url(/assets/img/coffee-cta-bg.png)`,
      }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/40 to-black/60"></div>
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-500/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="ar-container py-20 xl:py-30 relative z-10">
        <div>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="block w-15.25 h-0.75 coffee-gradient rounded-full relative overflow-hidden">
              <span className="absolute inset-0 bg-white/30 -translate-x-full animate-pulse"></span>
            </span>
            <h6 className="ar-subtitle text-white relative animate-fade-in-up">
              Opening Hours
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
            </h6>
          </div>

          <h3 className="ar-title text-center text-white mt-3 relative animate-fade-in-up animation-delay-200">
            <span className="relative z-10">Hot deal grab soon</span>
          </h3>
        </div>

        <div>
          <p className="max-w-162.5 mx-auto mt-5 text-white/90 md:text-lg text-center leading-relaxed animate-fade-in-up animation-delay-400">
            Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.
            Pellentesque in ipsum id orci porta dapibus. Pellentesque orci porta
            dapibus.
          </p>

          <ul className="flex items-center flex-wrap justify-center gap-10 mt-16 animate-fade-in-up animation-delay-600">
            <CountdownItem
              value={timeLeft.days}
              label="Days"
              {...(prevTimeLeft?.days !== undefined && {
                prevValue: prevTimeLeft.days,
              })}
            />
            <CountdownItem
              value={timeLeft.hours}
              label="Hours"
              {...(prevTimeLeft?.hours !== undefined && {
                prevValue: prevTimeLeft.hours,
              })}
            />
            <CountdownItem
              value={timeLeft.minutes}
              label="Minutes"
              {...(prevTimeLeft?.minutes !== undefined && {
                prevValue: prevTimeLeft.minutes,
              })}
            />
            <CountdownItem
              value={timeLeft.seconds}
              label="Seconds"
              {...(prevTimeLeft?.seconds !== undefined && {
                prevValue: prevTimeLeft.seconds,
              })}
              showSeparator={false}
            />
          </ul>

          <div className="mt-10 xl:mt-12 2xl:mt-14 w-max mx-auto animate-fade-in-up animation-delay-800">
            <Link
              href="/menu"
              className="bg-transparent group relative inline-flex items-center gap-3 px-8 py-4 text-white font-semibold text-lg transition-all duration-500"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="tracking-wide">Explore All</span>
                <div className="relative flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full transition-all duration-500 group-hover:bg-white/30 group-hover:rotate-45 group-hover:scale-110 group-hover:ml-2">
                  <svg
                    className="w-5 h-5 text-white transform transition-all duration-300 group-hover:translate-x-0.5 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>

                  <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
              </span>
              <div className="absolute left-0 top-0 coffee-gradient w-full h-full rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpeningSection;
