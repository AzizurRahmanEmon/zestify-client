import BlogPage from "@/components/pages/BlogPage";
import { Metadata } from "next";
import { getBlogsList, type Blog } from "@/services/blogs";

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

type SidebarCategory = { name: string; count: number };

function buildSidebarMeta(blogs: Blog[]) {
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
  const categories: SidebarCategory[] = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const tags = Array.from(tagSet.values()).sort((a, b) => a.localeCompare(b));
  const latestPosts = blogs.slice(0, 3);
  return { categories, tags, latestPosts };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const search = getParam(sp, "search") || undefined;
  const category = getParam(sp, "category") || undefined;
  const tagsParam = getParam(sp, "tags") || "";
  const tags = tagsParam
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const page = parseInt(getParam(sp, "page") || "1") || 1;
  const sort = getParam(sp, "sort") || "date-desc";

  const emptyList = { blogs: [] as Blog[], pages: 1 };
  const emptyMeta = {
    categories: [] as SidebarCategory[],
    tags: [] as string[],
    latestPosts: [] as Blog[],
  };

  const [filteredResult, meta] = await Promise.all([
    getBlogsList({
      status: "published",
      search,
      category,
      tag: tags[0],
      page,
      limit: 6,
      sort,
    }).catch(() => emptyList),
    getBlogsList({
      status: "published",
      page: 1,
      limit: 100,
      sort: "date-desc",
    })
      .then((r) => buildSidebarMeta(r.blogs))
      .catch(() => emptyMeta),
  ]);

  return (
    <BlogPage
      posts={filteredResult.blogs}
      totalPages={filteredResult.pages}
      categories={meta.categories}
      tags={meta.tags}
      latestPosts={meta.latestPosts}
    />
  );
}
