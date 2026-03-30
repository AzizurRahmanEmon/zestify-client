import BlogPage from "@/components/pages/BlogPage";
import { Metadata } from "next";
import { getBlogsList } from "@/services/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read the latest food stories, recipes, cooking tips, and restaurant news from the Zestify team.",
};

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

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = getParam(searchParams, "search") || undefined;
  const category = getParam(searchParams, "category") || undefined;
  const tagsParam = getParam(searchParams, "tags") || "";
  const tags = tagsParam
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const page = parseInt(getParam(searchParams, "page") || "1") || 1;
  const sort = getParam(searchParams, "sort") || "date-desc";

  const [{ blogs, pages }, meta] = await Promise.all([
    getBlogsList({
      status: "published",
      search,
      category,
      tag: tags[0],
      page,
      limit: 8,
      sort,
    }).catch(() => ({ blogs: [], pages: 1, page: 1, total: 0 })),
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
    <BlogPage
      posts={blogs as any}
      totalPages={pages}
      categories={meta.categories as any}
      tags={meta.tags as any}
      latestPosts={meta.latestPosts as any}
    />
  );
}
