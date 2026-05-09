"use client";
import { useBlogFilters } from "@/hooks/useBlogFilters";
import BlogSearchForm from "@/components/form/BlogSearchForm";
import BlogSubscriptionForm from "@/components/form/BlogSubscriptionForm";
import Image from "next/image";
import Link from "next/link";

type SidebarCategory = { name: string; count: number };
type SidebarPost = {
  _id: string;
  title: string;
  img: string;
  link: string;
  date?: string;
};

type Props = {
  categories?: SidebarCategory[];
  tags?: string[];
  latestPosts?: SidebarPost[];
};

const BlogSidebar = ({
  categories = [],
  tags = [],
  latestPosts = [],
}: Props) => {
  const { toggleCategory, blogSelectedTags, toggleTag, blogSelectedCategory } =
    useBlogFilters();

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Search</h3>
        <BlogSearchForm />
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => toggleCategory(c.name)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 text-left group ${
                blogSelectedCategory === c.name
                  ? "bg-zPink/10 border border-zPink"
                  : "hover:bg-gray-50"
              }`}
            >
              <span
                className={`font-medium transition-colors duration-200 ${
                  blogSelectedCategory === c.name
                    ? "text-zPink"
                    : "text-gray-700 group-hover:text-zPink"
                }`}
              >
                {c.name}
              </span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Latest Posts */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Latest Posts</h3>
        <div className="space-y-4">
          {latestPosts.map((post, index) => (
            <article key={index} className="group">
              <Link
                href={`/blog/${post.link}`}
                className="flex gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
              >
                <Image
                  width={64}
                  height={64}
                  src={post.img}
                  alt={post.title}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 group-hover:text-zPink transition-colors duration-200 line-clamp-2 text-sm mb-1">
                    {post.title.length > 35
                      ? post.title.slice(0, 35) + "..."
                      : post.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <svg
                      className="w-3 h-3"
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
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                blogSelectedTags.includes(tag)
                  ? "bg-zPink text-white shadow-lg shadow-zPink/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-linear-to-br from-zPink to-pink-700 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
        <p className="text-pink-100 text-sm mb-4">
          Get the latest posts delivered right to your inbox.
        </p>
        <BlogSubscriptionForm />
      </div>
    </aside>
  );
};

export default BlogSidebar;
