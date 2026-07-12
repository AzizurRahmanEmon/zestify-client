import { ProductDataType } from "@/types";

function requireApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is required but not set. Add it to your environment (e.g. client-app/.env.local) before starting the app.",
    );
  }
  return url.replace(/\/+$/, "");
}

export const API_URL = requireApiUrl();
export const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID?.trim() || "";

/** Sentinel for httpOnly cookie sessions — never send as a Bearer token. */
export const COOKIE_SESSION = "cookie";

const CSRF_STORAGE_KEY = "zestify_customer_csrf_token";

export function isCookieSession(token?: string | null): boolean {
  return token === COOKIE_SESSION;
}

/** Persist CSRF from login/me JSON — required for cross-origin (cookie is not JS-readable). */
export function persistCsrfToken(token: string | null | undefined): void {
  if (typeof sessionStorage === "undefined") return;
  if (!token) {
    sessionStorage.removeItem(CSRF_STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(CSRF_STORAGE_KEY, token);
}

export function clearCsrfToken(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(CSRF_STORAGE_KEY);
}

export function rememberCsrfFromAuthPayload(
  payload?: {
    csrfToken?: string;
    data?: unknown;
  } | null,
): void {
  const data = payload?.data;
  const nestedToken =
    data &&
    typeof data === "object" &&
    data !== null &&
    "csrfToken" in data &&
    typeof (data as { csrfToken?: unknown }).csrfToken === "string"
      ? (data as { csrfToken: string }).csrfToken
      : undefined;
  const token = payload?.csrfToken ?? nestedToken;
  if (token) {
    persistCsrfToken(token);
  }
}

export function getCsrfTokenFromCookie(): string | null {
  if (typeof sessionStorage !== "undefined") {
    const stored = sessionStorage.getItem(CSRF_STORAGE_KEY);
    if (stored) return stored;
  }
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    /(?:^|;\s*)zestify_customer_csrf=([^;]+)/,
  );
  return match ? decodeURIComponent(match[1]) : null;
}

type BuildRequestHeadersOptions = {
  token?: string | null;
  includeTenant?: boolean;
  extra?: HeadersInit;
};

export function buildRequestHeaders({
  token,
  includeTenant = true,
  extra,
}: BuildRequestHeadersOptions = {}): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token && !isCookieSession(token)) {
    headers.Authorization = `Bearer ${token}`;
  }

  const csrfToken = getCsrfTokenFromCookie();
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  if (includeTenant && TENANT_ID) {
    headers["x-tenant-id"] = TENANT_ID;
  }

  if (extra) {
    Object.assign(headers, extra as Record<string, string>);
  }

  return headers;
}

type CustomerFetchOptions = RequestInit & {
  token?: string | null;
  includeTenant?: boolean;
};

