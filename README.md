# Zestify Client App

Next.js 15 frontend for the customer-facing Zestify restaurant experience.

## Overview

This app provides the public website and customer workflow for Zestify:

- CMS-driven home page (section order from Admin Page Builder)
- Menu, shop, services, about, gallery, blog (with comments), and contact pages
- Reservation with available-slot checking
- Cart, wishlist, checkout (Stripe / PayPal / COD), coupons, and loyalty points
- Product reviews and nutrition details
- Customer auth with HttpOnly cookies + CSRF (optional OTP)
- Customer dashboard (orders, favorites, addresses, settings)
- Tenant-aware API requests via `NEXT_PUBLIC_TENANT_ID` → `x-tenant-id`

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- A running Zestify API instance

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
copy .env.example .env.local
```

3. Update the environment values to match your API and tenant.

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the Zestify API. App fails at startup if unset. |
| `NEXT_PUBLIC_TENANT_ID` | Yes | Tenant ID sent as `x-tenant-id` on every request. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL for metadata, Open Graph, and canonical links. |
| `NEXT_PUBLIC_OTP_REQUIRED` | No | Must match API `OTP_REQUIRED`. Set `false` to skip OTP in development. |
| `NEXT_PUBLIC_SHOW_DETAILED_API_ERRORS` | No | `true` (dev) shows HTTP details; `false` (production) shows API message only. |
| `NEXT_PUBLIC_SHOW_DEV_OTP` | No | Show OTP on forgot-password screens in local dev only. Keep `false` in production. |

## Development

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production bundle
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint checks

## Production Build

Create a production build:

```bash
npm run build
```

Run the built app locally:

```bash
npm run start
```

## Deployment Notes

- Set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_TENANT_ID`, and `NEXT_PUBLIC_SITE_URL` before building.
- Ensure the API `CORS_ORIGINS` includes your client domain (required for cookie auth).
- Match `NEXT_PUBLIC_OTP_REQUIRED` with the API `OTP_REQUIRED` setting.
- Image loading is configured in `next.config.ts` for Cloudinary (`res.cloudinary.com`) and localhost. Add your own domain to `images.remotePatterns` if needed.
- Stripe/PayPal keys and `FRONTEND_URL` are configured on the API, not in this app.

## Documentation

- `../client-app-doc/index.html` - Detailed installation and deployment guide
- `../api-doc/index.html` - API documentation for the backend
- `../README.html` - Package start-here guide

## CodeCanyon Checklist

Before packaging, verify:

- `npm install`
- `npm run lint`
- `npm run build`
- Environment variables are documented in `.env.example`
- The API backend is running and reachable from the client app
- No author-specific API URLs remain in code or config
