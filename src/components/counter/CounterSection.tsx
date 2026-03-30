"use client";
import { useState, useEffect, useRef } from "react";

const CounterSection = () => {
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const counterData = [
    { id: 1, number: 1567, label: "New Cool Projects" },
    { id: 2, number: 634, label: "Total Awards Win" },
    { id: 3, number: 1520, label: "Unique Specialities" },
    { id: 4, number: 1235, label: "Hard Team Members" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Fix: Check if entries array has elements and get the first entry
        const entry = entries[0];
        if (entry && entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 },
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    counterData.forEach((item, index) => {
      let start = 0;
      const end = item.number;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }

        setCounters((prev) => {
          const newCounters = [...prev];
          newCounters[index] = Math.floor(start);
          return newCounters;
        });
      }, 16);
    });
  };

  return (
    <section
      ref={sectionRef}
      className="xl:py-30 py-20 bg-linear-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 grid-cols-1 animate-fade-in-up animation-delay-200">
          {counterData.map((item, index) => (
            <li
              key={item.id}
              className="group relative text-center transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-linear-to-br from-orange-100 to-red-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

              {index < 3 && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-20 bg-linear-to-b from-transparent via-orange-300 to-transparent hidden lg:block"></div>
              )}

              <div className="py-4 px-3 md:py-8 md:px-6 2xl:py-10 2xl:px-8 relative z-10">
                <h4 className="font-bold text-6xl lg:text-5xl 2xl:text-6xl text-gray-900 mb-3 font-primary tracking-wide">
                  <span className="bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {(counters[index] ?? 0).toLocaleString()}
                  </span>
                  <span className="text-orange-500 animate-pulse">+</span>
                </h4>

                <p className="text-xl text-gray-600 font-medium leading-relaxed">
                  {item.label}
                </p>

                <div className="mt-4 mx-auto w-12 h-1 bg-linear-to-r from-orange-400 to-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CounterSection;
