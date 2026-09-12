import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Legacy Stripe/PayPal URLs land on /?checkout=… — route to lightweight return page. */
export function middleware(request: NextRequest) {
  const checkout = request.nextUrl.searchParams.get("checkout");
  if (checkout !== "success" && checkout !== "cancel") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/checkout/return";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/",
};
