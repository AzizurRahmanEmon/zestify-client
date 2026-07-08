// lib/site.ts
function requireSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is required but not set. Add it to your environment (e.g. client-app/.env.local) before starting the app.",
    );
  }
  return url.replace(/\/+$/, "");
}

export const SITE_URL = requireSiteUrl();
