import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

// Profiles mirror Supabase auth.users (use auth user id as primary key)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Supabase auth user id (UUID string)
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  theme: text('theme'),
  locale: text('locale'),
  stripeCustomerId: text('stripe_customer_id').unique(),
});

// Stripe products table
export const products = pgTable('products', {
  id: text('id').primaryKey(), // Stripe product ID
  active: boolean('active').notNull().default(true),
  name: text('name').notNull(),
  description: text('description'),
  image: text('image'),
  metadata: text('metadata'), // JSON string
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Stripe prices table
export const prices = pgTable('prices', {
  id: text('id').primaryKey(), // Stripe price ID
  productId: text('product_id').notNull().references(() => products.id),
  active: boolean('active').notNull().default(true),
  currency: text('currency').notNull(),
  description: text('description'),
  type: text('type').notNull(), // 'one_time' or 'recurring'
  unitAmount: integer('unit_amount'), // Amount in cents
  interval: text('interval'), // 'day', 'week', 'month', 'year'
  intervalCount: integer('interval_count').default(1),
  trialPeriodDays: integer('trial_period_days'),
  metadata: text('metadata'), // JSON string
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(), // Stripe subscription ID
  userId: text('user_id').notNull().references(() => users.id),
  status: text('status').notNull(), // 'active', 'canceled', 'incomplete', etc.
  metadata: text('metadata'), // JSON string
  priceId: text('price_id').references(() => prices.id),
  quantity: integer('quantity'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  endedAt: timestamp('ended_at'),
  cancelAt: timestamp('cancel_at'),
  canceledAt: timestamp('canceled_at'),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
});





