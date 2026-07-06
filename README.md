# Zestify Client App

Next.js frontend for the customer-facing Zestify restaurant experience.

## Overview

This app provides the public website and customer workflow for Zestify:

- Home page and branded content sections
- Menu, services, about, gallery, blog, and contact pages
- Reservation, cart, checkout, wishlist, and authentication flows
- Tenant-aware API requests using the configured restaurant tenant

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

The client app reads the following environment variables:

- `NEXT_PUBLIC_API_URL` — **Required.** Base URL of the Zestify API. The app fails at startup if this is unset (no hardcoded fallback).
- `NEXT_PUBLIC_TENANT_ID` — **Required.** Tenant ID used for scoped requests.
- `NEXT_PUBLIC_OTP_REQUIRED` — Set to `false` to skip OTP during development

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

- Set `NEXT_PUBLIC_API_URL` to your deployed API endpoint before building.
- Make sure the tenant environment values match the demo or production tenant you want to show.
- Image loading is configured in `next.config.ts` for Cloudinary (`res.cloudinary.com`) and localhost. Add your own domain to `images.remotePatterns` if needed.

## Documentation

- `../client-app-doc/index.html` - Detailed installation and deployment guide
- `../api-doc/index.html` - API documentation for the backend

## CodeCanyon Checklist

Before packaging, verify:

- `npm install`
- `npm run lint`
- `npm run build`
- Environment variables are documented in `.env.example`
- The API backend is running and reachable from the client app
- No author-specific API URLs remain in code or config
