'use server';

import { stripe } from '@/lib/stripe/server';
import { db } from '@/db/client';
import { users, products, prices, subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function createCheckoutSession({
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  try {
    // Get user from database
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (!user.length) {
      throw new Error('User not found');
    }

    const userData = user[0];

    // Create or get Stripe customer
    let customerId = userData.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await db
        .update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.id, userId));
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

export async function createCustomerPortalSession({
  userId,
  returnUrl,
}: {
  userId: string;
  returnUrl: string;
}) {
  try {
    // Get user from database
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (!user.length || !user[0].stripeCustomerId) {
      throw new Error('User or Stripe customer not found');
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user[0].stripeCustomerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw new Error('Failed to create customer portal session');
  }
}

export async function getProducts() {
  try {
    const productsData = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        image: products.image,
        active: products.active,
      })
      .from(products)
      .where(eq(products.active, true));

    const productsWithPrices = await Promise.all(
      productsData.map(async (product) => {
        const pricesData = await db
          .select()
          .from(prices)
          .where(eq(prices.productId, product.id));

        return {
          ...product,
          prices: pricesData,
        };
      })
    );

    return productsWithPrices;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getUserSubscription(userId: string) {
  try {
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (!subscription.length) {
      return null;
    }

    return subscription[0];
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    throw new Error('Failed to fetch user subscription');
  }
}
