import Link from "next/link";
import Image from "next/image";
interface Props {
  toggleDropdown: () => void;
  dropdownOpen: boolean;
  isLoggedIn: boolean;
  user: {
    name: string;
    email: string;
    avatar: string | null;
  };
  handleLogout: () => void;
}
const UserAuthButton = ({
  toggleDropdown,
  dropdownOpen,
  isLoggedIn,
  user,
  handleLogout,
}: Props) => {
  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-zPink transition-colors duration-200"
        >
          <i className="fa-regular fa-user text-sm"></i>
          <span>Login</span>
        </Link>
        <Link
          href="/register"
          className="hidden md:flex ar-btn h-max py-2 px-4 text-sm font-medium"
        >
          Sign Up
        </Link>
        {/* Mobile: icon only */}
        <Link
          href="/login"
          className="flex sm:hidden items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:text-zPink hover:border-zPink transition-colors duration-200"
          aria-label="Login"
        >
          <i className="fa-regular fa-user text-sm"></i>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center gap-2 group"
        aria-label="User menu"
        aria-expanded={dropdownOpen}
        aria-haspopup="menu"
        aria-controls="user-menu"
      >
        {/* Avatar */}
        <div className="w-9 h-9 capitalize rounded-full bg-zPink text-white flex items-center justify-center font-bold text-sm border-2 border-pink-200 group-hover:border-zPink transition-colors duration-200 overflow-hidden shrink-0">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          ) : (
            <span>{user.name.charAt(0)}</span>
          )}
        </div>
        {/* Name — hidden on small screens */}
        <div className="hidden lg:flex flex-col items-start leading-tight">
          <span className="text-xs text-gray-500">Welcome back</span>
          <span className="text-sm font-semibold text-gray-800 group-hover:text-zPink transition-colors duration-200 max-w-24 truncate">
            {user.name.split(" ")[0]}
          </span>
        </div>
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close user menu"
            className="fixed inset-0 z-40"
            onClick={toggleDropdown}
          />

          <div
            id="user-menu"
            role="menu"
            className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {/* User info header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            {/* Menu items */}
            <div className="py-2">
              <Link
                href="/dashboard"
                onClick={toggleDropdown}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-zPink transition-colors duration-150"
              >
                <i className="fa-solid fa-chart-line w-4 text-center"></i>
                <span>My Dashboard</span>
              </Link>

              <Link
                href="/dashboard?tab=orders"
                onClick={toggleDropdown}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-zPink transition-colors duration-150"
              >
                <i className="fa-solid fa-shopping-bag w-4 text-center"></i>
                <span>My Orders</span>
              </Link>

              <Link
                href="/wishlist"
                onClick={toggleDropdown}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-zPink transition-colors duration-150"
              >
                <i className="fa-solid fa-heart w-4 text-center"></i>
                <span>Wishlist</span>
              </Link>

              <Link
                href="/dashboard?tab=settings"
                onClick={toggleDropdown}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-zPink transition-colors duration-150"
              >
                <i className="fa-solid fa-gear w-4 text-center"></i>
                <span>Settings</span>
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100 py-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150"
              >
                <i className="fa-solid fa-right-from-bracket w-4 text-center"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default UserAuthButton;
