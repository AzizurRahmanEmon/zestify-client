import Image from "next/image";
import TestimonySlider from "./TestimonySlider";

interface Testimonial {
  testimony: string;
  img: string;
  name: string;
  position: string;
  rating?: number;
}
interface Props {
  title?: string;
  subtitle?: string;
  items?: Testimonial[];
}

const TestimonySection = ({
  title = "Hear from those we've served.",
  subtitle = "Our Testimonials",
  items,
}: Props) => {
  return (
    <section
      className="py-20 lg:py-30"
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container">
        <div className="flex flex-col gap-8 xl:flex-row overflow-hidden justify-between">
          <div className="text-textColor mx-auto xl:mx-0 max-w-105 2xl:max-w-92.5 xl:w-2/5 flex flex-col overflow-hidden">
            <div className="flex items-center justify-center xl:justify-start gap-2 xl:mt-25 animate-fade-in-up0">
              <Image
                width={14}
                height={22}
                src="/assets/img/fire.png"
                alt="fire"
              />
              <h6 className="ar-subtitle">{subtitle}</h6>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <h2 className="ar-title mt-3 text-center xl:text-start">
                {title}
              </h2>
            </div>
          </div>

          <div className="flex gap-7.5 justify-center lg:justify-between overflow-hidden animate-fade-in-up animation-delay-200">
            <div className="shrink-0 pt-25 hidden md:block">
              <TestimonySlider items={items} />
            </div>
            <div className="shrink-0">
              <TestimonySlider items={items} />
            </div>
            <div className="shrink-0 pt-25 hidden lg:block xl:hidden 2xl:block">
              <TestimonySlider items={items} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonySection;
