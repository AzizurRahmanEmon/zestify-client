"use client";
import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import Image from "next/image";
import { getServices, Service } from "@/services/services";
import Link from "next/link";

const ServiceSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const items = await getServices({ isActive: true });
        setServices(items);
      } catch (err) {
        console.error("Services fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  if (loading) {
    return (
      <section
        className="bg-no-repeat"
        style={{
          backgroundImage: `url(/assets/img/hex-shapes.png)`,
        }}
      >
        <div className="ar-container pb-20 lg:pb-30">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-zPink border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const items = services.length > 0 ? services : [];

  return (
    <section
      className="bg-no-repeat"
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container pb-20 lg:pb-30">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center md:justify-between">
          <div>
            <div className="flex items-center md:justify-start justify-center gap-2">
              <span className="block w-15.25 h-0.75 bg-zPink"></span>
              <h6 className="ar-subtitle">Our Services</h6>
            </div>
            <h3 className="ar-title text-center md:text-start mt-3">
              Our Best Services
            </h3>
          </div>
          <Link href="/services" className="ar-btn group mx-auto md:mx-0">
            <span className="relative z-10 transition-all duration-500 group-hover:text-black">
              View more
            </span>
            <Image
              width={33}
              height={24}
              src="/assets/img/arrow.png"
              alt="icon"
              className="group-hover:invert z-10"
            />
            <span className="absolute top-0 left-0 w-0 h-full bg-white transition-all duration-500 group-hover:w-full z-0"></span>
          </Link>
        </div>
        <div>
          <ul className="grid grid-cols-1 xs:w-4/5 xs:mx-auto sm:grid-cols-2 sm:w-full xl:grid-cols-4 gap-8 mt-10 lg:mt-15">
            {items.map((service) => (
              <li key={service._id}>
                <ServiceCard
                  img={service.img}
                  title={service.title}
                  description={service.description}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
