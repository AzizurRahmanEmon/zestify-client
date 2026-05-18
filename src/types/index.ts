export type BlogDataTypes = {
  _id: string;
  title: string;
  img: string;
  descImg?: string;
  date?: string;
  link: string;
  category?: string;
  tags?: string[];
  excerpt?: string;
  content?: string;
  author?: { name?: string };
  readTime?: number;
};

export type ProductDataType = {
  _id?: string;
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  description: string;
  image: string;
  images?: string[];
  width: number;
  height: number;
  rating: {
    stars: number;
    reviews: number;
  };
  slug: string;
  category: string;
  tags: string[];
  quantity: number;
  stock?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  preparationTime?: number;
  ingredients?: string[];
  allergens?: string[];
  nutritionInfo?: {
    servingSize?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
};

export type TeamDataType = {
  id: number;
  imgSrc: string;
  altText: string;
  name: string;
  profileLink: string;
  specialty: string;
  title: string;
  label: string;
  socialLinks: {
    linkedin: string;
    facebook: string;
    twitter: string;
  };
};

export type GalleryDataType = {
  id: number;
  img: string;
  width: number;
  height: number;
  title: string;
  desc: string;
  span: string;
};

export type Customer = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints?: number;
  isActive?: boolean;
  createdAt?: string;
};

export type DashboardTab =
  | "overview"
  | "orders"
  | "favorites"
  | "addresses"
  | "settings";

export type DashboardCustomer = {
  name?: string;
  email?: string;
  phone?: string;
  loyaltyPoints?: number;
  token?: string;
  [key: string]: unknown;
};

export type DashboardStats = {
  totalOrders: number;
  totalSpent: number;
};

export type DashboardProduct = {
  _id: string;
  name: string;
  image?: string;
  price?: number;
  category?: string;
  slug?: string;
};

export type DashboardOrderItem = {
  name: string;
  quantity: number;
  price: number;
  product?: DashboardProduct | string | null;
};

export type DashboardOrder = {
  _id: string;
  orderNumber: string;
  status: "delivered" | "pending" | string;
  createdAt: string;
  items: DashboardOrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  totalAmount: number;
  deliveryAddress?: string;
};

export type DashboardAddress = {
  _id: string;
  label: string;
  address: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  isDefault: boolean;
};

export type DashboardFavoriteItem = {
  _id: string;
  name: string;
  image?: string;
  price?: number;
  category?: string;
  slug?: string;
};

export type DashboardAddressForm = {
  label: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
};
