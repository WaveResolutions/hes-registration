import { NextRequest, NextResponse } from 'next/server';
import { getStripeInstance } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  let event;

  try {
    const stripe = getStripeInstance();
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as { id: string };
    await prisma.registration.updateMany({
      where: { stripePaymentIntentId: pi.id },
      data: { paymentStatus: 'PAID', paidAt: new Date() },
    });
  }

  return NextResponse.json({ received: true });
}
