/** When true, the API may return OTP in dev responses and the UI may display it. */
export const SHOW_DEV_OTP =
  process.env.NEXT_PUBLIC_SHOW_DEV_OTP?.trim().toLowerCase() === "true";
