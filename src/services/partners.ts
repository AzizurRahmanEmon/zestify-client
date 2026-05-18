import { request } from "@/lib/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

export type Partner = {
  _id?: string;
  icon: string;
  width: number;
  height: number;
  name?: string;
};

export async function getPartners(
  params: { isActive?: boolean; limit?: number } = {},
): Promise<Partner[]> {
  const query = new URLSearchParams();
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params.limit) query.set("limit", String(params.limit));
  const data = await request<Partner[] | ApiEnvelope<Partner[]>>(
    `/partners?${query.toString()}`,
  );
  return typeof data === "object" && data !== null && "data" in data
    ? data.data
    : data;
}
