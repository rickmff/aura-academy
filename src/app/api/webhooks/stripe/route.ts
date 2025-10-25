import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { serverEnv } from '@/lib/env';
import { db } from '@/db/client';
import { products, prices, subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

// Extended Stripe Subscription type with snake_case properties
interface StripeSubscriptionWithSnakeCase {
  id: string;
  status: string;
  metadata: Record<string, string>;
  items: {
    data: Array<{
      price: { id: string };
      quantity?: number;
    }>;
  };
  cancel_at_period_end: boolean;
  current_period_start: number;
  current_period_end: number;
  trial_start?: number | null;
  trial_end?: number | null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      serverEnv.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'product.created':
      case 'product.updated': {
        const product = event.data.object as Stripe.Product;
        
        await db
          .insert(products)
          .values({
            id: product.id,
            active: product.active,
            name: product.name,
            description: product.description,
            image: product.images?.[0] || null,
            metadata: JSON.stringify(product.metadata),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: products.id,
            set: {
              active: product.active,
              name: product.name,
              description: product.description,
              image: product.images?.[0] || null,
              metadata: JSON.stringify(product.metadata),
              updatedAt: new Date(),
            },
          });

        break;
      }

      case 'price.created':
      case 'price.updated': {
        const price = event.data.object as Stripe.Price;
        
        await db
          .insert(prices)
          .values({
            id: price.id,
            productId: price.product as string,
            active: price.active,
            currency: price.currency,
            description: price.nickname,
            type: price.type,
            unitAmount: price.unit_amount,
            interval: price.recurring?.interval || null,
            intervalCount: price.recurring?.interval_count || null,
            trialPeriodDays: price.recurring?.trial_period_days || null,
            metadata: JSON.stringify(price.metadata),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: prices.id,
            set: {
              active: price.active,
              currency: price.currency,
              description: price.nickname,
              type: price.type,
              unitAmount: price.unit_amount,
              interval: price.recurring?.interval || null,
              intervalCount: price.recurring?.interval_count || null,
              trialPeriodDays: price.recurring?.trial_period_days || null,
              metadata: JSON.stringify(price.metadata),
              updatedAt: new Date(),
            },
          });

        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription' && session.subscription) {
          const subscriptionResponse = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const subscriptionData = subscriptionResponse as unknown as StripeSubscriptionWithSnakeCase;
          
          const userId = subscriptionData.metadata.userId;
          
          if (userId) {
            await db
              .insert(subscriptions)
              .values({
                id: subscriptionData.id,
                userId: userId,
                status: subscriptionData.status,
                metadata: JSON.stringify(subscriptionData.metadata),
                priceId: subscriptionData.items.data[0]?.price.id,
                quantity: subscriptionData.items.data[0]?.quantity,
                cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
                currentPeriodStart: new Date(subscriptionData.current_period_start * 1000),
                currentPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
                trialStart: subscriptionData.trial_start ? new Date(subscriptionData.trial_start * 1000) : null,
                trialEnd: subscriptionData.trial_end ? new Date(subscriptionData.trial_end * 1000) : null,
              })
              .onConflictDoUpdate({
                target: subscriptions.id,
                set: {
                  status: subscriptionData.status,
                  metadata: JSON.stringify(subscriptionData.metadata),
                  priceId: subscriptionData.items.data[0]?.price.id,
                  quantity: subscriptionData.items.data[0]?.quantity,
                  cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
                  currentPeriodStart: new Date(subscriptionData.current_period_start * 1000),
                  currentPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
                  trialStart: subscriptionData.trial_start ? new Date(subscriptionData.trial_start * 1000) : null,
                  trialEnd: subscriptionData.trial_end ? new Date(subscriptionData.trial_end * 1000) : null,
                },
              });
          }
        }

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as unknown as StripeSubscriptionWithSnakeCase;
        const userId = subscription.metadata.userId;
        
        if (userId) {
          await db
            .insert(subscriptions)
            .values({
              id: subscription.id,
              userId: userId,
              status: subscription.status,
              metadata: JSON.stringify(subscription.metadata),
              priceId: subscription.items.data[0]?.price.id,
              quantity: subscription.items.data[0]?.quantity,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
              trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
            })
            .onConflictDoUpdate({
              target: subscriptions.id,
              set: {
                status: subscription.status,
                metadata: JSON.stringify(subscription.metadata),
                priceId: subscription.items.data[0]?.price.id,
                quantity: subscription.items.data[0]?.quantity,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
                trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
              },
            });
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await db
          .update(subscriptions)
          .set({
            status: 'canceled',
            canceledAt: new Date(),
            endedAt: new Date(),
          })
          .where(eq(subscriptions.id, subscription.id));

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
