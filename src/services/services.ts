import { request } from "@/lib/api";

export type Service = {
  _id: string;
  img: string;
  title: string;
  description: string;
  isActive?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ServicesResponse = {
  success: boolean;
  count: number;
  data: Service[];
};

export type ServicesParams = {
  isActive?: boolean;
};

export async function getServices(
  params: ServicesParams = {},
): Promise<Service[]> {
  const query = new URLSearchParams();
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));

  const qs = query.toString();
  const path = `/services${qs ? `?${qs}` : ""}`;

  const data = await request<Service[] | ServicesResponse>(path);
  if (Array.isArray(data)) {
    return data;
  }
  return data?.data || [];
}

export async function getService(id: string): Promise<Service | null> {
  try {
    const data = await request<Service | { success: boolean; data: Service }>(
      `/services/${encodeURIComponent(id)}`,
    );
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
