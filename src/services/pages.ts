import { request } from "@/lib/api";

export type HomePageContent = {
  slug: string;
  sectionsOrder: string[];
  header?: any;
  hero?: any;
  about?: any;
  cta?: any;
  popular?: any;
  bestSelling?: any;
  menu?: any;
  team?: any;
  company?: any;
  video?: any;
  testimony?: any;
  reservation?: any;
  blog?: any;
  insta?: any;
  footer?: any;
};

export async function getHomePage(): Promise<HomePageContent | null> {
  try {
    const data = await request<{ success: boolean; data: HomePageContent }>(
      `/pages/home`,
    );
    return ((data as any)?.data ?? data) as HomePageContent | null;
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
    const data = await request<{ success: boolean; data: MenuPageContent }>(
      `/pages/menu`,
    );
    return ((data as any)?.data ?? data) as MenuPageContent | null;
  } catch {
    return null;
  }
}
