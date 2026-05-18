"use client";
import { useCallback, useState } from "react";
import BlogSidebar from "./BlogSidebar";
import BlogCommentForm from "@/components/form/BlogCommentForm";
import BlogActiveFilters from "./BlogActiveFilters";
import { useBlogFilters } from "@/hooks/useBlogFilters";
import BlogCommentsDisplay from "./BlogCommentsDisplay";
import { BlogDataTypes } from "@/types";
import FilteredBloglist from "./FilteredBloglist";
import BlogDetailTopSection from "./BlogDetailTopSection";
import BlogDetailMidSection from "./BlogDetailMidSection";
import BlogDetailSocialSection from "./BlogDetailSocialSection";

type SidebarCategory = { name: string; count: number };

type Props = {
  blog: BlogDataTypes;
  filteredPosts: BlogDataTypes[];
  totalPages: number;
  categories: SidebarCategory[];
  tags: string[];
  latestPosts: BlogDataTypes[];
};

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

  const canonicalPostUrl = `https://zestify.com/blog/${blog.link}`;
  const encodedPostUrl = encodeURIComponent(canonicalPostUrl);

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
                  <FilteredBloglist filteredPosts={filteredPosts} />
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
                <BlogDetailTopSection blog={blog} />

                <div className="space-y-8">
                  <BlogDetailMidSection blog={blog} />

                  <BlogDetailSocialSection
                    canonicalPostUrl={canonicalPostUrl}
                    encodedPostUrl={encodedPostUrl}
                  />

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
