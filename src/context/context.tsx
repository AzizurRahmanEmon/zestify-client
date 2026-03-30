"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { ProductDataType } from "@/types";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/api";

interface ContextData {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  isCartModalOpen: boolean;
  openCartModal: () => void;
  closeCartModal: () => void;
  isWishlistModalOpen: boolean;
  openWishlistModal: () => void;
  closeWishlistModal: () => void;
  isVideoModalOpen: boolean;
  openVideoModal: (url?: string) => void;
  closeVideoModal: () => void;
  currentVideoUrl: string | null;
  cartList: ProductDataType[];
  addToCart: (product: ProductDataType) => void;
  updateQuantity: (slug: string, amount: number) => void;
  deleteItem: (slug: string) => void;
  clearCart: () => void;
  totalCartQuantity: number;
  wishlistList: ProductDataType[];
  addToWishlist: (product: ProductDataType) => void;
  deleteWishlistItem: (slug: string) => void;
  clearWishlist: () => void;
  totalWishlistQuantity: number;
  moveWishlistToCart: () => void;
  isPreviewModalOpen: boolean;
  openPreviewModal: (product: ProductDataType) => void;
  closePreviewModal: () => void;
  previewProduct: ProductDataType | null;
  totalCartPrice: number;
}

const Context = createContext<ContextData | undefined>(undefined);

interface ContextProviderProps {
  children: React.ReactNode;
}

const CART_STORAGE_KEY = "zestify_cart_v1";
const WISHLIST_STORAGE_KEY = "zestify_wishlist_v1";

function readStoredList(key: string): ProductDataType[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ProductDataType[]) : [];
  } catch {
    return [];
  }
}

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  // Mobile Menu Modal
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Cart Modal
  const [isCartModalOpen, setIsCartModalOpen] = useState<boolean>(false);
  const openCartModal = () => setIsCartModalOpen(true);
  const closeCartModal = () => setIsCartModalOpen(false);

  // Wishlist Modal
  const [isWishlistModalOpen, setIsWishlistModalOpen] = React.useState(false);
  const openWishlistModal = () => setIsWishlistModalOpen(true);
  const closeWishlistModal = () => setIsWishlistModalOpen(false);

  // Video Modal
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = React.useState<string | null>(
    null,
  );
  const [promoVideoUrl, setPromoVideoUrl] = React.useState<string | null>(null);
  const openVideoModal = (url?: string) => {
    if (url) {
      setCurrentVideoUrl(url);
    } else if (promoVideoUrl) {
      setCurrentVideoUrl(promoVideoUrl);
    } else {
      fetch(`${API_URL}/settings`, { cache: "no-store" })
        .then((r) => r.json())
        .then((j) => {
          const s = j?.data ?? j;
          const next = s?.promoVideoUrl || "";
          if (next) {
            setPromoVideoUrl(next);
            setCurrentVideoUrl(next);
          }
        })
        .catch(() => null);
    }
    setIsVideoModalOpen(true);
  };
  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl(null);
  };

  // Add to cart
  const [cartList, setCartList] = useState<ProductDataType[]>(() => {
    if (typeof window === "undefined") return [];
    return readStoredList(CART_STORAGE_KEY);
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartList));
    } catch {
      return;
    }
  }, [cartList]);

  const addToCart = (product: ProductDataType) => {
    let toastMessage = "";
    const productQuantity = product.quantity ?? 1;

    setCartList((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.slug === product.slug,
      );

      if (existingProduct) {
        toastMessage = "Item quantity updated in cart";
        return prevCart.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: (item.quantity ?? 1) + productQuantity }
            : item,
        );
      } else {
        toastMessage = "Item added to cart";
        return [...prevCart, { ...product, quantity: productQuantity }];
      }
    });

    if (toastMessage) toast.success(toastMessage);
  };

  const updateQuantity = (slug: string, amount: number) => {
    setCartList((prevCart) =>
      prevCart.map((item) =>
        item.slug === slug
          ? {
              ...item,
              quantity: Math.max(1, (item.quantity || 1) + amount),
            }
          : item,
      ),
    );
  };

  const deleteItem = (slug: string) => {
    setCartList((prevCart) => prevCart.filter((item) => item.slug !== slug));
    toast.warning("Product removed from cart.");
  };

  const clearCart = () => {
    setCartList([]);
  };

  const totalCartQuantity = cartList.reduce(
    (total, item) => total + (item.quantity || 0),
    0,
  );

  const totalCartPrice = cartList.reduce(
    (total, item) => total + item.price * (item.quantity ?? 1),
    0,
  );

  // Add to wishlist
  const [wishlistList, setWishlistList] = useState<ProductDataType[]>(() => {
    if (typeof window === "undefined") return [];
    return readStoredList(WISHLIST_STORAGE_KEY);
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistList));
    } catch {
      return;
    }
  }, [wishlistList]);

  const addToWishlist = (product: ProductDataType) => {
    let isAdded = false;

    setWishlistList((prevWishlist) => {
      const existingProduct = prevWishlist.find(
        (item) => item.slug === product.slug,
      );

      if (existingProduct) {
        isAdded = false;
        return prevWishlist;
      }

      isAdded = true;
      return [...prevWishlist, { ...product, quantity: 1 }];
    });

    if (isAdded) {
      toast.success("Item added to Wishlist");
    } else {
      toast.info("Item already in Wishlist");
    }
  };

  const deleteWishlistItem = (slug: string) => {
    setWishlistList((prevWishlist) =>
      prevWishlist.filter((item) => item.slug !== slug),
    );
    toast.warning("Product removed from Wishlist.");
  };

  const clearWishlist = () => {
    setWishlistList([]);
  };

  const totalWishlistQuantity = wishlistList.reduce(
    (total, item) => total + (item.quantity || 0),
    0,
  );

  const moveWishlistToCart = () => {
    let toastMessage = "All items moved to cart";
    setCartList((prevCart) => {
      const newCart = [...prevCart];

      wishlistList.forEach((wishlistItem) => {
        const existingProductIndex = newCart.findIndex(
          (cartItem) => cartItem.slug === wishlistItem.slug,
        );

        if (existingProductIndex !== -1) {
          const existingProduct = newCart[existingProductIndex];
          if (existingProduct) {
            existingProduct.quantity = (existingProduct.quantity || 0) + 1;
          }
        } else {
          newCart.push({ ...wishlistItem, quantity: 1 });
        }
      });

      return newCart;
    });

    setWishlistList([]);
    toast.success(toastMessage);
  };

  // Preview Modal
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<ProductDataType | null>(
    null,
  );

  const openPreviewModal = (product: ProductDataType) => {
    setIsPreviewModalOpen(true);
    setPreviewProduct(product);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewProduct(null);
  };

  // Return
  const contextValue: ContextData = {
    isMobileMenuOpen,
    toggleMobileMenu,
    isCartModalOpen,
    openCartModal,
    closeCartModal,
    isWishlistModalOpen,
    openWishlistModal,
    closeWishlistModal,
    isVideoModalOpen,
    openVideoModal,
    closeVideoModal,
    currentVideoUrl,
    cartList,
    addToCart,
    updateQuantity,
    deleteItem,
    clearCart,
    totalCartQuantity,
    wishlistList,
    addToWishlist,
    totalWishlistQuantity,
    deleteWishlistItem,
    clearWishlist,
    moveWishlistToCart,
    isPreviewModalOpen,
    openPreviewModal,
    closePreviewModal,
    previewProduct,
    totalCartPrice,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useCustomContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useCustomContext must be used within an ContextProvider");
  }
  return context;
};
