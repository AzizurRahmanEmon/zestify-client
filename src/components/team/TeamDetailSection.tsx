import Image from "next/image";

export type ChefQualification = {
  date: string;
  title: string;
  school: string;
};

export type ChefStat = {
  label: string;
  percentage: number;
};

interface Props {
  name: string;
  img: string;
  position?: string;
  experience?: string;
  phone?: string;
  email?: string;
  address?: string;
  bio?: string;
  qualifications?: ChefQualification[];
  stats?: ChefStat[];
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  certificates?: string[];
}

const TeamDetailSection = ({
  name,
  img,
  position,
  experience,
  phone,
  email,
  address,
  bio,
  qualifications = [],
  stats = [],
  socialLinks,
  certificates = [],
}: Props) => {
  const activeSocials: { icon: string; label: string; href: string }[] = [
    socialLinks?.facebook && {
      icon: "facebook-f",
      label: "Facebook",
      href: socialLinks.facebook,
    },
    socialLinks?.twitter && {
      icon: "twitter",
      label: "Twitter",
      href: socialLinks.twitter,
    },
    socialLinks?.instagram && {
      icon: "instagram",
      label: "Instagram",
      href: socialLinks.instagram,
    },
    socialLinks?.linkedin && {
      icon: "linkedin-in",
      label: "LinkedIn",
      href: socialLinks.linkedin,
    },
  ].filter(Boolean) as { icon: string; label: string; href: string }[];

  return (
    <section
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container py-20 lg:py-30 overflow-hidden">
        {/* Certificates & Education — only render when data exists */}
        {(qualifications.length > 0 || certificates.length > 0) && (
          <>
            <div className="flex items-center flex-col lg:flex-row gap-6 justify-between">
              <div className="xl:max-w-125 lg:max-w-110 text-center lg:text-start">
                <h4 className="ar-title">Certificates & Education</h4>
              </div>
              {certificates.length > 0 && (
                <div className="flex flex-col md:flex-row items-center gap-6 xl:gap-8">
                  {certificates.map((src, idx) => (
                    <Image
                      key={idx}
                      width={321}
                      height={196}
                      src={src}
                      alt={`Certificate ${idx + 1}`}
                      className="bg-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {qualifications.length > 0 && (
              <div className="relative mt-10 lg:mt-15">
                <div className="absolute w-full bg-gray-200 h-px top-0 hidden xl:block"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 w-full pt-3">
                  {qualifications.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className="hidden xl:flex absolute -top-6 left-0 w-6 h-6 bg-zPink rounded-full shadow-lg items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div className="lg:pt-12 bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                        <div className="text-center lg:text-left">
                          <span className="inline-block px-4 py-2 bg-zPink text-white text-sm font-semibold rounded-full mb-4">
                            {item.date}
                          </span>
                          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-zPink transition-colors duration-300">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 font-medium">
                            {item.school}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Team Member Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 xl:mt-20 mt-12 gap-16 items-start">
          {/* Team Member Image */}
          <div className="relative lg:w-3/5 lg:mx-auto xl:w-auto xl:mx-0">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <Image
                width={755}
                height={607}
                src={img}
                alt="Team member"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent"></div>
            </div>
          </div>

          {/* Stats and Info */}
          <div className="space-y-12">
            {/* Progress Bars */}
            {stats.length > 0 && (
              <div className="space-y-8 lg:w-4/5 xl:w-auto lg:mx-auto xl:mx-0">
                {stats.map((stat, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-center mb-4">
                      <h6 className="text-lg font-bold text-gray-900">
                        {stat.label}
                      </h6>
                      <span className="text-lg font-bold text-zPink">
                        {stat.percentage}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zPink rounded-full transition-all duration-1000 ease-out transform group-hover:scale-x-105"
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Contact Card */}
            <div className="bg-white xl:w-auto xl:mx-0 lg:w-4/5 lg:mx-auto rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-pink-50/30 to-rose-50/30"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="text-center md:text-left">
                      <h6 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                        Name
                      </h6>
                      <h5 className="text-2xl font-bold text-gray-700">
                        {name}
                      </h5>
                    </div>
                    {position && (
                      <div className="text-center md:text-left">
                        <h6 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                          Position
                        </h6>
                        <h5 className="text-2xl font-bold text-gray-700">
                          {position}
                        </h5>
                      </div>
                    )}
                    {experience && (
                      <div className="text-center md:text-left">
                        <h6 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                          Experience
                        </h6>
                        <h5 className="text-2xl font-bold text-gray-700">
                          {experience}
                        </h5>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {phone && (
                      <div className="text-center md:text-left">
                        <h6 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                          Phone
                        </h6>
                        <a
                          href={`tel:${phone}`}
                          className="text-xl font-semibold text-gray-600 hover:text-zPink transition-colors duration-300"
                        >
                          {phone}
                        </a>
                      </div>
                    )}
                    {email && (
                      <div className="text-center md:text-left">
                        <h6 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                          Email
                        </h6>
                        <a
                          href={`mailto:${email}`}
                          className="text-xl font-semibold text-gray-600 hover:text-zPink transition-colors duration-300 break-all"
                        >
                          {email}
                        </a>
                      </div>
                    )}
                    {address && (
                      <div className="text-center md:text-left">
                        <h6 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                          Address
                        </h6>
                        <h5 className="text-xl font-semibold text-gray-600">
                          {address}
                        </h5>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Icons */}
                {activeSocials.length > 0 && (
                  <div className="flex justify-center space-x-4 mt-8 pt-8 border-t border-gray-300">
                    {activeSocials.map((social) => (
                      <a
                        key={social.icon}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${social.label} profile`}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-900 hover:bg-zPink hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                      >
                        <i
                          className={`fa-brands fa-${social.icon} text-lg`}
                        ></i>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <div className="xl:mt-20 mt-12 text-center xl:text-start">
            <h4 className="ar-title pb-5 border-b-2 border-zPink w-max mx-auto xl:mx-0">
              About Chef
            </h4>
            <p className="ar-subtitle mt-8">{bio}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamDetailSection;
