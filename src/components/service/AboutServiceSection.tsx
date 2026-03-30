import ServiceCard from "./ServiceCard";

const services = [
  {
    id: 1,
    img: "/assets/img/about-icon-1.png",
    title: "Quality Foods",
    description:
      "Praesent rutrum ligula ligula, eget viverra neque congue sed.",
  },
  {
    id: 2,
    img: "/assets/img/about-icon-2.png",
    title: "Online Order",
    description:
      "Praesent rutrum ligula ligula, eget viverra neque congue sed.",
  },
  {
    id: 3,
    img: "/assets/img/about-icon-3.png",
    title: "Table Reservation",
    description:
      "Praesent rutrum ligula ligula, eget viverra neque congue sed.",
  },
  {
    id: 4,
    img: "/assets/img/about-icon-4.png",
    title: "Expert Chef",
    description:
      "Praesent rutrum ligula ligula, eget viverra neque congue sed.",
  },
];

const AboutServiceSection = () => {
  return (
    <div className="ar-container">
      <ul className="grid grid-cols-1 xs:w-4/5 xs:mx-auto sm:grid-cols-2 sm:w-full xl:grid-cols-4 gap-8 py-20 lg:py-30">
        {services.map((service) => (
          <li key={service.id}>
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
