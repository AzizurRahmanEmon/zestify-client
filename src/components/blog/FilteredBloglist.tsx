import { BlogDataTypes } from "@/types";
import Image from "next/image";
import Link from "next/link";
interface Props {
  filteredPosts: BlogDataTypes[];
}
const FilteredBloglist = ({ filteredPosts }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-8 gap-6">
      {filteredPosts.map((post) => (
        <article
          key={post._id || post.link}
          className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
        >
          <div className="relative overflow-hidden">
            <Link href={`/blog/${post.link}`} className="block">
              <Image
                width={422}
                height={224}
                src={post.img}
                alt={post.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm">
                {post.category || ""}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <time>{post.date || ""}</time>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-zPink transition-colors duration-200">
              <Link href={`/blog/${post.link}`} className="line-clamp-2">
                {post.title}
              </Link>
            </h2>

            <div className="flex flex-wrap gap-1 mb-4">
              {(post.tags || []).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 hover:bg-zPink/20 hover:text-zPink/80 transition-colors duration-200"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <Link
              href={`/blog/${post.link}`}
              className="inline-flex items-center text-sm font-medium text-zPink hover:text-zPink/80 transition-colors duration-200"
            >
              Read more
              <svg
                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};
export default FilteredBloglist;
