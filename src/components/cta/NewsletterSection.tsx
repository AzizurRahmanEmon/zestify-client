import NewsletterForm from "@/components/form/NewsletterForm";
import Image from "next/image";
import Link from "next/link";

const NewsletterSection = () => {
  return (
    <div className="relative bg-linear-to-r from-orange-500 via-orange-400 to-yellow-500 bg-no-repeat bg-cover py-10 newsletter-clip-path overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300/20 rounded-full blur-2xl transform -translate-x-24 translate-y-24"></div>

      <div className="ar-container relative z-10">
        <div className="flex flex-col xl:flex-row items-center justify-center xl:justify-between gap-5">
          <Link
            href="/"
            className="group border-2 border-white/80 hover:border-white h-20 2xl:h-28 2xl:px-8 px-5 flex items-center justify-center transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
            aria-label="Zestify Home"
          >
            <Image
              width={109}
              height={68}
              src="/assets/img/logo-main.png"
              alt="Zestify Logo"
              className="scale-90 2xl:scale-100 transition-transform duration-300 group-hover:scale-95"
            />
          </Link>
          <div className="">
            <h2 className="font-bold text-white text-xl md:text-2xl 2xl:text-3xl mb-2 drop-shadow-lg text-center">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-white/90 text-sm md:text-base xl:w-auto xl:mx-0 md:w-4/5 md:mx-auto text-center font-medium mb-5 drop-shadow-sm">
              Get the latest updates on fresh recipes, special
              <br className="md:hidden xl:block" /> offers, and culinary tips
              delivered to your inbox
            </p>
          </div>
          <div className="max-w-2xl text-center">
            <NewsletterForm />

            <div className="mt-6 flex items-center justify-center gap-4 text-white/80 text-sm">
              <div className="w-1 h-1 bg-white/60 rounded-full"></div>
              <div className="flex items-center gap-1">
                <i className="fa-solid fa-clock"></i>
                <span>Weekly updates</span>
              </div>
              <div className="w-1 h-1 bg-white/60 rounded-full"></div>
              <div className="flex items-center gap-1">
                <i className="fa-solid fa-times"></i>
                <span>Unsubscribe anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;
