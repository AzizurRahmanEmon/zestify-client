import { request } from "@/lib/api";

export type HomePageHeader = {
  variant?: string;
  logo?: string;
  topbarText?: string;
  email?: string;
  location?: string;
};

export type HomePageInsta = {
  variant?: string;
  images?: string[];
  link?: string;
};

export type HomePageFooter = {
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

export type HomePageContent = {
  slug: string;
  sectionsOrder: string[];
  header?: HomePageHeader;
  hero?: Record<string, unknown>;
  about?: Record<string, unknown>;
  cta?: Record<string, unknown>;
  popular?: Record<string, unknown>;
  bestSelling?: Record<string, unknown>;
  menu?: Record<string, unknown>;
  team?: Record<string, unknown>;
  company?: Record<string, unknown>;
  video?: Record<string, unknown>;
  testimony?: Record<string, unknown>;
  reservation?: Record<string, unknown>;
  blog?: Record<string, unknown>;
  insta?: HomePageInsta;
  footer?: HomePageFooter;
};

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

function hasData<T>(value: T | ApiEnvelope<T>): value is ApiEnvelope<T> {
  return typeof value === "object" && value !== null && "data" in value;
}

export async function getHomePage(): Promise<HomePageContent | null> {
  try {
    const data = await request<HomePageContent | ApiEnvelope<HomePageContent>>(
      `/pages/home`,
    );
    return hasData(data) ? data.data : data;
  } catch {
    return null;
  }
}

export type MenuPageContent = {
  slug: string;
  menuPage?: {
    coffeeTitle?: string;
    coffeeSubtitle?: string;
    coffeeCategory?: string;
    coffeeImage?: string;
    grillTitle?: string;
    grillSubtitle?: string;
    grillCategory?: string;
    grillImage?: string;
    section2Title?: string;
    section2Subtitle?: string;
  };
};

export async function getMenuPage(): Promise<MenuPageContent | null> {
  try {
    const data = await request<MenuPageContent | ApiEnvelope<MenuPageContent>>(
      `/pages/menu`,
    );
    return hasData(data) ? data.data : data;
  } catch {
    return null;
  }
}
