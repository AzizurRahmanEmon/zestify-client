import Link from "next/link";

type Settings = {
  phone?: string;
  email?: string;
  address?: string;
  googleMapsIframe?: string;
  businessHours?: Array<{
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
};
interface Props {
  settings?: Settings;
}

const ContactSection2 = ({ settings }: Props) => {
  const phone = settings?.phone || "+88 (9800) 6802";
  const email = settings?.email || "info@exale.com";
  const address = settings?.address || "Dhaka Bangladesh";

  const extractIframeSrc = (value: string | undefined) => {
    if (!value) return "";
    if (value.includes("<iframe")) {
      const match = value.match(/src=['"]([^'"]+)['"]/i);
      return match?.[1] || "";
    }
    return value;
  };
  const mapSrc =
    extractIframeSrc(settings?.googleMapsIframe) ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116833.83187902115!2d90.33728818728464!3d23.780975728108746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1697280378529!5m2!1sen!2sbd";

  const dayIndex = new Date().getDay();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayName = dayNames[dayIndex];
  const normalize = (s: string) => s.trim().toLowerCase();
  const todayHours =
    Array.isArray(settings?.businessHours) && settings?.businessHours.length
      ? settings.businessHours.find(
          (d) =>
            normalize(d.day).startsWith(normalize(todayName)) ||
            normalize(todayName).startsWith(normalize(d.day)),
        )
      : undefined;
  const workHoursText = todayHours
    ? todayHours.isClosed
      ? "Closed Today"
      : `${todayHours.open} - ${todayHours.close}`
    : "09.00 AM - 06.00 PM";
  return (
    <section>
      <div className="grid grid-cols-1 2xl:grid-cols-2 overflow-hidden">
        <div
          className="py-16 lg:py-24 px-10 bg-no-repeat bg-cover relative"
          style={{
            backgroundImage: `url(/assets/img/contact-bg-2.png)`,
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 xl:w-4/5 2xl:w-full xl:mx-auto">
            <div className="flex items-center gap-2 justify-center">
              <span className="block w-15.25 h-0.75 bg-white"></span>
              <h6 className="ar-subtitle text-white">Book a table</h6>
            </div>
            <h3 className="ar-title text-white mt-3 max-w-[90%] mx-auto text-center">
              Savor the Moment. Create Memories.
            </h3>

            <p className="font-medium mx-auto md:w-4/5 lg:w-[70%] lg:text-lg text-white text-center mt-6">
              Everyone is encouraged to shop with confidence at shopping online
              bd as our strict buyer's protection policies ensure no
            </p>
            <Link
              href="/reservation"
              className="ar-btn mt-8 lg:mt-10 rounded-none group mx-auto"
            >
              <span className="relative z-10 transition-all duration-500 group-hover:text-black">
                Book a table
              </span>
              <span className="absolute top-0 left-0 w-0 h-full bg-white transition-all duration-500 group-hover:w-full z-0"></span>
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 w-max mx-auto gap-6 mt-10 lg:mt-12">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl p-6 hover:border-zPink transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zPink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Phone Number</h4>
                    <a
                      href={`tel:${phone}`}
                      aria-label={`Call us at ${phone}`}
                      className="text-zPink font-semibold"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl p-6 hover:border-zPink transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zPink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Email Address</h4>
                    <a
                      href={`mailto:${email}`}
                      className="text-zPink font-semibold"
                      aria-label={`Send email to ${email}`}
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl p-6 hover:border-zPink transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zPink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Location</h4>
                    <address className="text-zPink font-semibold">
                      {address}
                    </address>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl p-6 hover:border-zPink transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zPink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Work Hours</h4>
                    <p className="text-zPink font-semibold">{workHoursText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-100 2xl:h-full">
          <div className="overflow-hidden h-full">
            <iframe
              src={mapSrc}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full min-h-100"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection2;
