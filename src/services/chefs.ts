import { request } from "@/lib/api";

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
  const data = await request<{ success: boolean; data: Chef[] }>(
    `/chefs?${query.toString()}`,
  );
  return ((data as any)?.data ?? data) as Chef[];
}
