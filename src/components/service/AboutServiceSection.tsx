import ServiceCard from "./ServiceCard";
import { getServices } from "@/services/services";

const AboutServiceSection = async () => {
  const services = await getServices({ isActive: true, limit: 4 });

  return (
    <div className="ar-container">
      <ul className="grid grid-cols-1 xs:w-4/5 xs:mx-auto sm:grid-cols-2 sm:w-full xl:grid-cols-4 gap-8 py-20 lg:py-30">
        {services.slice(0, 4).map((service) => (
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
  );
};

export default AboutServiceSection;
