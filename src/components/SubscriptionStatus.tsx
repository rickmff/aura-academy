'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createCustomerPortalSession } from '@/server/actions/stripe';
import { useState } from 'react';

interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean | null;
  trialStart: Date | null;
  trialEnd: Date | null;
}

interface SubscriptionStatusProps {
  subscription: Subscription | null;
  userId: string;
}

export function SubscriptionStatus({ subscription, userId }: SubscriptionStatusProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleManageSubscription = async () => {
    if (!userId) return;

    setIsLoading(true);
    
    try {
      const { url } = await createCustomerPortalSession({
        userId: userId,
        returnUrl: `${window.location.origin}/dashboard`,
      });

      window.location.href = url;
    } catch (error) {
      console.error('Error creating customer portal session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don&apos;t have an active subscription. Choose a plan to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = '/pricing'}>
            View Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'canceled':
        return 'text-red-600';
      case 'past_due':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'canceled':
        return 'Canceled';
      case 'past_due':
        return 'Past Due';
      case 'incomplete':
        return 'Incomplete';
      case 'incomplete_expired':
        return 'Incomplete Expired';
      case 'trialing':
        return 'Trial';
      case 'unpaid':
        return 'Unpaid';
      default:
        return status;
    }
  };

  const isTrial = subscription.trialStart && subscription.trialEnd && new Date() < new Date(subscription.trialEnd);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
        <CardDescription>
          Manage your subscription and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Status:</span>
          <span className={`font-semibold ${getStatusColor(subscription.status)}`}>
            {getStatusText(subscription.status)}
          </span>
        </div>
        
        {isTrial && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Trial ends:</span>
            <span>{formatDate(subscription.trialEnd!)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="font-medium">Current period:</span>
          <span>{formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}</span>
        </div>
        
        {subscription.cancelAtPeriodEnd === true && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">
              Your subscription will be canceled at the end of the current period.
            </p>
          </div>
        )}
        
        <Button 
          onClick={handleManageSubscription}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Loading...' : 'Manage Subscription'}
        </Button>
      </CardContent>
    </Card>
  );
}
