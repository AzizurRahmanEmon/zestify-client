import { request } from "@/lib/api";

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
  const data = await request<{ success: boolean; data: Settings }>(`/settings`);
  return ((data as any)?.data ?? data) as Settings;
}
