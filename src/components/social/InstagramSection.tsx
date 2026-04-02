import Image from "next/image";

interface Props {
  images?: string[];
  link?: string;
}

const InstagramSection = ({
  images = [
    "/assets/img/insta-1.png",
    "/assets/img/insta-2.png",
    "/assets/img/insta-3.png",
    "/assets/img/insta-4.png",
    "/assets/img/insta-5.png",
    "/assets/img/insta-6.png",
  ],
  link = "#",
}: Props) => {
  const imgs = images.slice(0, 6);

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 w-full relative">
      {imgs.map((img, idx) => (
        <div key={idx}>
          <Image
            src={img}
            alt=""
            className="h-40 md:h-56 lg:h-80 w-full object-cover object-center"
            width={318}
            height={320}
          />
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <div>
          <a
            href={link}
            aria-label="Visit our Instagram page"
            className="w-24 h-24 flex items-center justify-center bg-zPink/90 text-white rounded-full text-5xl transition hover:bg-zPink hover:scale-110 hover:shadow-lg hover:shadow-[#E2491A]/50"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default InstagramSection;
