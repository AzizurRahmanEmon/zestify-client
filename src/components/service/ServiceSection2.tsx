"use client";
import { useEffect, useState } from "react";
import { getServices, Service } from "@/services/services";
import ServiceCard from "./ServiceCard";

const ServiceSection2 = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const items = await getServices({ isActive: true });
        setServices(items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load services",
        );
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
        <div className="ar-container py-20 lg:py-30">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-zPink border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && services.length === 0) {
    return (
      <section
        className="bg-no-repeat"
        style={{
          backgroundImage: `url(/assets/img/hex-shapes.png)`,
        }}
      >
        <div className="ar-container py-20 lg:py-30">
          <div className="text-center">
            <p className="text-red-500">
              Failed to load services. Please try again later.
            </p>
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
      <div className="ar-container py-20 lg:py-30">
        <div>
          <div className="flex items-center gap-2 justify-center">
            <span className="block w-15.25 h-0.75 bg-zPink"></span>
            <h6 className="ar-subtitle">Our Services</h6>
          </div>
          <h3 className="ar-title text-center mt-3">Our Best Services</h3>
        </div>

        <div>
          <ul className="grid grid-cols-1 xs:w-4/5 xs:mx-auto sm:grid-cols-2 sm:w-full xl:grid-cols-4 gap-8 lg:mt-15 mt-10">
            {items.map((service) => (
              <li key={service._id} className="">
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

export default ServiceSection2;
