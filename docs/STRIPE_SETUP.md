# Stripe Setup Guide

This guide will help you set up Stripe for your SaaS template.

## 1. Environment Variables

### Quick Setup
Copy the example environment file and fill in your values:

```bash
cp env.example .env.local
```

### Required Variables
Add the following environment variables to your `.env.local` file:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Node Environment
NODE_ENV="development"
```

For detailed information about each variable, see [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md).

## 2. Stripe Dashboard Setup

### Create Products and Prices

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Products
3. Create your products and their corresponding prices
4. Make sure to set up recurring subscriptions (monthly/yearly)

### Configure Webhooks

1. Go to Webhooks in your Stripe Dashboard
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select the following events:
   - `product.created`
   - `product.updated`
   - `price.created`
   - `price.updated`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret to your environment variables

### Configure Customer Portal

1. Go to Settings > Billing > Customer Portal
2. Configure your branding and settings
3. Enable the following features:
   - Allow customers to update payment methods
   - Allow customers to update subscriptions
   - Allow customers to cancel subscriptions

## 3. Database Migration

Run the database migration to create the new tables:

```bash
npm run db:generate
npm run db:migrate
```

## 4. Test the Integration

1. Start your development server: `npm run dev`
2. Visit `/pricing` to see your pricing plans
3. Test the checkout flow with Stripe test cards
4. Check your dashboard to see subscription status

## 5. Test Cards

Use these test card numbers for testing:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires authentication**: 4000 0025 0000 3155

## 6. Going Live

When you're ready to go live:

1. Switch to live mode in your Stripe Dashboard
2. Update your environment variables with live keys
3. Update your webhook endpoint to use your production domain
4. Test with real payment methods

## Features Included

- ✅ Stripe Checkout integration
- ✅ Customer Portal for subscription management
- ✅ Webhook handling for real-time updates
- ✅ Database schema for products, prices, and subscriptions
- ✅ Pricing page with product cards
- ✅ Subscription status in dashboard
- ✅ Support for trials and recurring billing

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**: Check your webhook endpoint URL and ensure it's accessible
2. **Environment variables not loading**: Make sure your `.env.local` file is in the project root
3. **Database errors**: Ensure you've run the migrations and your database is accessible

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.
