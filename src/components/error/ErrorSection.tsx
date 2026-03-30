import Image from "next/image";
import Link from "next/link";

const ErrorSection = () => {
  return (
    <section
      className="bg-no-repeat"
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container py-20 lg:py-30">
        <Image
          width={838}
          height={497}
          src="/assets/img/error.png"
          alt="error"
          className="mx-auto w-4/5 md:w-209.5 h-auto"
        />
        <h5 className="ar-title text-center md:mt-12 mt-8">
          Oops... It looks like you are lost!
        </h5>
        <p className="ar-subtitle md:mt-8 text-center mt-4">
          The page you are looking for does not exist. It might have been moved
          or deleted.
        </p>
        <Link href="/" className="ar-btn group gap-3 md:mt-12 mx-auto mt-10">
          <span className="relative z-10 transition-all duration-500 group-hover:text-black">
            Go To Home
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
    </section>
  );
};

export default ErrorSection;
