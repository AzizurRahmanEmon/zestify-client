import { request } from "@/lib/api";

export type BlogAuthor = {
  _id?: string;
  name?: string;
  email?: string;
};

export type Blog = {
  _id: string;
  title: string;
  img: string;
  descImg?: string;
  date?: string;
  link: string;
  category?: string;
  tags?: string[];
  content?: string;
  excerpt?: string;
  author?: BlogAuthor;
  status?: "draft" | "published" | "archived";
  views?: number;
  likes?: number;
  isFeatured?: boolean;
  readTime?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogListResponse = {
  success: boolean;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  data?: Blog[];
  message?: string;
};

export type GetBlogsParams = {
  status?: "draft" | "published" | "archived";
  category?: string;
  isFeatured?: boolean;
  tag?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

function normalizeSort(sort?: string) {
  if (!sort) return undefined;
  if (sort === "-date") return "date-desc";
  if (sort === "date") return "date-desc";
  return sort;
}

function formatDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const day = d.toLocaleString("en-GB", { day: "2-digit" });
  const month = d.toLocaleString("en-GB", { month: "short" });
  const year = d.toLocaleString("en-GB", { year: "numeric" });
  return `${day} ${month}, ${year}`;
}

function mapBlog(b: Blog): Blog {
  return {
    ...b,
    date: b.date
      ? formatDate(b.date)
      : b.createdAt
        ? formatDate(b.createdAt)
        : "",
    tags: Array.isArray(b.tags) ? b.tags : [],
  };
}

async function fetchJson<T>(path: string): Promise<T> {
  return request<T>(path);
}

function buildBlogsPath(
  path: string,
  params: Record<string, string | undefined>,
) {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") query.set(k, v);
  }
  const qs = query.toString();
  return `${path}${qs ? `?${qs}` : ""}`;
}

export async function getBlogs(
  params: { status?: string; limit?: number; sort?: string } = {},
): Promise<Blog[]> {
  const path = buildBlogsPath("/blogs", {
    status: params.status,
    limit: params.limit ? String(params.limit) : undefined,
    sort: normalizeSort(params.sort),
  });
  const json = await fetchJson<BlogListResponse>(path);
  const data = Array.isArray((json as any)?.data)
    ? ((json as any).data as Blog[])
    : Array.isArray(json)
      ? (json as Blog[])
      : [];
  return data.map(mapBlog);
}

export async function getBlogsList(
  params: GetBlogsParams = {},
): Promise<{ blogs: Blog[]; page: number; pages: number; total: number }> {
  const sort = normalizeSort(params.sort) || "date-desc";
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit =
    params.limit && params.limit > 0 ? Math.min(params.limit, 100) : 8;

  const endpoint =
    params.category &&
    !params.search &&
    !params.tag &&
    params.isFeatured === undefined
      ? `/blogs/category/${encodeURIComponent(params.category)}`
      : params.tag &&
          !params.search &&
          !params.category &&
          params.isFeatured === undefined
        ? `/blogs/tag/${encodeURIComponent(params.tag)}`
        : "/blogs";

  const path =
    endpoint === "/blogs"
      ? buildBlogsPath(endpoint, {
          status: params.status,
          category: params.category,
          isFeatured:
            params.isFeatured === undefined
              ? undefined
              : String(params.isFeatured),
          tag: params.tag,
          search: params.search,
          sort,
          page: String(page),
          limit: String(limit),
        })
      : buildBlogsPath(endpoint, {
          page: String(page),
          limit: String(limit),
        });

  const json = await fetchJson<BlogListResponse>(path);
  const data = Array.isArray((json as any)?.data)
    ? ((json as any).data as Blog[])
    : Array.isArray(json)
      ? (json as Blog[])
      : [];
  const pages =
    typeof (json as any)?.pages === "number" && (json as any).pages > 0
      ? (json as any).pages
      : 1;
  const total =
    typeof (json as any)?.total === "number"
      ? (json as any).total
      : data.length;
  return { blogs: data.map(mapBlog), page, pages, total };
}

export async function getFeaturedBlogs(limit = 5): Promise<Blog[]> {
  const path = buildBlogsPath("/blogs/featured", {
    limit: String(Math.min(limit, 100)),
  });
  const json = await fetchJson<{ success: boolean; data?: Blog[] }>(path);
  const data = Array.isArray((json as any)?.data)
    ? ((json as any).data as Blog[])
    : Array.isArray(json)
      ? (json as Blog[])
      : [];
  return data.map(mapBlog);
}

export async function getBlogByLink(link: string): Promise<Blog | null> {
  if (!link) return null;
  try {
    const json = await fetchJson<{ success: boolean; data?: Blog }>(
      `/blogs/link/${encodeURIComponent(link)}`,
    );
    const blog = ((json as any)?.data ?? json) as Blog | undefined;
    return blog ? mapBlog(blog) : null;
  } catch {
    return null;
  }
}
