import { request } from "@/lib/api";

export type GalleryItem = {
  _id: string;
  img: string;
  width: number;
  height: number;
  title: string;
  category: string;
  desc: string;
  span?: string;
  isActive?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type GalleryResponse = {
  success: boolean;
  count: number;
  data: GalleryItem[];
};

export type GalleryParams = {
  category?: string;
  isActive?: boolean;
  sort?: "title" | "title-desc" | "category" | "newest" | "oldest";
};

export async function getGallery(
  params: GalleryParams = {},
): Promise<GalleryItem[]> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params.sort) query.set("sort", params.sort);

  const qs = query.toString();
  const path = `/gallery${qs ? `?${qs}` : ""}`;

  const data = await request<GalleryItem[] | GalleryResponse>(path);
  if (Array.isArray(data)) {
    return data;
  }
  return data?.data || [];
}

export async function getGalleryItem(id: string): Promise<GalleryItem | null> {
  try {
    const data = await request<
      GalleryItem | { success: boolean; data: GalleryItem }
    >(`/gallery/${encodeURIComponent(id)}`);
    if (!data) {
      return null;
    }
    if ("_id" in data) {
      return data;
    }
    return data.data || null;
  } catch (e: any) {
    if (e?.message?.includes("404")) return null;
    throw e;
  }
}
