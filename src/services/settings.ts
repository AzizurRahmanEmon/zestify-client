import { request } from "@/lib/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

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
  const data = await request<Settings | ApiEnvelope<Settings>>(`/settings`);
  return typeof data === "object" && data !== null && "data" in data
    ? data.data
    : data;
}
