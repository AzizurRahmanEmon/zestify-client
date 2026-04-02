"use client";

import { useMemo, useState } from "react";
import { headerMenuItems } from "@/data";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  style?: string;
  variant?: string;
}

const MainMenuArea = ({ style, variant }: Props) => {
  const [isActiveDropdown, setIsActiveDropdown] = useState<string>("");
  const pathname = usePathname();

  const toggleDropdown = (id: string) => {
    if (window.innerWidth < 1024) {
      setIsActiveDropdown(id === isActiveDropdown ? "" : id);
    }
  };

  // Check if link is active (exact match only, not partial)
  const isLinkActive = (href: string) => {
    return pathname === href;
  };

  // Memoize menu items to avoid unnecessary re-renders
  const memoizedMenuItems = useMemo(() => headerMenuItems, []);

  return (
    <ul
      className={`flex items-center ${
        variant === "two" ? "lg:gap-5 gap-0" : "text-gray-800"
      } ${style ? style : "gap-5"} font-normal`}
    >
      {memoizedMenuItems.map((item) => (
        <li
          key={item.id}
          className="relative group transition-all duration-300"
        >
          {item.href ? (
            <Link
              href={item.href}
              className={`menu-link ${
                variant ? "hover:text-zOrange" : "hover:text-zPink"
              } transition-colors duration-300 ${
                isLinkActive(item.href)
                  ? variant
                    ? "text-zOrange"
                    : "text-zPink"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ) : (
            <button
              type="button"
              className={`flex items-center justify-between py-2 px-1 ${
                variant ? "hover:text-zOrange" : "hover:text-zPink"
              } transition-colors duration-300`}
              onClick={() => toggleDropdown(item.id)}
              aria-expanded={isActiveDropdown === item.id}
            >
              <span>{item.label}</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                  isActiveDropdown === item.id ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}

          {item.children && (
            <ul
              className={`absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 ${
                isActiveDropdown === item.id ? "opacity-100 visible" : ""
              }`}
            >
              {item.children.map((child, index) => (
                <li key={`${item.id}-${index}`}>
                  <Link
                    href={child.href}
                    className={`menu-dropdown-link ${
                      variant === "two"
                        ? "hover:bg-zOrange"
                        : variant === "three"
                          ? "hover:bg-linear-[135deg,#dc2626_0%,#ea580c_50%,#f59e0b_100%]"
                          : "hover:bg-zPink"
                    } hover:text-white transition-[color,opacity] duration-200 ${
                      isLinkActive(child.href)
                        ? variant === "two"
                          ? "bg-zOrange text-white"
                          : variant === "three"
                            ? "coffee-gradient text-white"
                            : "bg-zPink text-white"
                        : ""
                    }`}
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MainMenuArea;
