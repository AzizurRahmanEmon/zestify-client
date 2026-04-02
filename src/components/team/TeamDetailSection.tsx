import Image from "next/image";

interface Props {
  name: string;
  img: string;
}

const qualificationList = [
  {
    id: 1,
    date: "JULY 2017",
    title: "Computer Science",
    school: "Canadian National University",
  },
  {
    id: 2,
    date: "OCTOBER 2019",
    title: "Wine & Cocktails",
    school: "Canadian National University",
  },
  {
    id: 3,
    date: "NOVEMBER 2018",
    title: "Masters Degree",
    school: "Canadian National University",
  },
  {
    id: 4,
    date: "DECEMBER 2023",
    title: "MS Technology",
    school: "Canadian National University",
  },
];
const chefStats = [
  { id: 1, label: "Success Rate", percentage: 80 },
  { id: 2, label: "Complete Work", percentage: 50 },
  { id: 3, label: "Satisfied Client", percentage: 95 },
];
const socialIcons = [
  { icon: "facebook-f", href: "https://facebook.com" },
  { icon: "twitter", href: "https://twitter.com" },
  { icon: "vine", href: "https://vine.co" },
  { icon: "instagram", href: "https://instagram.com" },
];
const TeamDetailSection = ({ name, img }: Props) => {
  return (
    <section
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container py-20 lg:py-30 overflow-hidden">
        <div className="flex items-center flex-col lg:flex-row gap-6 justify-between">
          <div className="xl:max-w-125 lg:max-w-110 text-center lg:text-start">
            <h4 className="ar-title">Certificates & Education</h4>
            <p className="font-medium mt-5">
              If you are going to use a passage of Lorem Ipsum, you need to be
              sure there isn't anything embarrassing hidden
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 xl:gap-8">
            <Image
              width={321}
              height={196}
              src="/assets/img/certificate-1.png"
              alt="img"
              className="bg-cover"
            />
            <Image
              width={321}
              height={196}
              src="/assets/img/certificate-2.png"
              alt="img"
              className="bg-cover"
            />
          </div>
        </div>
        <div className="relative mt-10 lg:mt-15">
          <div className="absolute w-full bg-gray-200 h-px top-0 hidden xl:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 w-full pt-3">
            {qualificationList.map((item) => (
              <div key={item.id} className="relative group">
                {/* Timeline Dot */}
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
                    <p className="text-gray-600 font-medium">{item.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
            <div className="space-y-8 lg:w-4/5 xl:w-auto lg:mx-auto xl:mx-0">
              {chefStats.map((stat) => (
                <div key={stat.id} className="group">
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
                    <div className="text-center md:text-left">
                      <h6 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                        Position
                      </h6>
                      <h5 className="text-2xl font-bold text-gray-700">
                        WordPress Expert
                      </h5>
                    </div>
                    <div className="text-center md:text-left">
                      <h6 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                        Experience
                      </h6>
                      <h5 className="text-2xl font-bold text-gray-700">
                        6 Years
                      </h5>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="text-center md:text-left">
                      <h6 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                        Phone
                      </h6>
                      <a
                        href="tel:+5265665665"
                        className="text-xl font-semibold text-gray-600 hover:text-zPink transition-colors duration-300"
                      >
                        +52656 656 65
                      </a>
                    </div>
                    <div className="text-center md:text-left">
                      <h6 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                        Email
                      </h6>
                      <a
                        href="mailto:youremail@gmail.com"
                        className="text-xl font-semibold text-gray-600 hover:text-zPink transition-colors duration-300 break-all"
                      >
                        youremail@gmail.com
                      </a>
                    </div>
                    <div className="text-center md:text-left">
                      <h6 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                        Address
                      </h6>
                      <h5 className="text-xl font-semibold text-gray-600">
                        Jones Street New York
                      </h5>
                    </div>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center space-x-4 mt-8 pt-8 border-t border-gray-300">
                  {socialIcons.map((social) => (
                    <a
                      key={social.icon}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${social.icon} profile`}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-900 hover:bg-zPink hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                    >
                      <i className={`fa-brands fa-${social.icon} text-lg`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:mt-20 mt-12 text-center xl:text-start">
          <div>
            <h4 className="ar-title pb-5 border-b-2 border-zPink w-max mx-auto xl:mx-0">
              About Chef
            </h4>

            <p className="ar-subtitle mt-8">
              Nisl quam nestibulum ac quam nec odio elementu sceisu aucan
              ligula. Orci varius natoque pena tibus et magnis dis urient monte
              ulus mus nellent esque habitanum ac quam nec odio rbine. Nisl quam
              nestibulum ac quam nec odio elementu sceisu aucan ligula. toque
              pena tibus et magnis dis u rient monte nascete ridic ulus mus
              nellentesque habitanum ac quam nec odio rbine. Nisl quamu quam nec
              odio elementu sceisu aucan ligula. Orc i varius natoque pena tibus
              et magnis dis urient monte nascete ridic ulus mus a habitanum ac
              quam nec odio rbine. Nisl quam nestibulum ac qua m nec odio
              elementu sceisu aucan ligula. Orci varius natoq pe magnis dis
              urient monte nascete ridiculus mus nellentesque habitanum ac quam
              nec odio rbine. Nisl quam nestibulum ac quam ntoque pena tibus et
              magnis dis urient monte nascete ridic ulus mus nellentesque
              habitanum ac quam nec odio rbine. Nisl quam a quam nec odio
              elementu sceisu aucan ligula. Orci varius natoque pena tibus et
              magnis dis urient monte nascet e ridic ulus mus n habitanum ac
              quam nec odio rbine.
            </p>
            <p className="ar-subtitle mt-5">
              Nisl quam nestibulum ac quam nec odio elementu sceisu aucan
              ligula. Orci varius natoque pena tibus et magnis dis urient monte
              quam nec odio e lementu sceisu aucan ligula. Orci varius natoque
              pena tibus et magnis dis urient monte nascete ridic
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamDetailSection;
