import BlogDetailPage from "@/components/pages/BlogDetailPage";
import type { Metadata } from "next";
import { getBlogByLink, getBlogsList } from "@/services/blogs";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(sp: SearchParams, key: string) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

function buildSidebarMeta(blogs: any[]) {
  const categoryMap = new Map<string, number>();
  const tagSet = new Set<string>();
  for (const b of blogs) {
    const category = (b?.category || "").trim();
    if (category)
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    const tags = Array.isArray(b?.tags) ? b.tags : [];
    for (const t of tags) {
      const tag = String(t || "").trim();
      if (tag) tagSet.add(tag);
    }
  }
  const categories = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const tags = Array.from(tagSet.values()).sort((a, b) => a.localeCompare(b));
  const latestPosts = blogs.slice(0, 3);
  return { categories, tags, latestPosts };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogByLink(slug).catch(() => null);

  return {
    title: post?.title ?? "Blog Post",
    description:
      post?.excerpt ||
      "Read this article from the Zestify blog for food tips, recipes, and restaurant updates.",
    openGraph: {
      title: post?.title,
      description: post?.excerpt,
      images: post?.img ? [{ url: post.img }] : [],
      type: "article",
    },
  };
}

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const blogInfo = await getBlogByLink(slug).catch(() => null);

  const search = getParam(searchParams, "search") || "";
  const category = getParam(searchParams, "category") || "";
  const tagsParam = getParam(searchParams, "tags") || "";
  const tagsSelected = tagsParam
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const page = parseInt(getParam(searchParams, "page") || "1") || 1;
  const sort = getParam(searchParams, "sort") || "date-desc";

  const hasActiveFilters = !!(search || category || tagsSelected.length > 0);

  const [filtered, meta] = await Promise.all([
    hasActiveFilters
      ? getBlogsList({
          status: "published",
          search: search || undefined,
          category: category || undefined,
          tag: tagsSelected[0],
          page,
          limit: 8,
          sort,
        }).catch(() => ({ blogs: [], pages: 1, page: 1, total: 0 }))
      : Promise.resolve({ blogs: [], pages: 1, page: 1, total: 0 }),
    getBlogsList({
      status: "published",
      page: 1,
      limit: 100,
      sort: "date-desc",
    })
      .then((r) => buildSidebarMeta(r.blogs))
      .catch(() => ({ categories: [], tags: [], latestPosts: [] })),
  ]);

  return (
    <BlogDetailPage
      blogInfo={blogInfo as any}
      filteredPosts={filtered.blogs as any}
      totalPages={filtered.pages}
      categories={meta.categories as any}
      tags={meta.tags as any}
      latestPosts={meta.latestPosts as any}
    />
  );
}
