import { API_URL, COOKIE_SESSION, customerFetchInit } from "@/lib/api";

type CustomerLike = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  token?: string;
  [k: string]: unknown;
};

const KEY = "zestify_customer";
const CART_STORAGE_KEY = "zestify_cart_v1";
const WISHLIST_STORAGE_KEY = "zestify_wishlist_v1";

export { COOKIE_SESSION };

function hasValidAuthToken(token?: string): boolean {
  return Boolean(token && (token === COOKIE_SESSION || token.length > 0));
}

// When `remember` is true the session is kept in localStorage so it survives
// browser restarts. When false it is kept in sessionStorage and is cleared
// when the tab/browser is closed. When `remember` is omitted the session is
// written to whichever storage already holds it (defaulting to localStorage),
// so callers like profile updates don't accidentally move the session.
export function setCurrentCustomer(c: CustomerLike, remember?: boolean) {
  if (typeof window === "undefined") return;
  const value = JSON.stringify({
    ...c,
    token: COOKIE_SESSION,
  });

  if (remember === true) {
    localStorage.setItem(KEY, value);
    sessionStorage.removeItem(KEY);
  } else if (remember === false) {
    sessionStorage.setItem(KEY, value);
    localStorage.removeItem(KEY);
  } else if (sessionStorage.getItem(KEY) !== null) {
    sessionStorage.setItem(KEY, value);
  } else {
    localStorage.setItem(KEY, value);
  }

  window.dispatchEvent(new Event("auth:changed"));
}

export function getCurrentCustomer(): CustomerLike | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CustomerLike;
    if (!hasValidAuthToken(parsed?.token)) {
      localStorage.removeItem(KEY);
      sessionStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    return null;
  }
}

export function clearCurrentCustomer() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
  window.dispatchEvent(new Event("auth:changed"));
}

export function clearCustomerSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(WISHLIST_STORAGE_KEY);
  window.dispatchEvent(new Event("auth:changed"));
  window.dispatchEvent(new Event("session:cleared"));

  void fetch(`${API_URL}/customers/logout`, customerFetchInit({ method: "POST" })).catch(
    () => null,
  );
}
