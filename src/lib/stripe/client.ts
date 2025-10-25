import { loadStripe } from '@stripe/stripe-js';
import { clientEnv } from '@/lib/env';

export const getStripe = () => {
  return loadStripe(clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
};
