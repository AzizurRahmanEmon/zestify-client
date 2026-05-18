"use client";
import { useEffect, useState } from "react";
import { getHeaderMenuItems } from "@/data";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clearCustomerSession, getCurrentCustomer } from "@/lib/auth";

interface Props {
  isOpen: boolean;
  toggleMenu: () => void;
}

type MenuChild = {
  href: string;
  label: string;
};

type MenuItem =
  | {
      id: string;
      label: string;
      href: string;
      children?: never;
    }
  | {
      id: string;
      label: string;
      children: readonly MenuChild[];
      href?: never;
    };

const hasHref = (item: MenuItem): item is Extract<MenuItem, { href: string }> =>
  "href" in item;

const hasChildren = (
  item: MenuItem,
): item is Extract<MenuItem, { children: readonly MenuChild[] }> =>
  "children" in item;

const MobileMenuModal = ({ isOpen, toggleMenu }: Props) => {
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [customer, setCustomer] =
    useState<ReturnType<typeof getCurrentCustomer>>(null);
  const router = useRouter();

  useEffect(() => {
    setCustomer(getCurrentCustomer());

    const handler = () => setCustomer(getCurrentCustomer());
    window.addEventListener("auth:changed", handler);

    return () => window.removeEventListener("auth:changed", handler);
  }, []);

  const toggleActiveMenu = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? "" : menuId);
  };

  const handleMenuItemClick = () => {
    toggleMenu();
    setActiveMenu("");
  };

  const handleLogout = () => {
    clearCustomerSession();
    handleMenuItemClick();
    router.push("/");
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        className={`ar-modal-overlay ${isOpen ? "show" : "hide"}`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu Modal */}
      <div className={`ar-mobile-menu-modal ${isOpen ? "show" : ""}`}>
        <div className="overflow-y-scroll">
          {/* Header */}
          <div className="flex justify-between items-center py-6 px-6 border-b border-white/10">
            <Link href="/" onClick={handleMenuItemClick}>
              <Image
                width={77}
                height={48}
                src="/assets/img/logo-main.png"
                alt="Zestify"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <button
              className="w-12 h-12 text-white/80 hover:text-white inline-flex items-center justify-center text-2xl hover:bg-white/5 rounded-xl transition-all duration-300"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <i className="fa-regular fa-xmark"></i>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-6 py-8">
            <ul className="md:space-y-1">
              {(getHeaderMenuItems(!!customer) as readonly MenuItem[]).map(
                (item) => (
                  <li key={item.id}>
                    {hasChildren(item) ? (
                      // Menu item with dropdown
                      <div>
                        <button
                          className="w-full flex items-center justify-between text-white py-4 px-4 hover:bg-white/5 rounded-2xl transition-all duration-300 group"
                          onClick={() => toggleActiveMenu(item.id)}
                        >
                          <span className="text-lg font-medium tracking-wide">
                            {item.label}
                          </span>
                          <i
                            className={`fa-regular fa-chevron-down text-sm transition-transform duration-300 text-white/60 group-hover:text-white/80 ${
                              activeMenu === item.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Dropdown Menu */}
                        <div
                          className={`mobile-menu-dropdown ${
                            activeMenu === item.id ? "show" : ""
                          } ml-4 mt-2`}
                        >
                          <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                            {item.children.map(
                              (child: MenuChild, index: number) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={handleMenuItemClick}
                                  className={`block px-6 py-4 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300 ${
                                    index !== item.children!.length - 1
                                      ? "border-b border-white/5"
                                      : ""
                                  }`}
                                >
                                  <span className="font-medium tracking-wide">
                                    {child.label}
                                  </span>
                                </Link>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Single menu item
                      <Link
                        href={hasHref(item) ? item.href : "/"}
                        onClick={handleMenuItemClick}
                        className="block text-white py-4 px-4 hover:bg-white/5 rounded-2xl transition-all duration-300"
                      >
                        <span className="text-lg font-medium tracking-wide">
                          {item.label}
                        </span>
                      </Link>
                    )}
                  </li>
                ),
              )}
            </ul>
          </nav>

          {customer && (
            <div className="px-6 pb-6">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-full bg-zPink text-white flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden">
                    <span>{customer.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white/70">Welcome back</p>
                    <p className="text-lg font-semibold text-white truncate">
                      {customer.name}
                    </p>
                    <p className="text-xs text-white/60 truncate">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <div className="py-2">
                  <Link
                    href="/dashboard"
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white/85 hover:bg-white/10 hover:text-white transition-colors duration-150"
                  >
                    <i className="fa-solid fa-chart-line w-4 text-center"></i>
                    <span>My Dashboard</span>
                  </Link>

                  <Link
                    href="/dashboard?tab=orders"
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white/85 hover:bg-white/10 hover:text-white transition-colors duration-150"
                  >
                    <i className="fa-solid fa-shopping-bag w-4 text-center"></i>
                    <span>My Orders</span>
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white/85 hover:bg-white/10 hover:text-white transition-colors duration-150"
                  >
                    <i className="fa-solid fa-heart w-4 text-center"></i>
                    <span>Wishlist</span>
                  </Link>

                  <Link
                    href="/dashboard?tab=settings"
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white/85 hover:bg-white/10 hover:text-white transition-colors duration-150"
                  >
                    <i className="fa-solid fa-gear w-4 text-center"></i>
                    <span>Settings</span>
                  </Link>
                </div>

                <div className="border-t border-white/10 p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-150 rounded-xl"
                  >
                    <i className="fa-solid fa-right-from-bracket w-4 text-center"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Section */}
          <div className="px-6 py-6 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              {/* Social Links */}
              <div className="flex space-x-4 justify-center">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Facebook"
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all duration-300"
                >
                  <i className="fa-brands fa-facebook-f text-lg"></i>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Instagram"
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all duration-300"
                >
                  <i className="fa-brands fa-instagram text-lg"></i>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Twitter"
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all duration-300"
                >
                  <i className="fa-brands fa-twitter text-lg"></i>
                </a>
              </div>

              {/* Contact Info */}
              <div className="text-center space-y-2">
                <p className="text-white/60 text-sm font-medium">
                  Call us: +1 234 567 890
                </p>
                <p className="text-white/40 text-xs">
                  © {new Date().getFullYear()} Zestify. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenuModal;
