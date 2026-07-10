import type { Settings } from "@/services/settings";

type FooterCmsProps = {
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
} | null | undefined;

export function buildFooterProps(
  cmsFooter: FooterCmsProps,
  settings: Settings | null | undefined,
): FooterCmsProps {
  const rawBusinessHours = settings?.businessHours;
  const businessHours = Array.isArray(rawBusinessHours)
    ? rawBusinessHours
    : [];

  const openHoursText =
    settings?.openHours ||
    (businessHours.length
      ? businessHours
          .filter((d) => !d.isClosed)
          .map((d) => `${d.day}: ${d.open} – ${d.close}`)
          .slice(0, 1)
          .join("")
      : undefined);

  return {
    ...(cmsFooter || {}),
    phone: cmsFooter?.phone || settings?.phone,
    email: cmsFooter?.email || settings?.email,
    location: cmsFooter?.location || settings?.address,
    shortDesc: cmsFooter?.shortDesc || settings?.shortDesc,
    openHours: cmsFooter?.openHours || openHoursText,
    logo: cmsFooter?.logo || settings?.logo,
    companyName: cmsFooter?.companyName || settings?.restaurantName,
    socials: cmsFooter?.socials || {
      facebook: settings?.socialMedia?.facebook,
      twitter: settings?.socialMedia?.twitter,
      instagram: settings?.socialMedia?.instagram,
    },
  };
}
