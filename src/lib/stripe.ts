import Stripe from 'stripe';

// Lazy initialization to avoid build-time failures when env vars are not set
let _stripeInstance: Stripe | null = null;

export function getStripeInstance(): Stripe {
  if (!_stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not configured');
    }
    _stripeInstance = new Stripe(key, {
      apiVersion: '2026-04-22.dahlia',
    });
  }
  return _stripeInstance;
}

// Re-export as 'stripe' for compatibility with existing import patterns
// Using a getter function pattern instead of direct instantiation
export { getStripeInstance as stripe };
