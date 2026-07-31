import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

function verifyShopifyWebhook(body: string, hmacHeader: string): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return false;

  const digest = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(hmacHeader)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256') || '';

  if (!verifyShopifyWebhook(body, hmacHeader)) {
    return NextResponse.json(
      { success: false, message: 'Invalid webhook signature' },
      { status: 401 }
    );
  }

  try {
    const topic = request.headers.get('x-shopify-topic') || '';
    const payload = JSON.parse(body);
    const handle = payload.handle;

    const revalidatedPaths: string[] = [];

    if (handle) {
      revalidatePath(`/product/${handle}`);
      revalidatedPaths.push(`/product/${handle}`);
    }

    revalidatePath('/product/list');
    revalidatePath('/');
    revalidatedPaths.push('/product/list', '/');

    return NextResponse.json({
      success: true,
      topic,
      revalidatedPaths,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
