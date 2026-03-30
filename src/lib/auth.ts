type CustomerLike = {
  name: string;
  email: string;
  [k: string]: any;
};

const KEY = "zestify_customer";

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
