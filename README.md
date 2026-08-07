# Shopify Ecommerce Starter

This is a Shopify ecommerce website template built with Next.js, Shopify Storefront API, and EdgeOne Pages, offering complete features such as product display, shopping cart, user login, and more.

## Technology Stack
- Frontend Framework: Next.js (SSG)
- UI Component Library: Custom components
- Style: Shadcn-ui
- Type System: TypeScript
- Edge Function: EdgeOne Functions

## Key Features

- Responsive design, adaptable to various devices
- Product list and detail pages
- Shopping cart functionality
- Blog system
- Contact form
- User authentication (login/register)

## Getting Started

### Shopify Setup
Setup your headless shop according to [document](https://edgeone.ai/document/178987340165009408)

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
edgeone pages dev
```

## Project Structure

- `/src/app` - Next.js pages and components
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and configurations
- `/public` - Static resources

## Payment
The project integrates Shopify's payment functionality (beta). To test the payment process, after clicking the checkout button, you need to enter the password: ohfrad.

For test card numbers, refer to the documentation: https://help.shopify.com/en/manual/payments/shopify-payments/testing-shopify-payments

## Environment Variables

Create a `.env` file containing the following variables:

```
SHOPIFY_STORE_DOMAIN=yourshop.myshopify.com
SHOPIFY_API_VERSION=2025-04
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your storefront api access token
SHOPIFY_WEBHOOK_SECRET=your-webhook-secret
```

## On-demand Revalidation

This template supports Incremental Static Regeneration (ISR) — product pages are statically generated at build time and automatically refreshed when data changes.

When a product is created, updated, or deleted in Shopify, a webhook triggers `revalidatePath()` to instantly purge the CDN cache:

```ts
// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  // Verify Shopify HMAC signature
  const payload = JSON.parse(body);
  const handle = payload.handle;

  if (handle) {
    revalidatePath(`/product/${handle}`);
  }
  revalidatePath('/product/list');
  revalidatePath('/');

  return NextResponse.json({ success: true });
}
```

All pages also have `revalidate = 600` (10 minutes) as a time-based fallback. New products added after build are rendered on-demand without redeployment (`dynamicParams = true`).

**Setting up Shopify Webhooks:**

1. In Shopify admin, go to **Settings → Notifications → Webhooks**
2. Create webhooks for `Product creation`, `Product update`, and `Product deletion`
3. Set URL to `https://your-domain/api/revalidate`
4. Copy the signing secret and set it as `SHOPIFY_WEBHOOK_SECRET` environment variable

## Deploy
[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=shopify-ecommerce-starter)