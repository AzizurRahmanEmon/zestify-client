import { ProductDataType } from "@/types";

const DEFAULT_API_URL = "https://zestify-api-backend.vercel.app/api";

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  DEFAULT_API_URL
)?.replace(/\/+$/, "");

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
};

export type { ApiResponse };

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Request failed (${res.status} ${res.statusText}) for ${url}: ${text}`,
    );
  }
  const json = (await res.json()) as ApiResponse<any>;
  if (json && typeof json === "object" && "success" in json) {
    if (!json.success) {
      throw new Error(json.message || "Unknown API error");
    }
    return (json.data ?? json) as T;
  }
  return json as T;
}

type ApiProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  images?: string[];
  category: string;
  tags?: string[];
  stock?: number;
  rating?: { stars?: number; reviews?: number };
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function mapApiProduct(p: ApiProduct): ProductDataType {
  return {
    _id: p._id,
    id: 0,
    name: p.name,
    price: p.price,
    salePrice: p.salePrice,
    description: p.description,
    image: p.image,
    images: p.images,
    width: 224,
    height: 224,
    rating: {
      stars: p.rating?.stars ?? 5,
      reviews: p.rating?.reviews ?? 0,
    },
    slug: p.slug,
    category: p.category,
    tags: p.tags ?? [],
    quantity: 1,
    stock: p.stock,
    isFeatured: p.isFeatured,
    isActive: p.isActive,
    preparationTime: (p as any).preparationTime,
    ingredients: (p as any).ingredients,
    allergens: (p as any).allergens,
    nutritionInfo: (p as any).nutritionInfo,
  };
}

export type GetProductsParams = {
  category?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export async function getProducts(
  params: GetProductsParams = {},
): Promise<ProductDataType[]> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params.isFeatured !== undefined)
    query.set("isFeatured", String(params.isFeatured));
  if (params.minPrice !== undefined)
    query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined)
    query.set("maxPrice", String(params.maxPrice));
  if (params.tags && params.tags.length)
    query.set("tags", params.tags.join(","));
  if (params.search) query.set("search", params.search);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const data = await request<{
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    data: ApiProduct[];
  }>(`/products?${query.toString()}`);

  const products: ApiProduct[] = Array.isArray((data as any)?.data)
    ? (data as any).data
    : (data as any);
  return products.map(mapApiProduct);
}

export async function getRelatedProducts(
  slug: string,
  limit = 4,
): Promise<ProductDataType[]> {
  const data = await request<any>(
    `/products/${encodeURIComponent(slug)}/related?limit=${encodeURIComponent(
      String(limit),
    )}`,
  );
  const list: ApiProduct[] = Array.isArray((data as any)?.data)
    ? (data as any).data
    : Array.isArray(data)
      ? data
      : [];
  return list.map(mapApiProduct);
}

export type NutritionInfo = {
  servingSize?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

export async function getProductNutrition(
  slug: string,
): Promise<NutritionInfo | null> {
  const data = await request<NutritionInfo>(
    `/products/${encodeURIComponent(slug)}/nutrition`,
  );
  return data ?? null;
}

export type ProductReviewItem = {
  _id: string;
  name: string;
  rating: number;
  review: string;
  createdAt: string;
};

export type ProductReviewsResponse = {
  averageRating: number;
  reviewsCount: number;
  items: ProductReviewItem[];
};

export async function getProductReviews(
  slug: string,
  params: { page?: number; limit?: number } = {},
): Promise<ProductReviewsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  const json = await request<any>(
    `/products/${encodeURIComponent(slug)}/reviews${qs ? `?${qs}` : ""}`,
  );
  const data = json?.data ?? json;
  return {
    averageRating: Number(data?.averageRating || 0),
    reviewsCount: Number(data?.reviewsCount || 0),
    items: Array.isArray(data?.items)
      ? (data.items as ProductReviewItem[])
      : [],
  };
}

export async function canReviewProduct(
  slug: string,
  email?: string,
): Promise<boolean> {
  if (!email) return false;
  const data = await request<any>(
    `/products/${encodeURIComponent(slug)}/reviews/can-review?email=${encodeURIComponent(
      email,
    )}`,
  );
  return Boolean(data?.canReview);
}

export async function postProductReview(
  slug: string,
  payload: { name: string; email: string; rating: number; review: string },
): Promise<ProductReviewItem> {
  const json = await request<any>(
    `/products/${encodeURIComponent(slug)}/reviews`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  const data = json?.data ?? json;
  return data as ProductReviewItem;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDataType | null> {
  try {
    const product = await request<ApiProduct>(`/products/${slug}`);
    return mapApiProduct(product);
  } catch (e) {
    return null;
  }
}
export async function getFeaturedProducts(): Promise<ProductDataType[]> {
  const items = await getProducts({
    isFeatured: true,
    isActive: true,
    limit: 12,
  });
  return items;
}

export type HomePageContent = {
  slug: string;
  sectionsOrder: string[];
  header?: {
    variant?: string;
    logo?: string;
    topbarText?: string;
    email?: string;
    location?: string;
  };
  hero?: {
    backgroundImage?: string;
    subtitle?: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  popular?: { title?: string; subtitle?: string };
  about?: {
    subtitle?: string;
    title?: string;
    list?: string[];
    image1?: string;
    image2?: string;
    videoPoster?: string;
    videoUrl?: string;
  };
  cta?: {
    leftText?: string;
    rightText?: string;
    leftBg?: string;
    rightBg?: string;
  };
  bestSelling?: { title?: string; subtitle?: string };
  menu?: { title?: string; subtitle?: string };
  team?: { title?: string; subtitle?: string };
  company?: { title?: string };
  video?: {
    title?: string;
    subtitle?: string;
    bgImg?: string;
    videoUrl?: string;
  };
  testimony?: { title?: string; subtitle?: string };
  reservation?: { title?: string; subtitle?: string; bgImg?: string };
  blog?: { title?: string; subtitle?: string };
  insta?: { variant?: string; images?: string[]; link?: string };
  footer?: {
    variant?: string;
    logo?: string;
    shortDesc?: string;
    phone?: string;
    openHours?: string;
    email?: string;
    socials?: { facebook?: string; twitter?: string; instagram?: string };
    navs?: Array<{ text?: string; href?: string }>;
    services?: Array<{ text?: string; href?: string }>;
    location?: string;
    companyName?: string;
    copyright?: string;
  };
};

export async function getHomePage(): Promise<HomePageContent> {
  const data = await request<{ success: boolean; data: HomePageContent }>(
    "/pages/home",
  );
  const content =
    (data as any)?.data && typeof (data as any).data === "object"
      ? ((data as any).data as HomePageContent)
      : (data as any);
  return content;
}

// Additional content fetchers for client homepage
export type Chef = {
  _id: string;
  name: string;
  title: string;
  specialty?: string;
  label?: string;
  imgSrc: string;
  altText?: string;
  profileLink?: string;
  socialLinks?: { linkedin?: string; facebook?: string; twitter?: string };
};
export async function getChefs(
  params: { isActive?: boolean; limit?: number } = {},
) {
  const query = new URLSearchParams();
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params.limit) query.set("limit", String(params.limit));
  const res = await request<{ success: boolean; data: Chef[] }>(
    `/chefs?${query.toString()}`,
  );
  const arr = (res as any)?.data ?? (res as any);
  return arr as Chef[];
}

export type Partner = {
  icon: string;
  width: number;
  height: number;
  _id?: string;
  name?: string;
};
export async function getPartners(
  params: { isActive?: boolean; limit?: number } = {},
) {
  const query = new URLSearchParams();
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params.limit) query.set("limit", String(params.limit));
  const res = await request<{ success: boolean; data: Partner[] }>(
    `/partners?${query.toString()}`,
  );
  return ((res as any)?.data ?? res) as Partner[];
}

export type Testimonial = {
  testimony: string;
  img: string;
  name: string;
  position: string;
  rating?: number;
  _id?: string;
};
export async function getTestimonials(
  params: { isActive?: boolean; limit?: number } = {},
) {
  const query = new URLSearchParams();
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params.limit) query.set("limit", String(params.limit));
  const res = await request<{ success: boolean; data: Testimonial[] }>(
    `/testimonials?${query.toString()}`,
  );
  return ((res as any)?.data ?? res) as Testimonial[];
}

export type Blog = {
  _id: string;
  title: string;
  img: string;
  link?: string;
  status?: string;
};
export async function getBlogs(
  params: { status?: string; limit?: number; sort?: string } = {},
) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.limit) query.set("limit", String(params.limit));
  if (params.sort) query.set("sort", params.sort);
  const res = await request<{ success: boolean; data: Blog[] }>(
    `/blogs?${query.toString()}`,
  );
  return ((res as any)?.data ?? res) as Blog[];
}

export type Settings = {
  restaurantName?: string;
  email?: string;
  phone?: string;
  address?: string;
  googleMapsIframe?: string;
  promoVideoUrl?: string;
  businessHours?: Array<{
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
  logo?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
};
export async function getSettings(): Promise<Settings> {
  const res = await request<{ success: boolean; data: Settings }>(`/settings`);
  return ((res as any)?.data ?? res) as Settings;
}
