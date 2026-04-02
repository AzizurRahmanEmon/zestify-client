import Link from "next/link";
import NewsletterForm2 from "@/components/form/NewsletterForm2";
import Image from "next/image";

interface Props {
  logo?: string;
  shortDesc?: string;
  phone?: string;
  openHours?: string;
  email?: string;
  socials?: { facebook?: string; twitter?: string; instagram?: string };
  navs?: Array<{ text?: string; href?: string }>;
  services?: Array<{ text?: string; href?: string }>;
  location?: string;
  companyName?: string;
  copyright?: string;
}
const footerNavigations = [
  { id: 1, href: "/shop", text: "Shop" },
  { id: 2, href: "/blog", text: "Blog" },
  { id: 3, href: "/contact", text: "Contact" },
  { id: 4, href: "/gallery", text: "Gallery" },
  { id: 5, href: "/reservation", text: "Reservation" },
];
const footerServices = [
  { id: 1, href: "/services", text: "Services" },
  { id: 2, href: "/menu", text: "Menu" },
  { id: 3, href: "/about", text: "About Us" },
  { id: 4, href: "/login", text: "Join us" },
];
const footerSocials = [
  {
    id: 1,
    name: "Facebook",
    icon: "fa-brands fa-facebook-f",
    href: "https://facebook.com",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "Twitter",
    icon: "fa-brands fa-twitter",
    href: "https://twitter.com",
    color: "from-sky-400 to-sky-500",
  },
  {
    id: 3,
    name: "Vine",
    icon: "fa-brands fa-vine",
    href: "https://vine.co",
    color: "from-green-500 to-green-600",
  },
  {
    id: 4,
    name: "Instagram",
    icon: "fa-brands fa-instagram",
    href: "https://instagram.com",
    color: "from-zPink/60 to-purple-600",
  },
];
const FooterSection = ({
  logo = "/assets/img/logo-main.png",
  shortDesc = "Temporibus autem quibusdam officiis aut rerum necessitatibus eveniet voluta repudiandae molestiae recusandae",
  phone = "+(124) 566-7890",
  openHours = "7.00 AM - 11.15 PM",
  email = "info@example.com",
  socials,
  navs,
  services,
  location = "1403 Washington Ave, New Orleans, LA 70130, United States",
  companyName = "Zestify",
  copyright,
}: Props) => {
  const navItems =
    navs && navs.length
      ? navs.map((n) => ({ text: n.text ?? "", href: n.href ?? "/" }))
      : footerNavigations.map(({ text, href }) => ({ text, href }));
  const serviceItems =
    services && services.length
      ? services.map((s) => ({ text: s.text ?? "", href: s.href ?? "/" }))
      : footerServices.map(({ text, href }) => ({ text, href }));
  const socialLinks = {
    facebook: socials?.facebook || "https://facebook.com",
    twitter: socials?.twitter || "https://twitter.com",
    instagram: socials?.instagram || "https://instagram.com",
  };
  return (
    <footer className="bg-linear-to-br from-black via-gray-900 to-black bg-no-repeat bg-cover relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-zPink/90 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-zPink/95 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-zPink rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="ar-container relative z-10">
        <div className="py-17.5 md:py-25">
          {/* Contact Info Section */}
          <div className="relative">
            <ul className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-3 py-8 px-12 bg-linear-to-r from-gray-800/80 via-gray-900/90 to-gray-800/80 backdrop-blur-sm border border-zPink/20 rounded-2xl shadow-2xl group hover:shadow-zPink/10 transition-all duration-500">
              <li className="text-xl md:md:text-lg xl:text-xl font-normal leading-9 text-center text-white border-b md:border-b-0 pb-4 md:border-r border-zPink/30 group/item hover:scale-105 transition-transform duration-300">
                <div className="flex flex-col items-start md:items-center space-y-3">
                  <div className="w-12 h-12 bg-linear-to-br from-zPink/60 to-zPink rounded-full flex items-center justify-center group-hover/item:rotate-12 transition-transform duration-300">
                    <i className="fa-solid fa-phone text-white md:text-lg"></i>
                  </div>
                  <h6 className="font-primary font-semibold text-zPink">
                    Call Us On:
                  </h6>
                  <a
                    href={`tel:${phone}`}
                    className="hover:text-zPink transition-colors duration-300 hover:scale-110 inline-block transform"
                  >
                    {phone}
                  </a>
                </div>
              </li>

              <li className="text-xl md:md:text-lg xl:text-xl font-normal leading-9 text-center text-white border-b md:border-b-0 pb-4 md:border-r border-zPink/30 group/item hover:scale-105 transition-transform duration-300">
                <div className="flex flex-col items-start md:items-center space-y-3">
                  <div className="w-12 h-12 bg-linear-to-br from-zPink/60 to-zPink rounded-full flex items-center justify-center group-hover/item:rotate-12 transition-transform duration-300">
                    <i className="fa-solid fa-clock text-white md:text-lg"></i>
                  </div>
                  <h6 className="font-primary font-semibold text-zPink">
                    Open Hours:
                  </h6>
                  <h6>{openHours}</h6>
                </div>
              </li>

              <li className="text-xl md:md:text-lg xl:text-xl font-normal leading-9 text-center text-white group/item hover:scale-105 transition-transform duration-300">
                <div className="flex flex-col items-start md:items-center space-y-3">
                  <div className="w-12 h-12 bg-linear-to-br from-zPink/60 to-zPink rounded-full flex items-center justify-center group-hover/item:rotate-12 transition-transform duration-300">
                    <i className="fa-solid fa-envelope text-white md:text-lg"></i>
                  </div>
                  <h6 className="font-primary font-semibold text-zPink">
                    Mail Us:
                  </h6>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-zPink transition-colors duration-300 hover:scale-110 inline-block transform"
                  >
                    {email}
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Main Footer Content */}
          <div className="flex flex-wrap flex-col md:flex-row justify-between items-start gap-12 mt-10 md:mt-16">
            {/* Brand Section */}
            <div className="max-w-95 group">
              <div className="mb-6">
                <Link href="/" className="inline-block group/logo ">
                  <Image
                    width={160}
                    height={101}
                    src={logo}
                    alt="logo"
                    className="w-32 md:w-40 group-hover/logo:scale-110 transition-transform duration-300 filter drop-shadow-lg"
                  />
                </Link>
              </div>

              <div className="mb-8">
                <p className="font-normal md:text-lg leading-relaxed text-gray-300 group-hover:text-white transition-colors duration-300">
                  {shortDesc}
                </p>
              </div>

              <div>
                <div className="mb-6">
                  <h5 className="relative pl-6 font-primary font-semibold leading-8 text-2xl text-white">
                    <span className="absolute left-0 top-0 w-1 h-full bg-linear-to-b from-pink-500 to-zPink rounded-full"></span>
                    Social Info
                  </h5>
                </div>

                <div>
                  <ul className="flex items-center gap-4">
                    {footerSocials.map((social) => (
                      <li key={social.id}>
                        {(() => {
                          const href = social.icon.includes("facebook")
                            ? socialLinks.facebook
                            : social.icon.includes("twitter")
                              ? socialLinks.twitter
                              : social.icon.includes("instagram")
                                ? socialLinks.instagram
                                : social.href;

                          return (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Visit ${social.name}`}
                              className={`w-12 h-12 bg-linear-to-br ${social.color} text-white rounded-full flex items-center justify-center text-xl hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-xl group/social`}
                            >
                              <i
                                className={`${social.icon} group-hover/social:scale-125 transition-transform duration-300`}
                              ></i>
                            </a>
                          );
                        })()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Navigation Section */}
            <div className="text-white w-max group">
              <div className="mb-8">
                <h2 className="font-semibold font-primary text-2xl relative text-white group-hover:text-zPink transition-colors duration-300">
                  Our Navigation
                  <span className="absolute -bottom-2 left-0 w-20 h-0.5 bg-linear-to-r from-pink-500 to-zPink group-hover:w-full transition-all duration-500"></span>
                </h2>
              </div>

              <div>
                <ul className="flex flex-col gap-4 md:text-lg">
                  {navItems.map((item, idx) => (
                    <li key={idx} className="font-normal group/item">
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-3 hover:text-zPink hover:translate-x-2 transition-all duration-300 group/link"
                      >
                        <i className="fa-solid fa-chevrons-right text-zPink group-hover/link:text-zPink group-hover/link:translate-x-1 transition-all duration-300"></i>
                        <span className="relative">
                          {item.text}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-400 group-hover/link:w-full transition-all duration-300"></span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Services Section */}
            <div className="text-white w-max group">
              <div className="mb-8">
                <h2 className="font-semibold font-primary text-2xl relative text-white group-hover:text-zPink transition-colors duration-300">
                  Our Service
                  <span className="absolute -bottom-2 left-0 w-20 h-0.5 bg-linear-to-r from-pink-500 to-zPink group-hover:w-full transition-all duration-500"></span>
                </h2>
              </div>

              <div>
                <ul className="flex flex-col gap-4 md:text-lg">
                  {serviceItems.map((item, idx) => (
                    <li key={idx} className="font-normal group/item">
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-3 hover:text-zPink hover:translate-x-2 transition-all duration-300 group/link"
                      >
                        <i className="fa-solid fa-chevrons-right text-zPink group-hover/link:text-zPink group-hover/link:translate-x-1 transition-all duration-300"></i>
                        <span className="relative">
                          {item.text}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-400 group-hover/link:w-full transition-all duration-300"></span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="text-white max-w-[320px] group">
              <div className="mb-8">
                <h2 className="font-semibold font-primary text-2xl relative text-white group-hover:text-zPink transition-colors duration-300 block w-max">
                  Newsletter
                  <span className="absolute -bottom-2 left-0 w-20 h-0.5 bg-linear-to-r from-pink-500 to-zPink group-hover:w-full transition-all duration-500"></span>
                </h2>
              </div>

              <div className="mb-8">
                <div className="flex items-start gap-3 group/address hover:scale-105 transition-transform duration-300">
                  <div className="w-6 h-6 bg-linear-to-br from-zPink/60 to-zPink rounded-full flex items-center justify-center shrink-0 mt-1">
                    <i className="fa-solid fa-location-dot text-white text-sm"></i>
                  </div>
                  <p className="font-normal md:text-lg text-gray-300 group-hover/address:text-white transition-colors duration-300">
                    {location}
                  </p>
                </div>
              </div>

              <div>
                <NewsletterForm2 />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white/20 border-dashed">
          <div className="py-8 text-center">
            <p className="font-medium text-gray-300 text-base hover:text-white transition-colors duration-300">
              {copyright ||
                `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
