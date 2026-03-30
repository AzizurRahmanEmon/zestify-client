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
import {
  getTestimonials,
  type Testimonial as TestimonialType,
} from "@/services/testimonials";
import { getBlogs } from "@/services/blogs";
import { getSettings } from "@/services/settings";
import type { ProductDataType } from "@/types";

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
    getProducts({ isActive: true, limit: 100 }).catch(() => []),
    getChefs({ isActive: true, limit: 3 }).catch(() => []),
    getPartners({ isActive: true, limit: 50 }).catch(() => []),
    getTestimonials({ isActive: true, limit: 50 }).catch(() => []),
    getHomeBlogs(),
    getSettings().catch(() => ({})),
  ]);

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
      content: (settings as any)?.phone || "+(124) 566-7890",
      isLink: true,
      href: (settings as any)?.phone
        ? `tel:${(settings as any).phone}`
        : "tel:+(124)566-7890",
    },
    {
      id: 2,
      icon: "/assets/img/envelope.png",
      iconWidth: 26,
      iconHeight: 18,
      title: "Email Address",
      content: (settings as any)?.email || "info@example.com",
      isLink: true,
      href: (settings as any)?.email
        ? `mailto:${(settings as any).email}`
        : "mailto:info@example.com",
    },
    {
      id: 3,
      icon: "/assets/img/location.png",
      iconWidth: 18,
      iconHeight: 28,
      title: "Location",
      content:
        (settings as any)?.address ||
        "1403 Washington Ave, New Orleans, LA 70130",
      isLink: false,
    },
    {
      id: 4,
      icon: "/assets/img/mobile.png",
      iconWidth: 19,
      iconHeight: 31,
      title: "Work Hours",
      content:
        Array.isArray((settings as any)?.businessHours) &&
        (settings as any).businessHours.length
          ? (settings as any).businessHours
              .filter((d: any) => !d.isClosed)
              .map((d: any) => `${d.day}: ${d.open} - ${d.close}`)
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
            backgroundImage={home?.hero?.backgroundImage}
            subtitle={home?.hero?.subtitle}
            title={home?.hero?.title}
            description={home?.hero?.description}
            buttonText={home?.hero?.buttonText}
            buttonLink={home?.hero?.buttonLink}
          />
        );
      case "popular":
        return (
          <PopularProductSection
            key="popular"
            products={popularProducts}
            title={home?.popular?.title}
            subtitle={home?.popular?.subtitle}
          />
        );
      case "about":
        return (
          <AboutSection
            key="about"
            subtitle={home?.about?.subtitle}
            title={home?.about?.title}
            list={home?.about?.list}
            image1={home?.about?.image1}
            image2={home?.about?.image2}
            videoPoster={home?.about?.videoPoster}
            videoUrl={home?.about?.videoUrl}
            ctaLeftText={home?.cta?.leftText}
            ctaRightText={home?.cta?.rightText}
            ctaLeftBg={home?.cta?.leftBg}
            ctaRightBg={home?.cta?.rightBg}
          />
        );
      case "bestSelling":
        return (
          <BestSellingProductSection
            key="bestSelling"
            products={bestSellingProducts}
            title={home?.bestSelling?.title}
            subtitle={home?.bestSelling?.subtitle}
          />
        );
      case "menu":
        return (
          <MenuSection
            key="menu"
            products={menuProducts}
            title={home?.menu?.title}
            subtitle={home?.menu?.subtitle}
          />
        );
      case "team":
        return (
          <TeamSection
            key="team"
            title={home?.team?.title}
            subtitle={home?.team?.subtitle}
            members={chefs as any}
          />
        );
      case "company":
        return (
          <CompanySection
            key="company"
            title={(home as any)?.company?.title}
            partners={(partners as PartnerType[]).map((p) => ({
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
            bgImg={home?.video?.bgImg || "/assets/img/video-bg.webp"}
            videoUrl={home?.video?.videoUrl}
          />
        );
      case "testimony":
        return (
          <TestimonySection
            key="testimony"
            items={testimonials as TestimonialType[]}
            title={home?.testimony?.title}
            subtitle={home?.testimony?.subtitle}
          />
        );
      case "reservation":
        return (
          <ReservationSection
            key="reservation"
            title={home?.reservation?.title}
            subtitle={home?.reservation?.subtitle}
            bgImg={home?.reservation?.bgImg}
            contactInfo={reservationContact}
          />
        );
      case "blog":
        return (
          <BlogSection
            key="blog"
            blogs={(blogs as any[])?.map((b) => ({
              id: b._id,
              _id: b._id,
              title: b.title,
              img: b.img,
              link: b.link || b._id,
            }))}
            title={home?.blog?.title}
            subtitle={home?.blog?.subtitle}
          />
        );
      default:
        return null;
    }
  });
  return (
    <MainLayout
      header={(home as any)?.header}
      insta={(home as any)?.insta}
      footer={(home as any)?.footer}
    >
      {sections}
    </MainLayout>
  );
};

export default HomePage;
