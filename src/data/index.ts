const headerMenuItems = [
  {
    id: "homeItem",
    label: "Home",
    href: "/",
  },
  {
    id: "menuItem",
    label: "Menu",
    href: "/menu",
  },
  {
    id: "pagesMenu",
    label: "Pages",
    children: [
      { href: "/about", label: "About" },
      { href: "/gallery", label: "Gallery" },
      { href: "/reservation", label: "Reservation" },
      { href: "/services", label: "Services" },
      { href: "/chef", label: "Chef" },
      { href: "/chef/dora-schwartz", label: "Chef Details" },
      { href: "/login", label: "Login" },
      { href: "/register", label: "Register" },
    ],
  },
  {
    id: "shopMenu",
    label: "Shop",
    children: [
      { href: "/shop", label: "Shop" },
      { href: "/shop/chicken-fried-rice", label: "Product Details" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/cart", label: "Cart" },
      { href: "/checkout", label: "Checkout" },
    ],
  },
  {
    id: "blogMenu",
    label: "Blog",
    children: [
      { href: "/blog", label: "Blog" },
      {
        href: "/blog/only-pure-ingredients-enhance-flavor",
        label: "Blog Details",
      },
    ],
  },
  {
    id: "contactItem",
    label: "Contact",
    href: "/contact",
  },
];

export { headerMenuItems };
