import { NextRequest, NextResponse } from 'next/server';
import { getStripeInstance } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { amount, parentName } = await req.json();
    const stripe = getStripeInstance();
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description: `HES Babysitting May 30 — ${parentName}`,
      automatic_payment_methods: { enabled: true },
    });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
