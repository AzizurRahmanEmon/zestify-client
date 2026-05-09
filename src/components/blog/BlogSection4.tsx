"use client";
import { useBlogFilters } from "@/hooks/useBlogFilters";
import BlogSidebar from "./BlogSidebar";
import BlogActiveFilters from "./BlogActiveFilters";
import Image from "next/image";
import Link from "next/link";

type BlogListItem = {
  _id: string;
  title: string;
  img: string;
  link: string;
  category?: string;
  tags?: string[];
  date?: string;
};

type SidebarCategory = { name: string; count: number };

type Props = {
  posts: BlogListItem[];
  totalPages: number;
  categories: SidebarCategory[];
  tags: string[];
  latestPosts: BlogListItem[];
};

const BlogSection4 = ({
  posts,
  totalPages,
  categories,
  tags,
  latestPosts,
}: Props) => {
  const { blogCurrentPage, toggleNextPage } = useBlogFilters();

  return (
    <section className="py-20 lg:py-30">
      <div className="ar-container">
        <div className="flex gap-12 lg:gap-8 flex-col lg:flex-row">
          {/* Main Content */}
          <div className="lg:flex-1">
            {/* Active Filters */}
            <BlogActiveFilters />
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-8 gap-6">
                {posts.map((post) => (
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
                          className="w-full h-auto aspect-422/224 object-cover group-hover:scale-105 transition-transform duration-500"
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
                        <Link
                          href={`/blog/${post.link}`}
                          className="line-clamp-2"
                        >
                          {post.title}
                        </Link>
                      </h2>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {(post.tags || []).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 hover:bg-Zpink/20 hover:text-zPink/80 transition-colors duration-200"
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
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291.94-5.709 2.291M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}

            {/* Pagination */}
            {posts.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => toggleNextPage(i)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                        blogCurrentPage === i + 1
                          ? "bg-zPink text-white shadow-lg shadow-pink-600/25"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 w-full">
            <BlogSidebar
              categories={categories}
              tags={tags}
              latestPosts={latestPosts}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection4;
