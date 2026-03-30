import ContactForm from "@/components/form/ContactForm";

type Settings = {
  phone?: string;
  email?: string;
  address?: string;
  googleMapsIframe?: string;
  businessHours?: Array<{ day: string; open: string; close: string; isClosed: boolean }>;
};

interface Props {
  settings?: Settings;
}

const ContactSection = ({ settings }: Props) => {
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
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[dayIndex];
  const normalize = (s: string) => s.trim().toLowerCase();
  const todayHours =
    Array.isArray(settings?.businessHours) && settings?.businessHours.length
      ? settings.businessHours.find(
          (d) => normalize(d.day).startsWith(normalize(todayName)) || normalize(todayName).startsWith(normalize(d.day)),
        )
      : undefined;
  const workHoursText = todayHours
    ? todayHours.isClosed
      ? "Closed Today"
      : `${todayHours.open} - ${todayHours.close}`
    : "09.00 AM - 06.00 PM";

  return (
    <section className="relative overflow-hidden">
      <div className="ar-container py-20 lg:py-30 relative z-10">
        <div className="flex flex-col xl:flex-row items-start gap-12 xl:gap-16">
          {/* Left Column - Contact Info & Map */}
          <div className="w-full xl:w-1/2 space-y-8">
            {/* Header */}
            <h2 className="ar-title text-center lg:text-start">
              Get in Touch with Us
            </h2>

            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="group">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-zPink rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg
                        width="30"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.09 8.32 8.82 8.59L6.62 10.79Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm font-medium mb-1">
                        Phone Number
                      </p>
                      <a
                        href={`tel:${phone}`}
                        className="text-gray-900 font-bold hover:text-zPink transition-colors duration-300"
                        aria-label={`Call us at ${phone}`}
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-zPink rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg
                        width="30"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm font-medium mb-1">
                        Email Address
                      </p>
                      <a
                        href={`mailto:${email}`}
                        className="text-gray-900 font-bold hover:text-zPink transition-colors duration-300"
                        aria-label={`Send email to ${email}`}
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-zPink rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg
                        width="30"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm font-medium mb-1">
                        Location
                      </p>
                      <address className="text-gray-900 font-bold not-italic">
                        {address}
                      </address>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-zPink rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg
                        width="30"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2ZM17 13H11V7H12.5V11.5H17V13Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm font-medium mb-1">
                        Work Hours
                      </p>
                      <span className="text-gray-900 font-bold">
                        {workHoursText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="overflow-hidden rounded-lg">
                <iframe
                  src={mapSrc}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-80 lg:h-96"
                  style={{ border: 0 }}
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="w-full xl:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Send us a Message
                </h3>
                <p className="text-gray-600">
                  We'd love to hear from you. Fill out the form below and we'll
                  get back to you soon.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
