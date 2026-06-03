type HeaderMenuChild = {
  href: string;
  label: string;
  auth?: "guest" | "logged_in";
};

type HeaderMenuItem = {
  id: string;
  label: string;
  href?: string;
  children?: readonly HeaderMenuChild[];
};

const headerMenuItems: HeaderMenuItem[] = [
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
      { href: "/chef/gordon-martinez", label: "Chef Details" },
      { href: "/login", label: "Login", auth: "guest" },
      { href: "/register", label: "Register", auth: "guest" },
      { href: "/dashboard", label: "Dashboard", auth: "logged_in" },
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
        href: "/blog/the-art-of-perfect-pizza-making",
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

const getHeaderMenuItems = (isLoggedIn = false): HeaderMenuItem[] => {
  return headerMenuItems.map((item) => {
    if (!("children" in item)) {
      return {
        id: item.id,
        label: item.label,
        href: item.href,
      };
    }

    const children = item.children ?? [];
    const filteredChildren = children.filter((child: HeaderMenuChild) => {
      if (child.auth === "guest") return !isLoggedIn;
      if (child.auth === "logged_in") return isLoggedIn;
      return true;
    });

    return {
      id: item.id,
      label: item.label,
      children: filteredChildren.map(
        ({ auth: _auth, ...child }: HeaderMenuChild) => child,
      ),
    };
  });
};

const locationOptions = [
  {
    code: "us",
    label: "United States",
    states: [
      {
        code: "CA",
        label: "California",
        cities: ["Los Angeles", "San Diego", "San Francisco"],
      },
      { code: "TX", label: "Texas", cities: ["Houston", "Dallas", "Austin"] },
      {
        code: "NY",
        label: "New York",
        cities: ["New York City", "Buffalo", "Rochester"],
      },
      { code: "FL", label: "Florida", cities: ["Miami", "Orlando", "Tampa"] },
    ],
  },
  {
    code: "de",
    label: "Germany",
    states: [
      { code: "BE", label: "Berlin", cities: ["Berlin"] },
      { code: "BY", label: "Bavaria", cities: ["Munich", "Nuremberg"] },
      {
        code: "NW",
        label: "North Rhine-Westphalia",
        cities: ["Cologne", "Düsseldorf"],
      },
      { code: "HH", label: "Hamburg", cities: ["Hamburg"] },
    ],
  },
  {
    code: "uk",
    label: "United Kingdom",
    states: [
      {
        code: "ENG",
        label: "England",
        cities: ["London", "Manchester", "Birmingham"],
      },
      { code: "SCT", label: "Scotland", cities: ["Edinburgh", "Glasgow"] },
      { code: "WLS", label: "Wales", cities: ["Cardiff", "Swansea"] },
      { code: "NIR", label: "Northern Ireland", cities: ["Belfast"] },
    ],
  },
  {
    code: "fr",
    label: "France",
    states: [
      { code: "IDF", label: "Île-de-France", cities: ["Paris"] },
      {
        code: "PAC",
        label: "Provence-Alpes-Côte d’Azur",
        cities: ["Marseille", "Nice"],
      },
      {
        code: "ARA",
        label: "Auvergne-Rhône-Alpes",
        cities: ["Lyon", "Grenoble"],
      },
      { code: "NAQ", label: "Nouvelle-Aquitaine", cities: ["Bordeaux"] },
    ],
  },
] as const;

const paymentOptions = [
  { id: 1, value: "stripe", label: "💳 Stripe" },
  { id: 2, value: "paypal", label: "💳 PayPal" },
  { id: 3, value: "cod", label: "💵 Cash on Delivery" },
] as const;

const avatarColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-teal-500",
] as const;

const blogFeatures = [
  {
    id: 1,
    feature: "Fresh Environment",
  },
  {
    id: 2,
    feature: "Gourmet Mushroom Risotto",
  },
  {
    id: 3,
    feature: "Margarita Shrimp Tacos",
  },
  {
    id: 4,
    feature: "A Beautiful Sunday Morning",
  },
  {
    id: 5,
    feature: "In Mattis Scelerisque Magna",
  },
  {
    id: 6,
    feature: "Honey-Glazed Salmon",
  },
  {
    id: 7,
    feature: "Grilled Ribeye Steak",
  },
] as const;

const blogSocials = [
  {
    id: 1,
    icon: "fa-facebook-f",
    color: "hover:text-blue-600",
    label: "Facebook",
  },
  {
    id: 2,
    icon: "fa-instagram",
    color: "hover:text-pink-600",
    label: "Instagram",
  },
  {
    id: 3,
    icon: "fa-twitter",
    color: "hover:text-blue-400",
    label: "Twitter",
  },
  {
    id: 4,
    icon: "fa-linkedin",
    color: "hover:text-blue-700",
    label: "LinkedIn",
  },
] as const;
const footerNavigations = [
  { id: 1, href: "/shop", text: "Shop" },
  { id: 2, href: "/blog", text: "Blog" },
  { id: 3, href: "/contact", text: "Contact" },
  { id: 4, href: "/gallery", text: "Gallery" },
  { id: 5, href: "/reservation", text: "Reservation" },
] as const;
const footerServices = [
  { id: 1, href: "/services", text: "Services" },
  { id: 2, href: "/menu", text: "Menu" },
  { id: 3, href: "/about", text: "About Us" },
  { id: 4, href: "/login", text: "Join us" },
] as const;
const footerSocials = [
  {
    id: 1,
    name: "Facebook",
    icon: "fa-brands fa-facebook-f",
    href: "https://facebook.com",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "Twitter",
    icon: "fa-brands fa-twitter",
    href: "https://twitter.com",
    color: "from-sky-400 to-sky-500",
  },
  {
    id: 3,
    name: "Vine",
    icon: "fa-brands fa-vine",
    href: "https://vine.co",
    color: "from-green-500 to-green-600",
  },
  {
    id: 4,
    name: "Instagram",
    icon: "fa-brands fa-instagram",
    href: "https://instagram.com",
    color: "from-zPink/60 to-purple-600",
  },
] as const;

const teamValues = [
  {
    id: 1,
    icon: "fa-solid fa-fire-burner",
    title: "Passionate Cooking",
    desc: "Every dish is crafted with love and dedication",
    gradient: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
  },
  {
    id: 2,
    icon: "fa-solid fa-star",
    title: "Quality First",
    desc: "We use only the finest ingredients & techniques",
    gradient: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50",
  },
  {
    id: 3,
    icon: "fa-solid fa-handshake",
    title: "Teamwork",
    desc: "Collaboration makes our kitchen run smoothly",
    gradient: "from-blue-500 to-purple-500",
    bgColor: "bg-blue-50",
  },
  {
    id: 4,
    icon: "fa-solid fa-palette",
    title: "Creativity",
    desc: "Innovation in every recipe and presentation",
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
  },
] as const;

export {
  headerMenuItems,
  getHeaderMenuItems,
  locationOptions,
  paymentOptions,
  avatarColors,
  blogFeatures,
  blogSocials,
  footerNavigations,
  footerServices,
  footerSocials,
  teamValues,
};
