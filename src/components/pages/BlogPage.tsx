import MainLayout from "@/components/layout/MainLayout";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import BlogSection4 from "@/components/blog/BlogSection4";

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

const BlogPage = ({ posts, totalPages, categories, tags, latestPosts }: Props) => {
  return (
    <MainLayout>
      <BreadcrumbSection title="Blog" />
      <BlogSection4
        posts={posts}
        totalPages={totalPages}
        categories={categories}
        tags={tags}
        latestPosts={latestPosts}
      />
    </MainLayout>
  );
};

export default BlogPage;
