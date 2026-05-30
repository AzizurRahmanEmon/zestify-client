import BannerSection from "@/components/banner/BannerSection";
import PopularProductSection from "@/components/products/PopularProductSection";
import AboutSection from "@/components/about/AboutSection";
import BestSellingProductSection from "@/components/products/BestSellingProductSection";
import MenuSection from "@/components/menu/MenuSection";
import TeamSection from "@/components/team/TeamSection";
import CompanySection from "@/components/company/CompanySection";
import VideoSection from "@/components/video/VideoSection";
import TestimonySection from "@/components/testimony/TestimonySection";
import ReservationSection from "@/components/reservation/ReservationSection";
import BlogSection from "@/components/blog/BlogSection";
import MainLayout from "@/components/layout/MainLayout";
import { getFeaturedProducts, getProducts } from "@/services/products";
import { getHomePage } from "@/services/pages";
import { getChefs } from "@/services/chefs";
import { getPartners, type Partner as PartnerType } from "@/services/partners";
import { getTestimonials } from "@/services/testimonials";
import { getBlogs } from "@/services/blogs";
import { getSettings } from "@/services/settings";
import { buildFooterProps } from "@/lib/buildFooterProps";
import type { ProductDataType } from "@/types";

type HeroSection = {
  backgroundImage?: string;
  subtitle?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
};

type TextSection = {
  title?: string;
  subtitle?: string;
};

type AboutSectionContent = TextSection & {
  list?: string[];
  image1?: string;
  image2?: string;
  videoPoster?: string;
  videoUrl?: string;
};

type CtaSectionContent = {
  leftText?: string;
  rightText?: string;
  leftBg?: string;
  rightBg?: string;
};

type VideoSectionContent = {
  bgImg?: string;
  videoUrl?: string;
};

type CompanySectionContent = {
  title?: string;
};

type ReservationSectionContent = TextSection & {
  bgImg?: string;
};

async function getHomeBlogs() {
  const published = await getBlogs({
    status: "published",
    limit: 3,
    sort: "-date",
  }).catch(() => []);

  if (published.length) return published;

  return getBlogs({ limit: 3, sort: "-date" }).catch(() => []);
}

