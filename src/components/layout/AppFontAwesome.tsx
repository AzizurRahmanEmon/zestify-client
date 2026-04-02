"use client";

import { useEffect } from "react";

const AppFontAwesome = () => {
  useEffect(() => {
    import("@/styles/fonts/fontawesome.css");
  }, []);

  return null;
};

export default AppFontAwesome;
