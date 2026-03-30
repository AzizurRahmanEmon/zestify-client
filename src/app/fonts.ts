import { Inter, ZCOOL_XiaoWei } from "next/font/google";

export const primary = ZCOOL_XiaoWei({
  variable: "--primary",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
export const secondary = Inter({
  variable: "--secondary",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});
