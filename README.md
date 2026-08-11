# Zestify Client App

Next.js 15 frontend for the customer-facing Zestify restaurant experience.

## Overview

This app provides the public website and customer workflow for Zestify:

- CMS-driven home page (section order controlled from Admin Page Builder)
- Menu, shop, services, about, gallery, blog (with threaded comments), and contact pages
- Table reservation with available-slot checking
- Cart, wishlist, checkout (Stripe / PayPal / Cash on Delivery), coupons, and loyalty points
- Product reviews and nutrition details
- Customer auth with HttpOnly cookies + CSRF (optional email OTP verification)
- Customer dashboard (orders, favorites, addresses, settings)
- Tenant-aware API requests via `NEXT_PUBLIC_TENANT_ID` → `x-tenant-id` header

## Requirements

| Tool        | Version                            | Required |
| ----------- | ---------------------------------- | -------- |
| Node.js     | v18 or higher                      | Yes      |
| npm         | v9 or higher                       | Yes      |
| Zestify API | v1.0+, running locally or deployed | Yes      |

## ⚠️ Third-Party Services & Costs

This app depends on services configured on the **API side**, but since they directly affect what your customers experience (payments, emails), you should know the cost structure before launch:

| Service                                | Free tier                                           | What happens beyond free tier                                                                                                                                                                                                                                                                                          |
| -------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stripe**                             | No monthly fee, pay-per-transaction                 | Every successful card payment is charged a processing fee (currently ~2.9% + $0.30 per transaction in the US; rates vary by country). This is charged directly by Stripe to whoever owns the Stripe account — Zestify does not add any markup. See [stripe.com/pricing](https://stripe.com/pricing) for current rates. |
| **PayPal**                             | No monthly fee, pay-per-transaction                 | Similar per-transaction fee structure to Stripe. See [paypal.com/us/business/paypal-business-fees](https://www.paypal.com/us/business/paypal-business-fees) for current rates.                                                                                                                                         |
| **Resend** (OTP & transactional email) | 100 emails/day, 3,000/month                         | Once you exceed the daily/monthly cap, sending fails until you upgrade to a paid Resend plan. A live restaurant sending order confirmations + OTP codes can hit this limit quickly. See [resend.com/pricing](https://resend.com/pricing).                                                                              |
| **MongoDB Atlas**                      | Free M0 cluster — good for development/testing      | The M0 tier has hard limits (512MB storage, shared CPU, connection caps). A production restaurant with real order/customer volume will need to upgrade to a paid M10+ cluster. See [mongodb.com/pricing](https://www.mongodb.com/pricing).                                                                             |
| **Cloudinary** (image uploads)         | Free tier includes a fixed monthly credit allowance | Image storage/bandwidth beyond the free credits requires a paid plan. See [cloudinary.com/pricing](https://cloudinary.com/pricing).                                                                                                                                                                                    |

None of these are required to run Zestify in development — but if you plan to launch a live restaurant, budget for at least Resend and MongoDB Atlas becoming paid services as usage grows, and factor payment processor fees into your pricing.

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
# Windows
copy .env.example .env.local
# Mac / Linux
cp .env.example .env.local
```

3. Fill in the values in `.env.local` — see the full table below.

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If the homepage loads with your restaurant's live data, you're set up correctly.

## Environment Variables

| Variable                               | Required | Description                                                                                                                               | Example                                                                     |
| -------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`                  | **Yes**  | Base URL of your running Zestify API. The app throws a startup error if this is unset — there is no hardcoded fallback server.            | `http://localhost:5000/api` (dev) / `https://api.yourdomain.com/api` (prod) |
| `NEXT_PUBLIC_TENANT_ID`                | **Yes**  | The restaurant's tenant ID, copied from Admin Dashboard → Tenants after creating your restaurant. Sent as `x-tenant-id` on every request. | `507f1f77bcf86cd799439011`                                                  |
| `NEXT_PUBLIC_SITE_URL`                 | **Yes**  | The public URL of this site, used for metadata, Open Graph tags, and blog canonical links.                                                | `http://localhost:3000` (dev) / `https://yourrestaurant.com` (prod)         |
| `NEXT_PUBLIC_OTP_REQUIRED`             | Optional | Must match the API's `OTP_REQUIRED` setting so login flows agree on whether OTP is needed.                                                | `true` / `false`                                                            |
| `NEXT_PUBLIC_SHOW_DETAILED_API_ERRORS` | Optional | `true` shows raw API error detail (useful in dev). Always set `false` in production so customers only see the friendly message.           | `true` (dev) / `false` (prod)                                               |
| `NEXT_PUBLIC_SHOW_DEV_OTP`             | Optional | Displays the OTP code returned by the API directly on the password-reset screen, for local testing only. Must be `false` in production.   | `true` (dev) / `false` (prod)                                               |

> **Missing or wrong `NEXT_PUBLIC_TENANT_ID`** causes every API call to fail with a `"Tenant context required"` error and the site will render no data.

## Feature Walkthrough

| Page                              | Route                  | What it does                                                                                                                                                         |
| --------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                              | `/`                    | CMS-driven sections (hero, popular items, about, menu preview, team, testimonials, reservation CTA, blog, Instagram) — order and content set from Admin Page Builder |
| Menu                              | `/menu`                | Full menu browsing by category                                                                                                                                       |
| Shop                              | `/shop`                | Product catalog with filter, search, sort, add-to-cart                                                                                                               |
| Product Details                   | `/shop/:slug`          | Nutrition info, customer reviews, related items                                                                                                                      |
| Cart                              | `/cart`                | Quantity management, subtotal/discount/total, persists in localStorage and syncs to the backend for logged-in customers                                              |
| Wishlist                          | `/wishlist`            | Saved items, move-to-cart, persists the same way as cart                                                                                                             |
| Checkout                          | `/checkout`            | Billing details, coupon codes, loyalty point redemption, and payment via Stripe, PayPal, or Cash on Delivery — requires a logged-in customer account                 |
| Reservation                       | `/reservation`         | Date/time/guest-count booking with real-time slot availability checking and email confirmation                                                                       |
| Blog                              | `/blog`, `/blog/:slug` | Posts with categories, tags, search, and threaded comments with likes                                                                                                |
| Login / Register                  | `/login`, `/register`  | Customer auth via HttpOnly cookie + CSRF; optional email OTP step                                                                                                    |
| Forgot Password                   | `/forgot-password`     | Two-step flow: request OTP by email, then set new password with that OTP                                                                                             |
| Dashboard                         | `/dashboard`           | Order history, favorites (derived from past orders), saved addresses, profile settings, and loyalty points balance                                                   |
| Chef                              | `/chef`, `/chef/:slug` | Team listing and individual chef profile pages                                                                                                                       |
| Gallery, About, Services, Contact | —                      | Static/CMS content pages with a contact form and map                                                                                                                 |

**Payments in detail:** Cash on Delivery creates the order directly. Stripe and PayPal both redirect the customer to a hosted checkout page and confirm the order via a redirect-based verify endpoint on return — there are no webhook routes to configure.

**Loyalty points:** customers earn points automatically per order (rate configured in Admin → Settings), see their balance on checkout and the dashboard, and can redeem points for a discount once they hit the configured minimum.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build the production bundle
- `npm run start` — start the production server (run after `build`)
- `npm run lint` — run ESLint checks

## Deployment

### Vercel (recommended)

1. Push the `client-app` folder to a Git repository you own (Vercel deploys from your own repo — there is no Zestify-hosted repo to fork).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repository (or deploy without Git using `npx vercel` from the `client-app` folder).
3. Framework preset: **Next.js**. Root directory: `client-app` (if part of a monorepo). Build command: `npm run build`.
4. In **Settings → Environment Variables**, add all variables from the table above using your production values (HTTPS URLs, `NEXT_PUBLIC_OTP_REQUIRED` matching your API, error/debug flags set to `false`).
5. Click **Deploy**. Vercel serves you a free `.vercel.app` URL; add a custom domain any time.

### Netlify

1. Import the repo at [app.netlify.com](https://app.netlify.com).
2. Build command: `npm run build`. Publish directory: `.next`.
3. Add the same environment variables in **Site Settings → Environment Variables**.
4. Deploy — Netlify auto-redeploys on future pushes to your main branch.

Either way: **always** point `NEXT_PUBLIC_API_URL` at your deployed API (never `localhost`), and make sure the API's `CORS_ORIGINS` includes your deployed client domain — cookie-based auth silently fails otherwise.

## Theme Customization

### Colors

Edit the `@theme` block in `client-app/src/app/globals.css`:

```css
@theme {
  --color-zPink: #b1133a; /* Brand pink / accent */
  --color-zOrange: #ff9c1a; /* Primary CTA / highlights */
  --color-zRed: #cb3a1a; /* Secondary accent */
  --color-textColor: #121212; /* Body text */
  --color-pTextColor: #565656; /* Muted paragraph text */
}
```

Save the file — the dev server hot-reloads the new colors across the storefront.

### Fonts

1. In `client-app/src/app/fonts.ts`, swap the imported Google Fonts (replace the current `ZCOOL_XiaoWei` / `Inter` imports with your chosen families using `next/font/google`).
2. Update `--font-primary` and `--font-secondary` in `globals.css` to match the new family variable names.
3. `layout.tsx` already applies both font variables to `<body>` — no further wiring needed.

## Documentation

- `../client-app-doc/index.html` — full installation, feature, and deployment guide (this README is a condensed version of the same content)
- `../api-doc/index.html` — API documentation for the backend
- `../README.html` — package start-here guide
