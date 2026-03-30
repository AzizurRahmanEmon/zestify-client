import Image from "next/image";

const teamValues = [
  {
    id: 1,
    icon: "fa-solid fa-fire-burner",
    title: "Passionate Cooking",
    desc: "Every dish is crafted with love and dedication",
    gradient: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
  },
  {
    id: 2,
    icon: "fa-solid fa-star",
    title: "Quality First",
    desc: "We use only the finest ingredients & techniques",
    gradient: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50",
  },
  {
    id: 3,
    icon: "fa-solid fa-handshake",
    title: "Teamwork",
    desc: "Collaboration makes our kitchen run smoothly",
    gradient: "from-blue-500 to-purple-500",
    bgColor: "bg-blue-50",
  },
  {
    id: 4,
    icon: "fa-solid fa-palette",
    title: "Creativity",
    desc: "Innovation in every recipe and presentation",
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
  },
];

const TeamValueSection = () => {
  return (
    <section className="lg:py-30 py-20 bg-linear-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-zPink/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="ar-container relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 animate-fade-in-up">
            <div className="relative">
              <Image
                width={14}
                height={22}
                src="/assets/img/fire.png"
                alt="fire"
              />
            </div>
            <h6 className="ar-subtitle">Our Values</h6>
          </div>
          <h2 className="ar-title mt-3 animate-fade-in-up animation-delay-200">
            What Drives Our Team
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mt-10 lg:mt-15">
          {teamValues.map((value, index) => (
            <div
              key={value.id}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>

                {/* Icon container */}
                <div className="relative z-10 mb-6">
                  <div
                    className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <i className={`${value.icon} text-3xl text-gray-700`}></i>
                  </div>
                  {/* Decorative line */}
                  <div
                    className={`w-12 h-1 bg-linear-to-r ${value.gradient} mx-auto rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500`}
                  ></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className="font-bold text-xl mb-4 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {value.desc}
                  </p>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-linear-to-br from-transparent to-gray-100 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-linear-to-tr from-transparent to-gray-100 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Floating elements */}
              <div
                className={`absolute -top-2 -right-2 w-6 h-6 bg-linear-to-br ${value.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce`}
              ></div>
              <div
                className={`absolute -bottom-2 -left-2 w-4 h-4 bg-linear-to-br ${value.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse`}
              ></div>
            </div>
          ))}
        </div>

        {/* Bottom decorative section */}
        <div className="lg:mt-16 mt-10 text-center">
          <div className="flex items-center justify-center gap-6 lg:gap-8 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-zPink to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">15+</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Years of Excellence
                </p>
                <p className="text-sm text-gray-600">In culinary arts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">6</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Master Chefs</p>
                <p className="text-sm text-gray-600">Expert culinary team</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">100+</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Signature Dishes</p>
                <p className="text-sm text-gray-600">Unique creations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamValueSection;
