import { request } from "@/lib/api";

export type Chef = {
  _id: string;
  name: string;
  title: string;
  specialty: string;
  label: string;
  imgSrc: string;
  altText: string;
  profileLink: string;
  socialLinks?: {
    linkedin: string;
    facebook: string;
    twitter: string;
  };
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export async function getChefs(
  params: { isActive?: boolean; limit?: number } = {},
): Promise<Chef[]> {
  const query = new URLSearchParams();
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params.limit) query.set("limit", String(params.limit));
  const data = await request<Chef[] | { data: Chef[] }>(
    `/chefs?${query.toString()}`,
  );
  if (Array.isArray(data)) {
    return data;
  }
  return data.data ?? [];
}

export async function getChefByProfileLink(
  profileLink: string,
): Promise<Chef | null> {
  try {
    const data = await request<Chef | { data: Chef }>(
      `/chefs/${encodeURIComponent(profileLink)}`,
    );
    if (!data) {
      return null;
    }
    if ("_id" in data) {
      return data;
    }
    return data.data || null;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("404")) return null;
    throw error;
  }
}
