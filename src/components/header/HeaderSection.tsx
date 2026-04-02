"use client";
import MainMenuArea from "./MainMenuArea";
import { useCustomContext } from "@/context/context";
import HeaderSearchForm from "@/components/form/HeaderSearchForm";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserAuthButton from "./UserAuthButton";
import { clearCustomerSession, getCurrentCustomer } from "@/lib/auth";

interface Props {
  logo?: string;
  topbarText?: string;
  email?: string;
  location?: string;
}

const HeaderSection = ({
  logo = "/assets/img/logo.png",
  topbarText = "100% Secure delivery without contacting the courier",
  email = "info@example.com",
  location = "28 Street, New York, USA",
}: Props) => {
  const {
    openCartModal,
    openWishlistModal,
    totalCartQuantity,
    totalWishlistQuantity,
    toggleMobileMenu,
  } = useCustomContext();
  const [customer, setCustomer] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setCustomer(getCurrentCustomer());
    const handler = () => setCustomer(getCurrentCustomer());
    window.addEventListener("auth:changed", handler);
    return () => window.removeEventListener("auth:changed", handler);
  }, []);
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };
  const handleLogout = () => {
    clearCustomerSession();
    setDropdownOpen(false);
    router.push("/");
  };
  return (
    <header>
      <div className="flex justify-between w-full shadow-sm top-0 fixed z-99">
        <div className="w-50 sm:w-65 lg:w-87.5 2xl:w-92.5 h-23.75 sm:h-28.75 lg:h-37.5 relative shrink-0 z-20 bg-white">
          <Link href="/" aria-label="Go to homepage">
            <Image
              width={370}
              height={169}
              src={logo}
              alt="Zestify logo"
              className="absolute top-0 left-0 w-full h-24.75 sm:h-30 lg:h-40.25 2xl:h-42.25 object-cover"
            />
          </Link>
        </div>
        <div className="flex-1 -ml-px z-20">
          <div className="h-12.5 lg:h-16.25 flex items-center bg-[#B1133A] text-white justify-end xl:justify-between gap-8 2xl:px-20 lg:px-10 px-7.5 xl:text-sm 2xl:text-base">
            <div className="hidden xl:flex items-center gap-1">
              <Image width={14} height={22} src="/assets/img/fire.png" alt="" />
              <p className="pl-1 mt-1">{topbarText}</p>
            </div>
            <span
              className="hidden md:block"
              aria-label={`Location: ${location}`}
            >
              <i className="fa-regular fa-location-dot pr-1"></i>
              <span>{location}</span>
            </span>
            <a href={`mailto:${email}`} className="hidden sm:block">
              <i className="fa-regular fa-envelope pr-1"></i>
              <span>{email}</span>
            </a>
          </div>
          <div className="bg-white h-[calc(100%-50px)] lg:h-[calc(100%-65px)] flex justify-end xl:justify-between items-center 2xl:px-20 lg:px-10 px-7.5">
            <div className="main-menu" id="mainMenu">
              <MainMenuArea />
              <div className="flex items-center gap-6 pr-2.5">
                <HeaderSearchForm />
                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    aria-label="Open wishlist"
                    className="relative w-6"
                    onClick={openWishlistModal}
                  >
                    <Image
                      alt=""
                      loading="lazy"
                      width="23"
                      height="23"
                      src="/assets/img/heart.png"
                    />
                    <span className="bg-zPink text-white w-4.5 h-4.5 rounded-full absolute -top-2.5 -right-2.5 flex items-center justify-center text-sm">
                      {totalWishlistQuantity}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Open cart"
                    className="relative w-6"
                    onClick={openCartModal}
                  >
                    <Image
                      alt=""
                      loading="lazy"
                      width="23"
                      height="21"
                      src="/assets/img/shopping-cart.png"
                    />
                    <span className="bg-zPink text-white w-4.5 h-4.5 rounded-full absolute -top-2.5 -right-2.5 flex items-center justify-center text-sm">
                      {totalCartQuantity}
                    </span>
                  </button>
                  <UserAuthButton
                    toggleDropdown={toggleDropdown}
                    dropdownOpen={dropdownOpen}
                    isLoggedIn={!!customer}
                    user={{
                      name: customer?.name || "Guest",
                      email: customer?.email || "",
                      avatar: null,
                    }}
                    handleLogout={handleLogout}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label="Toggle mobile menu"
              className="mobile-menu-icon"
              id="mobileMenuBtn"
              onClick={toggleMobileMenu}
            >
              <i className="fa-regular fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
