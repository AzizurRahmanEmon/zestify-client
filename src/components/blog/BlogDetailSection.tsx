"use client";
import { useCallback, useState } from "react";
import BlogSidebar from "./BlogSidebar";
import BlogCommentForm from "@/components/form/BlogCommentForm";
import BlogActiveFilters from "./BlogActiveFilters";
import { useBlogFilters } from "@/hooks/useBlogFilters";
import BlogCommentsDisplay from "./BlogCommentsDisplay";
import Image from "next/image";
import Link from "next/link";

type BlogPost = {
  _id: string;
  title: string;
  img: string;
  descImg?: string;
  date?: string;
  link: string;
  category?: string;
  tags?: string[];
  excerpt?: string;
  content?: string;
  author?: { name?: string };
  readTime?: number;
};

type SidebarCategory = { name: string; count: number };

type Props = {
  blog: BlogPost;
  filteredPosts: BlogPost[];
  totalPages: number;
  categories: SidebarCategory[];
  tags: string[];
  latestPosts: BlogPost[];
};

const blogFeatures = [
  {
    id: 1,
    feature: "Fresh Environment",
  },
  {
    id: 2,
    feature: "Gourmet Mushroom Risotto",
  },
  {
    id: 3,
    feature: "Margarita Shrimp Tacos",
  },
  {
    id: 4,
    feature: "A Beautiful Sunday Morning",
  },
  {
    id: 5,
    feature: "In Mattis Scelerisque Magna",
  },
  {
    id: 6,
    feature: "Honey-Glazed Salmon",
  },
  {
    id: 7,
    feature: "Grilled Ribeye Steak",
  },
];

const blogSocials = [
  { id: 1, icon: "fa-facebook-f", color: "hover:text-blue-600" },
  { id: 2, icon: "fa-instagram", color: "hover:text-pink-600" },
  { id: 3, icon: "fa-twitter", color: "hover:text-blue-400" },
  { id: 4, icon: "fa-linkedin", color: "hover:text-blue-700" },
];

const BlogDetailSection = ({
  blog,
  filteredPosts,
  totalPages,
  categories,
  tags,
  latestPosts,
}: Props) => {
  const [commentsRefreshKey, setCommentsRefreshKey] = useState(0);
  const refreshComments = useCallback(() => {
    setCommentsRefreshKey((prev) => prev + 1);
  }, []);

  const {
    blogCurrentPage,
    toggleNextPage,
    blogSearchTerm,
    blogSelectedCategory,
    blogSelectedTags,
  } = useBlogFilters();

  // Check if any filters are active
  const hasActiveFilters =
    blogSearchTerm || blogSelectedCategory || blogSelectedTags.length > 0;

  return (
    <section className="bg-linear-to-br from-gray-50 to-white">
      <div className="ar-container py-12 sm:py-16 lg:py-24">
        <div className="flex justify-center lg:justify-between items-start gap-8 xl:gap-16 flex-col lg:flex-row">
          <div className="w-full lg:w-[70%] shrink-0">
            {hasActiveFilters ? (
              // Show filtered blog results
              <>
                <BlogActiveFilters />
                {filteredPosts.length > 0 ? (
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
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
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
                {filteredPosts.length > 0 && totalPages > 1 && (
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
              </>
            ) : (
              <>
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
                          <span className="text-sm font-medium">
                            {blog.date || ""}
                          </span>
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

                <div className="space-y-8">
                  {blog.content && (
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100 space-y-6">
                      <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                        {blog.content}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                      <div className="order-2 lg:order-1">
                        <Image
                          width={455}
                          height={320}
                          src={blog.img}
                          alt={blog.title}
                          className="w-full h-auto max-h-70 object-cover rounded-lg shadow-md"
                        />
                      </div>
                      <div className="order-1 lg:order-2 space-y-3">
                        {blogFeatures.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 group"
                          >
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors">
                              <Image
                                width={12}
                                height={12}
                                src="/assets/img/checked-2.png"
                                alt="Check"
                              />
                            </div>
                            <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                              {item.feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <span className="font-semibold text-gray-900">
                          Share:
                        </span>
                        <div className="flex items-center gap-3">
                          {blogSocials.map((social) => (
                            <a
                              key={social.id}
                              href="#"
                              className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-md`}
                            >
                              <i className={`fa-brands ${social.icon}`}></i>
                            </a>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Image
                          width={15}
                          height={15}
                          src="/assets/img/comments.png"
                          alt="Comments"
                        />
                        <span className="font-medium">Comments</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 pb-3 border-b-3 border-zPink inline-block">
                        Leave A Comment
                      </h3>
                    </div>

                    <BlogCommentForm
                      blogId={blog._id}
                      onSubmitted={refreshComments}
                    />
                  </div>
                  <BlogCommentsDisplay
                    blogId={blog._id}
                    refreshKey={commentsRefreshKey}
                  />
                </div>
              </>
            )}
          </div>
          <BlogSidebar
            categories={categories}
            tags={tags}
            latestPosts={latestPosts}
          />
        </div>
      </div>
    </section>
  );
};

export default BlogDetailSection;
