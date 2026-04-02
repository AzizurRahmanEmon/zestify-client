import dynamic from "next/dynamic";

const CompanySlider = dynamic(() => import("./CompanySlider"));
interface Partner {
  icon: string;
  width: number;
  height: number;
}
interface Props {
  paddingTop?: boolean;
  title?: string;
  partners?: Partner[];
}
const CompanySection = ({
  paddingTop,
  title = "Global 5K+ Happy Sponsors With us",
  partners,
}: Props) => {
  return (
    <section
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container">
        <div className={`lg:pb-30 pb-20 ${paddingTop ? "lg:pt-30 pt-20" : ""}`}>
          <div className="animate-fade-in-up">
            <h4 className="text-lg relative text-center text-textColor font-normal flex items-center justify-center">
              <span className="grow h-px bg-current mr-5 opacity-30"></span>
              {title}
              <span className="grow h-px bg-current ml-5 opacity-30"></span>
            </h4>
          </div>
          <div className="animate-fade-in-up animation-delay-200">
            <CompanySlider partners={partners} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanySection;
