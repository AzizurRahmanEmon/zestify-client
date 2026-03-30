import MainLayout from "@/components/layout/MainLayout";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import BlogDetailSection from "@/components/blog/BlogDetailSection";
import ErrorSection from "@/components/error/ErrorSection";

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
  blogInfo: BlogPost | null;
  filteredPosts: BlogPost[];
  totalPages: number;
  categories: SidebarCategory[];
  tags: string[];
  latestPosts: BlogPost[];
};

const BlogDetailPage = ({
  blogInfo,
  filteredPosts,
  totalPages,
  categories,
  tags,
  latestPosts,
}: Props) => {
  return (
    <MainLayout>
      <BreadcrumbSection title={blogInfo ? "Blog Details" : "Error Page"} />
      {blogInfo ? (
        <BlogDetailSection
          blog={blogInfo}
          filteredPosts={filteredPosts}
          totalPages={totalPages}
          categories={categories}
          tags={tags}
          latestPosts={latestPosts}
        />
      ) : (
        <ErrorSection />
      )}
    </MainLayout>
  );
};

export default BlogDetailPage;