const HomePage = async () => {
  const [
    home,
    featured,
    allProducts,
    chefs,
    partners,
    testimonials,
    blogs,
    settings,
  ] = await Promise.all([
    getHomePage().catch(() => null),
    getFeaturedProducts().catch(() => []),
    getProducts({ isActive: true, limit: 24 }).catch(() => []),
    getChefs({ isActive: true, limit: 3 }).catch(() => []),
    getPartners({ isActive: true, limit: 12 }).catch(() => []),
    getTestimonials({ isActive: true, limit: 8 }).catch(() => []),
    getHomeBlogs(),
    getSettings().catch(() => null),
  ]);

  const hero = home?.hero as HeroSection | undefined;
  const about = home?.about as AboutSectionContent | undefined;
  const cta = home?.cta as CtaSectionContent | undefined;
  const bestSelling = home?.bestSelling as TextSection | undefined;
  const popular = home?.popular as TextSection | undefined;
  const menu = home?.menu as TextSection | undefined;
  const team = home?.team as TextSection | undefined;
  const company = home?.company as CompanySectionContent | undefined;
  const video = home?.video as VideoSectionContent | undefined;
  const testimony = home?.testimony as TextSection | undefined;
  const reservation = home?.reservation as
    | ReservationSectionContent
    | undefined;
  const blogSection = home?.blog as TextSection | undefined;

  const businessHours = Array.isArray(settings?.businessHours)
    ? settings.businessHours
    : [];

  // Compute product groupings
  const menuProducts: ProductDataType[] = (featured || [])
    .filter((p, idx, arr) => arr.findIndex((x) => x.slug === p.slug) === idx)
    .slice(0, 3);
  const popularProducts: ProductDataType[] = (allProducts || [])
    .filter((p) => (p.rating?.stars || 0) > 4)
    .slice(0, 8);
  const bestSellingProducts: ProductDataType[] = [...(allProducts || [])]
    .sort((a, b) => (b.rating?.reviews || 0) - (a.rating?.reviews || 0))
    .slice(0, 4);

  // Reservation contact info from settings
  const reservationContact = [
    {
      id: 1,
      icon: "/assets/img/mobile.png",
      iconWidth: 19,
      iconHeight: 31,
      title: "Phone Number",
      content: settings?.phone || "+(124) 566-7890",
      isLink: true,
      href: settings?.phone ? `tel:${settings.phone}` : "tel:+(124)566-7890",
    },
    {
      id: 2,
      icon: "/assets/img/envelope.png",
      iconWidth: 26,
      iconHeight: 18,
      title: "Email Address",
      content: settings?.email || "info@example.com",
      isLink: true,
      href: settings?.email
        ? `mailto:${settings.email}`
        : "mailto:info@example.com",
    },
    {
      id: 3,
      icon: "/assets/img/location.png",
      iconWidth: 18,
      iconHeight: 28,
      title: "Location",
      content:
        settings?.address || "1403 Washington Ave, New Orleans, LA 70130",
      isLink: false,
    },
    {
      id: 4,
      icon: "/assets/img/mobile.png",
      iconWidth: 19,
      iconHeight: 31,
      title: "Work Hours",
      content: businessHours.length
        ? businessHours
            .filter((d) => !d.isClosed)
            .map((d) => `${d.day}: ${d.open} - ${d.close}`)
            .join(" | ")
        : "7.00 AM - 11.15 PM",
      isLink: false,
    },
  ];

  const order: string[] = (
    home?.sectionsOrder && home.sectionsOrder.length
      ? home.sectionsOrder
      : [
          "hero",
          "popular",
          "about",
          "bestSelling",
          "menu",
          "team",
          "company",
          "video",
          "testimony",
          "reservation",
          "blog",
        ]
  ) as string[];
  const sections = order.map((key: string) => {
    switch (key) {
      case "hero":
        return (
          <BannerSection
            key="hero"
            backgroundImage={hero?.backgroundImage}
            subtitle={hero?.subtitle}
            title={hero?.title}
            description={hero?.description}
            buttonText={hero?.buttonText}
            buttonLink={hero?.buttonLink}
          />
        );
      case "popular":
        return (
          <PopularProductSection
            key="popular"
            products={popularProducts}
            title={popular?.title}
            subtitle={popular?.subtitle}
          />
        );
      case "about":
        return (
          <AboutSection
            key="about"
            subtitle={about?.subtitle}
            title={about?.title}
            list={about?.list}
            image1={about?.image1}
            image2={about?.image2}
            videoPoster={about?.videoPoster}
            videoUrl={about?.videoUrl}
            ctaLeftText={cta?.leftText}
            ctaRightText={cta?.rightText}
            ctaLeftBg={cta?.leftBg}
            ctaRightBg={cta?.rightBg}
          />
        );
      case "bestSelling":
        return (
          <BestSellingProductSection
            key="bestSelling"
            products={bestSellingProducts}
            title={bestSelling?.title}
            subtitle={bestSelling?.subtitle}
          />
        );
      case "menu":
        return (
          <MenuSection
            key="menu"
            products={menuProducts}
            title={menu?.title}
            subtitle={menu?.subtitle}
          />
        );
      case "team":
        return (
          <TeamSection
            key="team"
            title={team?.title}
            subtitle={team?.subtitle}
            members={chefs}
          />
        );
      case "company":
        return (
          <CompanySection
            key="company"
            title={company?.title}
            partners={partners.map((p: PartnerType) => ({
              icon: p.icon,
              width: p.width,
              height: p.height,
            }))}
          />
        );
      case "video":
        return (
          <VideoSection
            key="video"
            bgImg={video?.bgImg || "/assets/img/video-bg.webp"}
            videoUrl={video?.videoUrl}
          />
        );
      case "testimony":
        return (
          <TestimonySection
            key="testimony"
            items={testimonials}
            title={testimony?.title}
            subtitle={testimony?.subtitle}
          />
        );
      case "reservation":
        return (
          <ReservationSection
            key="reservation"
            title={reservation?.title}
            subtitle={reservation?.subtitle}
            bgImg={reservation?.bgImg}
            contactInfo={reservationContact}
          />
        );
      case "blog":
        return (
          <BlogSection
            key="blog"
            blogs={blogs}
            title={blogSection?.title}
            subtitle={blogSection?.subtitle}
          />
        );
      default:
        return null;
    }
  });
  const footerFromSettings = buildFooterProps(home?.footer, settings);

  return (
    <MainLayout
      header={home?.header}
      insta={home?.insta}
      footer={footerFromSettings}
    >
      {sections}
    </MainLayout>
  );
};

export default HomePage;
