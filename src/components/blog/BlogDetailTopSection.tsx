import { BlogDataTypes } from "@/types";
import Image from "next/image";
interface Props {
  blog: BlogDataTypes;
}
const BlogDetailTopSection = ({ blog }: Props) => {
  return (
    <div className="mb-8">
      <div className="relative overflow-hidden rounded-2xl shadow-xl group">
        <Image
          width={960}
          height={594}
          src={blog.descImg || blog.img}
          alt={blog.title}
          className="w-full h-auto max-h-125 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 -mt-8 mx-4 relative z-10 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="fa-regular fa-user text-sm"></i>
              </div>
              <span className="text-sm font-medium">
                By {blog.author?.name || "Admin"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="fa-regular fa-calendar text-sm"></i>
              </div>
              <span className="text-sm font-medium">{blog.date || ""}</span>
            </div>
            {!!blog.readTime && (
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="fa-regular fa-clock text-sm"></i>
                </div>
                <span className="text-sm font-medium">
                  {blog.readTime} min read
                </span>
              </div>
            )}
          </div>
          <button className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-full sm:flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-110 hidden">
            <Image
              width={16}
              height={16}
              src="/assets/img/share.png"
              alt="Share"
              className="invert"
            />
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-6 text-gray-900 leading-tight">
          {blog.title}
        </h1>

        {(blog.category || (blog.tags || []).length > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {blog.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {blog.category}
              </span>
            )}
            {(blog.tags || []).map((t) => (
              <span
                key={t}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zPink/10 text-zPink"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {blog.excerpt && (
          <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">
            {blog.excerpt}
          </p>
        )}
      </div>
    </div>
  );
};
export default BlogDetailTopSection;