export function customerFetchInit({
  token,
  includeTenant = true,
  headers,
  ...init
}: CustomerFetchOptions = {}): RequestInit {
  return {
    credentials: "include",
    ...init,
    headers: buildRequestHeaders({
      token,
      includeTenant,
      extra: headers,
    }),
  };
}

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
  const res = await fetch(
    url,
    customerFetchInit({ ...init, cache: "no-store" }),
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Request failed (${res.status} ${res.statusText}) for ${url}: ${text}`,
    );
  }
  const json = (await res.json()) as ApiResponse<unknown>;
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
  preparationTime?: number | string;
  ingredients?: string[];
  allergens?: string[];
  nutritionInfo?: ProductDataType["nutritionInfo"];
  createdAt?: string;
  updatedAt?: string;
};

type ProductListEnvelope = ApiResponse<ApiProduct[]>;

type HomePageEnvelope = ApiResponse<HomePageContent>;

type ProductReviewsPayload = {
  averageRating?: number;
  reviewsCount?: number;
  items?: ProductReviewItem[];
};

type ProductReviewsEnvelope = ApiResponse<ProductReviewsPayload>;

type ProductReviewCheck = {
  canReview?: boolean;
};

function hasData<T>(value: T | ApiResponse<T>): value is ApiResponse<T> {
  return typeof value === "object" && value !== null && "data" in value;
}

function isProductReviewItem(value: unknown): value is ProductReviewItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "_id" in value &&
    "name" in value &&
    "rating" in value &&
    "review" in value &&
    "createdAt" in value
  );
}

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
    preparationTime:
      typeof p.preparationTime === "string"
        ? Number(p.preparationTime)
        : p.preparationTime,
    ingredients: p.ingredients,
    allergens: p.allergens,
    nutritionInfo: p.nutritionInfo,
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

  const data = await request<ProductListEnvelope | ApiProduct[]>(
    `/products?${query.toString()}`,
  );
  const products = Array.isArray(data)
    ? data
    : Array.isArray(data.data)
      ? (data.data ?? [])
      : [];
  return products.map(mapApiProduct);
}

export async function getRelatedProducts(
  slug: string,
  limit = 4,
): Promise<ProductDataType[]> {
  const data = await request<ApiProduct[] | ProductListEnvelope>(
    `/products/${encodeURIComponent(slug)}/related?limit=${encodeURIComponent(
      String(limit),
    )}`,
  );
  const list: ApiProduct[] = Array.isArray(data)
    ? data
    : Array.isArray(data.data)
      ? (data.data ?? [])
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
  const json = await request<ProductReviewsEnvelope | ProductReviewsPayload>(
    `/products/${encodeURIComponent(slug)}/reviews${qs ? `?${qs}` : ""}`,
  );
  const data = hasData<ProductReviewsPayload>(json) ? (json.data ?? {}) : json;
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
  const data = await request<ProductReviewCheck>(
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
  const json = await request<
    ProductReviewItem | ProductReviewItem[] | { data?: ProductReviewItem }
  >(`/products/${encodeURIComponent(slug)}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data =
    typeof json === "object" && json !== null && "data" in json
      ? json.data
      : json;
  if (isProductReviewItem(data)) {
    return data;
  }
  throw new Error("Invalid review response");
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDataType | null> {
  try {
    const product = await request<ApiProduct>(`/products/${slug}`);
    return mapApiProduct(product);
  } catch {
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
  const data = await request<HomePageContent | HomePageEnvelope>("/pages/home");
  return hasData<HomePageContent>(data)
    ? (data.data ?? { slug: "", sectionsOrder: [] })
    : data;
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
): Promise<Chef[]> {
  const query = new URLSearchParams();
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params.limit) query.set("limit", String(params.limit));
  const res = await request<Chef[] | ApiResponse<Chef[]>>(
    `/chefs?${query.toString()}`,
  );
  return hasData<Chef[]>(res) ? (res.data ?? []) : res;
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
): Promise<Partner[]> {
  const query = new URLSearchParams();
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params.limit) query.set("limit", String(params.limit));
  const res = await request<Partner[] | ApiResponse<Partner[]>>(
    `/partners?${query.toString()}`,
  );
  return hasData<Partner[]>(res) ? (res.data ?? []) : res;
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
): Promise<Testimonial[]> {
  const query = new URLSearchParams();
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params.limit) query.set("limit", String(params.limit));
  const res = await request<Testimonial[] | ApiResponse<Testimonial[]>>(
    `/testimonials?${query.toString()}`,
  );
  return hasData<Testimonial[]>(res) ? (res.data ?? []) : res;
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
): Promise<Blog[]> {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.limit) query.set("limit", String(params.limit));
  if (params.sort) query.set("sort", params.sort);
  const res = await request<Blog[] | ApiResponse<Blog[]>>(
    `/blogs?${query.toString()}`,
  );
  return hasData<Blog[]>(res) ? (res.data ?? []) : res;
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
  loyaltyPointsPerPurchaseAmount?: number;
  loyaltyPointValue?: number;
  minimumPointsToRedeem?: number;
};
export async function getSettings(): Promise<Settings> {
  const res = await request<Settings | ApiResponse<Settings>>(`/settings`);
  return hasData<Settings>(res) ? (res.data ?? {}) : res;
}
