import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import MainLayout from "@/components/layout/MainLayout";
import MenuSection2 from "@/components/menu/MenuSection2";
import MenuSection3 from "@/components/menu/MenuSection3";
import { getProducts } from "@/services/products";
import { getSettings } from "@/services/settings";
import { getHomePage, getMenuPage } from "@/services/pages";

const MenuPage = async () => {
  const [settings, home, menuConfig] = await Promise.all([
    getSettings().catch(() => null),
    getHomePage().catch(() => null),
    getMenuPage().catch(() => null),
  ]);
  const coffeeCategory = menuConfig?.menuPage?.coffeeCategory || "coffee";
  const grillCategory = menuConfig?.menuPage?.grillCategory || "grill";
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
    <MainLayout header={home?.header} insta={home?.insta} footer={home?.footer}>
      <BreadcrumbSection title="Menu" />
      <MenuSection2
        coffeeTitle={menuConfig?.menuPage?.coffeeTitle || "Coffee Menu"}
        grillTitle={menuConfig?.menuPage?.grillTitle || "Grill Food"}
        coffeeProducts={featuredCoffee}
        grillProducts={featuredGrill}
        coffeeSubtitle={menuConfig?.menuPage?.coffeeSubtitle}
        grillSubtitle={menuConfig?.menuPage?.grillSubtitle}
        coffeeImage={
          menuConfig?.menuPage?.coffeeImage ||
          "/assets/img/coffee-menu-banner.png"
        }
        grillImage={
          menuConfig?.menuPage?.grillImage ||
          "/assets/img/grill-menu-banner.png"
        }
      />
      <MenuSection3
        products={sixProducts}
        businessHours={settings?.businessHours}
      />
    </MainLayout>
  );
};

export default MenuPage;
