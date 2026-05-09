import Image from "next/image";
import Link from "next/link";

interface Blog {
  id?: number | string;
  _id?: string;
  title: string;
  img: string;
  link: string;
}

interface Props {
  title?: string;
  subtitle?: string;
  blogs?: Blog[];
}

const BlogSection = ({
  title = "Discover Our Latest Blog",
  subtitle = "Our Latest blog",
  blogs,
}: Props) => {
  const displayBlogs = blogs && blogs.length ? blogs : [];
  return (
    <section
      className="overflow-hidden"
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container">
        <div className="py-20 lg:py-30">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 animate-fade-in-up">
              <Image
                width={14}
                height={22}
                src="/assets/img/fire.png"
                alt=""
                className="w-3.5 h-auto"
              />
              <h6 className="ar-subtitle">{subtitle}</h6>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <h2 className="ar-title mt-3">{title}</h2>
            </div>
          </div>

          <div className="mt-12 lg:mt-15 grid grid-cols-1 md:w-4/5 md:mx-auto lg:grid-cols-2 2xl:grid-cols-3 lg:w-full gap-7.5 animate-fade-in-up animation-delay-400">
            {displayBlogs.map((blog) => (
              <div
                key={
                  ("_id" in blog ? blog._id : undefined) || blog.id || blog.link
                }
                className="group"
              >
                <div className="relative">
                  <div className="overflow-hidden">
                    <Image
                      width={438}
                      height={400}
                      src={blog.img}
                      alt={blog.title}
                      className="h-auto object-cover w-full aspect-438/400 transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="bg-white border border-[#E7E7E7] px-5 pt-10 pb-6 sm:px-8 sm:pt-16 sm:pb-11 relative z-20 transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-zPink">
                  <Link
                    href={`/blog/${blog.link}`}
                    className="block text-2xl sm:text-3xl text-textColor font-primary font-medium transition-colors duration-300 group-hover:text-zPink"
                  >
                    {blog.title}
                  </Link>
                  <p className="mt-4 font-medium text-sm sm:text-base text-pTextColor">
                    Rapidiously repurpose leading edge growth
                  </p>
                  <Link
                    href={`/blog/${blog.link}`}
                    className="flex w-max items-center gap-4 mt-7"
                  >
                    <span className="underline text-base sm:text-lg font-normal transition-colors duration-300 group-hover:text-zPink">
                      Read More
                    </span>
                    <span className="bg-zPink w-5 h-5 inline-flex items-center justify-center text-xs text-white">
                      <i className="fa-light fa-plus"></i>
                    </span>
                  </Link>
                  <div className="absolute flex items-center h-13 bg-zPink z-10 justify-around w-[90%] left-1/2 -translate-x-1/2 -top-6.5">
                    <div className="flex text-sm sm:text-base text-white items-center gap-3">
                      <i className="fa-light fa-user"></i>
                      <h6>By Admin</h6>
                    </div>
                    <div className="flex text-sm sm:text-base text-white items-center gap-3">
                      <i className="fa-light fa-comments"></i>
                      <h6>(06) Comments</h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
