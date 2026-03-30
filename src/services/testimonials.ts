import { request } from "@/lib/api";

export type Testimonial = {
  _id?: string;
  testimony: string;
  img: string;
  name: string;
  position: string;
  rating?: number;
};

export async function getTestimonials(
  params: { isActive?: boolean; limit?: number } = {},
): Promise<Testimonial[]> {
  const query = new URLSearchParams();
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params.limit) query.set("limit", String(params.limit));
  const data = await request<{ success: boolean; data: Testimonial[] }>(
    `/testimonials?${query.toString()}`,
  );
  return ((data as any)?.data ?? data) as Testimonial[];
}
