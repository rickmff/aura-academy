'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createCheckoutSession } from '@/server/actions/stripe';
import { useState } from 'react';

interface Price {
  id: string;
  currency: string;
  unitAmount: number | null;
  interval: string | null;
  intervalCount: number | null;
  trialPeriodDays: number | null;
  active: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  active: boolean;
  prices: Price[];
}

interface PricingCardProps {
  product: Product;
  isPopular?: boolean;
  userId?: string;
}

export function PricingCard({ product, isPopular = false, userId }: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (priceId: string) => {
    if (!userId) {
      // Redirect to sign in
      window.location.href = '/signin';
      return;
    }

    setIsLoading(true);
    
    try {
      const { sessionId } = await createCheckoutSession({
        priceId,
        userId: userId,
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      });

      // Redirect to Stripe Checkout
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: Price) => {
    if (!price.unitAmount) return 'Free';
    
    const amount = price.unitAmount / 100;
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency.toUpperCase(),
    }).format(amount);

    if (price.interval) {
      return `${formattedAmount}/${price.interval}`;
    }
    
    return formattedAmount;
  };

  const primaryPrice = product.prices.find(p => p.active) || product.prices[0];

  if (!primaryPrice) {
    return null;
  }

  return (
    <Card className={`relative ${isPopular ? 'border-primary shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-2xl">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
        <div className="text-3xl font-bold">
          {formatPrice(primaryPrice)}
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Feature 1
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Feature 2
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Feature 3
          </li>
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => handleSubscribe(primaryPrice.id)}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Get Started'}
        </Button>
      </CardFooter>
    </Card>
  );
}
