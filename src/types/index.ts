export type BlogDataTypes = {
  id: number;
  excerpt: string;
  img: string;
  descImg: string;
  date: string;
  title: string;
  link: string;
  category: string;
  tags: string[];
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
