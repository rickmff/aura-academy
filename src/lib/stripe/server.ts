import Stripe from 'stripe';
import { serverEnv } from '@/lib/env';

export const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});
