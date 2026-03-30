import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import MainLayout from "@/components/layout/MainLayout";
import MenuSection2 from "@/components/menu/MenuSection2";
import MenuSection3 from "@/components/menu/MenuSection3";
import { getProducts } from "@/services/products";
import { getSettings } from "@/services/settings";
import { getHomePage, getMenuPage } from "@/services/pages";

const MenuPage = async () => {
  const [settings, home, menuConfig] = await Promise.all([
    getSettings().catch(() => ({})),
    getHomePage().catch(() => null),
    getMenuPage().catch(() => null),
  ]);
  const coffeeCategory =
    (menuConfig as any)?.menuPage?.coffeeCategory || "coffee";
  const grillCategory = (menuConfig as any)?.menuPage?.grillCategory || "grill";
  const [featuredCoffee, featuredGrill, sixProducts] = await Promise.all([
    getProducts({
      category: coffeeCategory,
      isActive: true,
      isFeatured: true,
      limit: 50,
    }).catch(() => []),
    getProducts({
      category: grillCategory,
      isActive: true,
      isFeatured: true,
      limit: 50,
    }).catch(() => []),
    getProducts({ isActive: true, limit: 6 }).catch(() => []),
  ]);
  return (
    <MainLayout
      header={(home as any)?.header}
      insta={(home as any)?.insta}
      footer={(home as any)?.footer}
    >
      <BreadcrumbSection title="Menu" />
      <MenuSection2
        coffeeTitle={
          (menuConfig as any)?.menuPage?.coffeeTitle || "Coffee Menu"
        }
        grillTitle={(menuConfig as any)?.menuPage?.grillTitle || "Grill Food"}
        coffeeProducts={featuredCoffee}
        grillProducts={featuredGrill}
        coffeeSubtitle={(menuConfig as any)?.menuPage?.coffeeSubtitle}
        grillSubtitle={(menuConfig as any)?.menuPage?.grillSubtitle}
        coffeeImage={
          (menuConfig as any)?.menuPage?.coffeeImage ||
          "/assets/img/coffee-menu-banner.png"
        }
        grillImage={
          (menuConfig as any)?.menuPage?.grillImage ||
          "/assets/img/grill-menu-banner.png"
        }
      />
      <MenuSection3
        products={sixProducts}
        businessHours={(settings as any)?.businessHours}
      />
    </MainLayout>
  );
};

export default MenuPage;
