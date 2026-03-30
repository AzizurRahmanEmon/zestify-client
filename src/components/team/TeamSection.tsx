import Link from "next/link";
import Image from "next/image";
interface Member {
  _id?: string;
  name: string;
  title: string;
  specialty?: string;
  label?: string;
  imgSrc: string;
  altText?: string;
  profileLink?: string;
  socialLinks?: { linkedin?: string; facebook?: string; twitter?: string };
}
interface Props {
  main?: boolean;
  title?: string;
  subtitle?: string;
  members?: Member[];
}
const TeamSection = ({
  main,
  title = "Our Culinary Masters",
  subtitle = "Meet The Team",
  members,
}: Props) => {
  const displayMembers = members && members.length ? members : [];
  return (
    <section
      className="py-20 lg:py-30 overflow-hidden"
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 animate-fade-in-up">
            <Image
              width={14}
              height={22}
              src="/assets/img/fire.png"
              alt="fire"
            />
            <h6 className="ar-subtitle">{subtitle}</h6>
          </div>
          <div className="animate-fade-in-up animation-delay-200">
            <h2 className="ar-title mt-3">{title}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7.5 mt-12 lg:mt-15 animate-fade-in-up animation-delay-400">
          {displayMembers
            .slice(0, main ? displayMembers.length : 3)
            .map((member, idx) => (
              <div
                key={(member as any)._id ?? member.profileLink ?? idx}
                className="group transition-all duration-500 hover:transform hover:scale-105"
              >
                <div className="relative h-114 overflow-hidden rounded-t-lg">
                  <Image
                    width={438}
                    height={456}
                    src={member.imgSrc}
                    alt={member.altText || member.name}
                    className="relative z-10 object-cover m-auto h-full"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                  <div className="border border-[#E7E7E7] border-b-0 min-h-46 absolute w-full bottom-0 transition-all duration-500 ease-in-out group-hover:min-h-114 bg-white/90 backdrop-blur-sm"></div>

                  {/* Hover Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30">
                    <div className="text-white">
                      <h4 className="font-semibold text-lg mb-2">
                        Specialties
                      </h4>
                      <p className="text-sm mb-4">{member.specialty}</p>
                      <div className="flex justify-center gap-2">
                        <span className="px-3 py-1 bg-zPink rounded-full text-xs">
                          {member.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-[#E7E7E7] py-6 px-4 bg-white rounded-b-lg shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                  <Link
                    href={`/chef/${member.profileLink || "#"}`}
                    className="block group-hover:text-zPink font-primary font-semibold text-2xl lg:text-3xl text-center transition-colors duration-300"
                  >
                    {member.name}
                  </Link>
                  <p className="text-gray-600 text-center mt-2 text-sm">
                    {member.label}
                  </p>
                  <ul className="flex justify-center items-center gap-4 mt-4">
                    <li>
                      <Link
                        href={member.socialLinks?.linkedin || "#"}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-zPink hover:text-white transition-colors duration-300"
                      >
                        IN
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={member.socialLinks?.facebook || "#"}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-zPink hover:text-white transition-colors duration-300"
                      >
                        FB
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={member.socialLinks?.twitter || "#"}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-zPink hover:text-white transition-colors duration-300"
                      >
                        TW
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
