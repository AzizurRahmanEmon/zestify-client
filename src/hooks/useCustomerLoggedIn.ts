"use client";

import { useEffect, useState } from "react";
import { getCurrentCustomer } from "@/lib/auth";

export function useCustomerLoggedIn(): boolean {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const sync = () => setLoggedIn(Boolean(getCurrentCustomer()));
    sync();
    window.addEventListener("auth:changed", sync);
    return () => window.removeEventListener("auth:changed", sync);
  }, []);

  return loggedIn;
}
