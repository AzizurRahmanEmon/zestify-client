type CustomerLike = {
  name: string;
  email: string;
  [k: string]: any;
};

const KEY = "zestify_customer";
const CART_STORAGE_KEY = "zestify_cart_v1";
const WISHLIST_STORAGE_KEY = "zestify_wishlist_v1";

export function setCurrentCustomer(c: CustomerLike) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(c));
  window.dispatchEvent(new Event("auth:changed"));
}

export function getCurrentCustomer(): CustomerLike | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CustomerLike;
  } catch {
    return null;
  }
}

export function clearCurrentCustomer() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("auth:changed"));
}

export function clearCustomerSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(WISHLIST_STORAGE_KEY);
  window.dispatchEvent(new Event("auth:changed"));
  window.dispatchEvent(new Event("session:cleared"));
}
